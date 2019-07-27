//NOTES --> ENTRY = the status of a "jo" in regards to a member 

const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const { baseURL, token } = require('../constants')
const Entry = require('./model');

axios.defaults.baseURL = baseURL
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

//all records of all jobs of all members
router.get('/entries', (req, res, next) => {
    Entry
        .findAll()
        .then(entries => {
            res
                .status(200)
                .send({
                    message: "ALL ENTRIES",
                    entries: entries
                })
        })
        .catch(error => next(error))
})



 module.exports = router