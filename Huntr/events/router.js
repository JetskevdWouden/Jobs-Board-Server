const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { baseURL, token } = require('../constants')


const Event = require('./model');

const { sortData,
        memberCheck, 
        jobCheck, 
        companyCheck } = require('../entries/functions') //correct way of import & export?

axios.defaults.baseURL = baseURL
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }
const token = process.env.token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMTgyMmRjYWM2MjIxMDAwZWM3NjQ3ZSIsImp0aSI6ImQ1NWNkMzgyLTYyYWItNGQzOC04NmE5LThmMDUzNjU0NmZiOSIsImlhdCI6MTU2Mzk5NTQ0MH0.Tsp_8VXXrihtqIkMPdID6nui8JEE2rG_4CysRR4B93A"

router.post('/copy-events', (req, res, next) => {
    axios
        .get(`https://api.huntr.co/org/events?limit=10000`)
        .then(response => {
            const data = response.data.data

            const allEvents = data.map(entity => {
                const event = {
                    id: entity.id,
                    eventType: entity.eventType,
                    jobId: entity.job.id,
                    memberId: entity.member.id,
                    status: entity.toList.name
                }
                return (
                    Event
                        .create(event)
                )
            })
            return Promise.all(allEvents)
        })
        .then(events => {
            res
                .send({ length: events.length })
                .end()
        })
        .catch(error => next(error))
})

//WEBHOOK ENDPOINT
router.post('/events', (req, res, next) => {
    const eventData = req.body
    const member = eventData.member
    const job = eventData.job

    const event = {
        id: eventData.id,
        jobId: job.id,
        memberId: member.id,
        eventType: eventData.eventType,
        status: eventData.toList.name,
    }

    // memberCheck(eventData)
    // jobCheck(eventData)
    // companyCheck(eventData)
    // sortData(eventData)

    Event
        .create(event)
        .then(event => {
            //always send back http code 200 to webhook!!
            res
                .status(200)
        })
        .catch(error => next(error))
})

router.get('/events', (req, res, next) => {
    Event
        .findAll()
        .then(events => {
            res
                .status(200)
                .send({
                    message: "ALL EVENTS",
                    events: events
                })
        })
        .catch(error => next(error))
})

module.exports = router
