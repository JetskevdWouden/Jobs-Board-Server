//NOTES
//this file is a work in progess
//purpose: sort the data coming in through the webhook endpoint
//check if company exists in Jobs-Board database --> if not: create
//check if columns (e.g.applicationCount) in table 'comapnies' needs to be updated --> if yes: update
//check if job exists in Jobs-Board databse --> if not: create
//check if memeber exists in Jobs-Board databse --> if not: create

const Entry = require('../entries/model');
const Job = require('../jobs/model');
const Company = require('../companies/model');

const companyCheck = (eventData) => {
    const employer = eventData.employer
    Company
        .findOne({
            where: {
                id: eventData.employer.id
            }
        })
        .then(company => {
            if (!company) {
                Company
                    .create({
                        id: employer.id,
                        name: employer.name,
                        interviewCount: employer.interviewCount,
                        jobCount: employer.jobCount,
                        offerCount: employer.offerCount,
                        domain: employer.domain,
                        description: employer.description
                    })
                    .then(company => {

                    })
                    .catch(console.error)
            }
        })
        .catch(console.error)
}

const jobCheck = (eventData) => {
    const job = eventData.job
    Job
        .findOne({
            where: {
                id: job.id
            }
        })
        .then(entity => {
            if (!entity) {
                Job
                    .create({
                        id: job.id,
                        title: job.title,
                        employer: job.employer.name,
                        url: job.url
                    })
                    .catch(console.error)
            }
        })
        .catch(console.error)
}

const memberCheck = (eventData) => {
    Member
        .findOne({
            where: {
                id: eventData.member.id
            }
        })
        .then(entity => {
            if (!entity) {
                Member
                    .create({
                        id: member.id,
                        givenName: member.givenName,
                        familyName: member.familyName,
                        email: member.email
                    })
                    .then(newMember => {

                    })
                    .catch(console.error)
            }
        })
        .catch(error => next(error))
}

const sortData = (eventData) => {
    const eventType = eventData.eventType

    switch (eventType) {
        case "JOB_ADDED":
            return jobAdded(eventData)
        case "JOB_MOVED":
            return jobMoved(eventData)
        case ("JOB_APPLICATION_DATE_SET" || "JOB_FIRST_INTERVIEW_DATE_SET" || "JOB_SECOND_INTERVIEW_DATE_SET" || "JOB_OFFER_DATE_SET"):
            return jobStatusDateSet(eventData)
        default:
            return
    }
}

const jobAdded = (eventData) => {
    const status = eventData.toList.name
    const memberId = eventData.member.id
    const jobId = eventData.job.id
    const date = new Date()

    switch (status) {
        case "Wishlist":
            Entry
                .create({
                    jobId: jobId,
                    memberId: memberId,
                    status: status,
                    wishlistDate: date
                })
                .then(entry => {
                    return
                })
                .catch(console.error)
            return
        case "Rejected":
            Entry
                .create({
                    jobId: jobId,
                    memberId: memberId,
                    status: status,
                    rejectionDate: date
                })
                .then(entry => {
                    return
                })
                .catch(console.error)
            return
        default:
            return
    }
}

const jobMoved = (eventData) => {
    const status = eventData.toList.name
    const memberId = eventData.member.id
    const jobId = eventData.job.id
    const date = new Date()

    switch (status) {
        case "Wishlist":
            Entry
                .findOne({
                    where: {
                        jobId: jobId,
                        memberId: memberId
                    }
                })
                .then(entry => {
                    entry
                        .update({
                            status: status,
                            wishlistDate: date
                        })
                        .then(entry => {
                            return
                        })
                        .catch(console.error)
                })
                .catch(console.error)
            return
        case "Applied":
                Entry
                .findOne({
                    where: {
                        jobId: jobId,
                        memberId: memberId
                    }
                })
                .then(entry => {
                    entry
                        .update({
                            status: status,
                            applicationDate: date
                        })
                        .then(entry => {
                            return
                        })
                        .catch(console.error)
                })
                .catch(console.error)
            return
        case "1st Interview":
                Entry
                .findOne({
                    where: {
                        jobId: jobId,
                        memberId: memberId
                    }
                })
                .then(entry => {
                    entry
                        .update({
                            status: status,
                            firstInterviewDate: date
                        })
                        .then(entry => {
                            return
                        })
                        .catch(console.error)
                })
                .catch(console.error)
            return
        case "2nd Interview":
                Entry
                .findOne({
                    where: {
                        jobId: jobId,
                        memberId: memberId
                    }
                })
                .then(entry => {
                    entry
                        .update({
                            status: status,
                            secondInterviewDate: date
                        })
                        .then(entry => {
                            return
                        })
                        .catch(console.error)
                })
                .catch(console.error)
            return
        case "Offer":
                Entry
                .findOne({
                    where: {
                        jobId: jobId,
                        memberId: memberId
                    }
                })
                .then(entry => {
                    entry
                        .update({
                            status: status,
                            offerDate: date
                        })
                        .then(entry => {
                            return
                        })
                        .catch(console.error)
                })
                .catch(console.error)
            return
        case "Rejected":
            Entry
                .findOne({
                    where: {
                        jobId: jobId,
                        memberId: memberId
                    }
                })
                .then(entry => {
                    entry
                        .update({
                            status: status,
                            rejectionDate: date
                        })
                        .then(entry => {
                            return
                        })
                        .catch(console.error)
                })
                .catch(console.error)
            return

        default:
            return
    }

}

const jobStatusDateSet = (eventData) => {
    const memberId = eventData.member.id
    const jobId = eventData.job.id
    const date = new Date()
    const eventType = eventData.eventType

    switch (eventType) {
        case "JOB_APPLICATION_DATE_SET":
            Entry
                .findOne({
                    where: {
                        jobId: jobId,
                        memberId: memberId
                    }
                })
                .then(entry => {
                    if (!entry) {
                        Entry
                            .create({
                                jobId: jobId,
                                memberId: memberId,
                                status: "Applied",
                                // applicationDate: new Date(eventData.job.applicationDate)
                                applicationDate: date
                            })
                            .then(newEntry => {
                                return
                            })
                            .catch(console.error)
                    } else {
                        entry
                            .update({
                                // status: "Applied",
                                // applicationDate: new Date(eventData.job.applicationDate)
                                applicationDate: date
                            })
                            .then(entry => {
                                return
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error)
            return

        case "JOB_FIRST_INTERVIEW_DATE_SET":
            Entry
                .findOne({
                    where: {
                        jobId: jobId,
                        memberId: memberId
                    }
                })
                .then(entry => {
                    if (!entry) {
                        Entry
                            .create({
                                jobId: jobId,
                                memberId: memberId,
                                status: "1st Interview",
                                // firstInterviewDate: new Date(eventData.job.firstInterviewDate)
                                firstInterviewDate: date
                            })
                            .then(newEntry => {
                                return
                            })
                            .catch(console.error)
                    } else {
                        entry
                            .update({
                                // status: "1st Interview",
                                // firstInterviewDate: new Date(eventData.job.firstInterviewDate)
                                firstInterviewDate: date
                            })
                            .then(entry => {
                                return
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error)
            return

        case "JOB_SECOND_INTERVIEW_DATE_SET":
            Entry
                .findOne({
                    where: {
                        jobId: jobId,
                        memberId: memberId
                    }
                })
                .then(entry => {
                    if (!entry) {
                        Entry
                            .create({
                                jobId: jobId,
                                memberId: memberId,
                                status: "2nd Interview",
                                // secondInterviewDate: new Date(eventData.job.secondInterviewDate)
                                secondInterviewDate: date
                            })
                            .then(newEntry => {
                                return
                            })
                            .catch(console.error)
                    } else {
                        entry
                            .update({
                                // status: "2nd Interview",
                                // secondInterviewDate: new Date(eventData.job.secondInterviewDate)
                                secondInterviewDate: date
                            })
                            .then(entry => {
                                return
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error)
            return

        case "JOB_OFFER_DATE_SET":
            Entry
                .findOne({
                    where: {
                        jobId: jobId,
                        memberId: memberId
                    }
                })
                .then(entry => {
                    if (!entry) {
                        Entry
                            .create({
                                jobId: jobId,
                                memberId: memberId,
                                status: "Offer",
                                // offerDate: new Date(eventData.job.offerDate)
                                offerDate: date
                            })
                            .then(newEntry => {
                                return
                            })
                            .catch(console.error)
                    } else {
                        entry
                            .update({
                                // status: "Offer",
                                // offerDate: new Date(eventData.job.offerDate)
                                offerDate: date
                            })
                            .then(entry => {
                                return
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error)
            return

        default:
            return
    }
}

module.exports = { sortData, memberCheck, jobCheck, companyCheck }
