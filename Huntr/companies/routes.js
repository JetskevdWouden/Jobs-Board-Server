const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Company = require('./model')
const Duplicate = require('../duplicates/model')
const { removeDuplicateCompanies } = require('./removeDuplicates')
const {baseURL, token} = require('../constants')

console.log('tokenDog', baseURL, token);

axios.defaults.baseURL = baseURL
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

router.post('/copy-companies', function (req, res, next) {
  axios.get(`${baseURL}/employers?limit=10000`)
    .then(response => {
      console.log('Then 1');
      
      const employers = response.data.data
      const noDuplicateEmployers = removeDuplicateCompanies(employers)

      const allCompanies = noDuplicateEmployers.map(employer => {
        const companies = {
          ...employer,
          companyId: employer.id,
        }
        const relations = { include: [{ model: Duplicate }] }

        return Company.create(companies, relations)
      })
      return Promise.all(allCompanies)
    })
    .then(companies => {
      res.send({ length: companies.length }).end()
    })
    .catch(error => {
      console.log('Catch Companies', error);
      next(error)
    })
})

router.get('/companies', function (req, res, next) {
  const page = req.query.page
  const sortProperty = req.query.sortBy
  const limit = 12
  const offset = page * limit

  let searchName = {}
  if (req.query.search !== undefined) {
    searchName = {
      name: { [Op.like]: `%${req.query.search}%` }
    }
  }
  Company
    .findAndCountAll({
      limit, offset,
      order: [[sortProperty, 'DESC']],
      where: searchName
    })
    .then(companies => {
      const { count } = companies
      const pages = Math.ceil(count / limit)
      res.send({ rows: companies.rows, pages }).end()
    })
    .catch(error => next(error))
})

router.get('/companies/:id', function (req, res, next) {
  const { id } = req.params
  Company
    .findByPk(id)
    .then(company => res.send(company).end())
    .catch(error => next(error))
})

router.get('/companies/indeed/:name', function (req, res, next) {
  const { name } = req.params
  const searchName = {
    name: { [Op.like]: `${name.toLowerCase()}%` }
  }
  Company
    .findOne({
      where: searchName
    })
    .then(companies => {
      res.send(companies)
        .end()
    })
    .catch(error => next(error))
})

module.exports = router