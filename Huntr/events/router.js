//NOTES --> EVENTS = events taht are coming in through the webhook

const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const Event = require('./model');

//2ed1d6b2-e7b2-416e-875e-bb48d70d3da4


const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMTgyMmRjYWM2MjIxMDAwZWM3NjQ3ZSIsImp0aSI6IjJlZDFkNmIyLWU3YjItNDE2ZS04NzVlLWJiNDhkNzBkM2RhNCIsImlhdCI6MTU1NDgyNTEzMX0.hOfXhHcElNhCOMtM_TTwHr6tf6VhFmL0uzUEuT9hNjk"
axios.defaults.baseURL = 'https://api.huntr.co/org'
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

router.post('/copy-events', (req, res, next) => {
    axios
        .get(`https://api.huntr.co/org/events`)
        .then(response => {
            const data = response.data.data

            const allEvents = data.map(entity => {
                const event = {
                    id: entity.id,
                    eventType: entity.eventType,
                    jobId: entity.job.id,
                    memberId: entity.member.id
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
//!!EDIT TO SEND TO CORRECT FUNCTION DEPENDING ON EVENTYPE
router.post('/events', (req, res, next) => {
    const data = req.body
    const event = {
        id: data.id,
        eventType: data.eventType,
        // jobId: data.job.id,
        // memberId: data.member.id
    }

    Event
        .create(event)
        .then(event => {
            res
                //webhook expects status 200 back
                .status(200)
                .send({
                    message: "NEW EVENT CREATED",
                    event: event
                })
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

//NOTES - for once the webhook is working
// router.post('/events', (req, res, next) => {
//     const data = req.body
//     const event = {
//         id: data.id,
//         eventType: data.eventType,
//         jobId: data.job.id,
//         memberId: data.member.id
//     }

//     //create event
//     Event
//         .create(event)
//         .then(event => {
//             res
//                 //webhook expects status 200 back
//                 .status(200)
//                 .send({
//                     message: "NEW EVENT CREATED",
//                     event: event
//                 })
//         })
//         .catch(error => next(error))

//     //what to do with incoming information?!
//     if (data.eventType === "JOB_ADDED") {
//         //function job added
//         //check if job exists if not create job
//         //create entry
//     } else if (data.eventType === "JOB_MOVED") {
//         //function
//         //update entry || if not exist create entry
//     } else if (data.eventType === "JOB_APPLICATION_DATE_SET") {
//         //function
//         //update entry || if not exist create entry
//     } else if (data.eventType === "JOB_FIRST_INTERVIEW_DATE_SET") {
//         //function
//         //update entry || if not exist create entry
//     } else if (data.eventType === "JOB_SECOND_INTERVIEW_DATE_SET") {
//         //update entry || if not exist create entry
//     } else if (data.eventType === "JOB_OFFER_DATE_SET") {
//         //update entry || if not exist create entry
//     } else {
//         //not a correct event name
//     }
// })