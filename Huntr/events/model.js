const Sequelize = require('sequelize')
const sequelize = require('../../db')

const Member = require('../members/model')
const Job = require('../jobs/model')

const Event = sequelize.define(
    'events',
    {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        eventType: {
            type: Sequelize.STRING,
        },
        memberId: {
            type: Sequelize.STRING
        },
        jobId: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'events',
        timestamps: false
    }
)

// Event.belongsTo(Member)
// Event.belongsTo(Job)

module.exports = Event