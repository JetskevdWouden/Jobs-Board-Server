//NOTES --> ENTRY = the status of a "jo" in regards to a member 

const Entry = require('../entries/model');
const Job = require('../jobs/model');
const Company = require('../companies/model');

const companyCheck = (eventData) => {
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
                        id: eventData.employer.id,
                        name: eventData.employer.name,
                        interviewCount: eventData.employer.interviewCount,
                        jobCount: eventData.employer.jobCount,
                        offerCount: eventData.employer.offerCount,
                        domain: eventData.employer.domain,
                        description: eventData.employer.description
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

                })
                .catch(console.error)

        case "Rejected":
            Entry
                .create({
                    jobId: jobId,
                    memberId: memberId,
                    status: status,
                    rejectionDate: date
                })
                .then(entry => {
                })
                .catch(console.error)

        default:
            return
    }
}

///!!if an entry is moved huntr send 2 events // a JOB_MOVED and JOB_**_DATE_SET
//so only edit rejection and wishlist in jobMoved
const jobMoved = (eventData) => {
    const status = eventData.toList.name
    const memberId = eventData.member.id
    const jobId = eventData.job.id
    const date = new Date()

    switch (status) {
        case "Wishlist":
            return (
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

                            })
                            .catch(console.error)
                    })
                    .catch(console.error)
            )
        case "Rejected":
            return (
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

                            })
                            .catch(console.error)
                    })
                    .catch(console.error)
            )
        default:
            return
    }

}

//check if entry exdist if not make --> because 2 events being sent
const jobStatusDateSet = (eventData) => {
    const memberId = eventData.member.id
    const jobId = eventData.job.id
    const date = new Date()
    const eventType = eventData.eventType

    //check if exists if not create
    switch (eventType) {
        case "JOB_APPLICATION_DATE_SET":
            return (
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
                                    applicationDate: eventData.job.applicationDate
                                })
                                .then(newEntry => {

                                })
                                .catch(console.error)
                        } else {
                            entry
                                .update({
                                    status: "Applied",
                                    applicationDate: eventData.job.applicationDate
                                })
                                .then(entry => {

                                })
                                .catch(console.error)
                        }
                    })
                    .catch(console.error)
            )
        case ("JOB_FIRST_INTERVIEW_DATE_SET"):
            return (
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
                                    firstInterviewDate: eventData.job.firstInterviewDate
                                })
                                .then(newEntry => {

                                })
                                .catch(console.error)
                        } else {
                            entry
                                .update({
                                    status: "1st Interview",
                                    firstInterviewDate: eventData.job.firstInterviewDate
                                })
                                .then(entry => {

                                })
                                .catch(console.error)
                        }
                    })
                    .catch(console.error)
            )
        case ("JOB_SECOND_INTERVIEW_DATE_SET"):
            return (
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
                                    secondInterviewDate: eventData.job.secondInterviewDate
                                })
                                .then(newEntry => {

                                })
                                .catch(console.error)
                        } else {
                            entry
                                .update({
                                    status: "2nd Interview",
                                    secondInterviewDate: eventData.job.secondInterviewDate
                                })
                                .then(entry => {

                                })
                                .catch(console.error)
                        }
                    })
                    .catch(console.error)
            )
        case "JOB_OFFER_DATE_SET":
            return (
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
                                    offerDate: eventData.job.offerDate
                                })
                                .then(newEntry => {

                                })
                                .catch(console.error)
                        } else {
                            entry
                                .update({
                                    status: "Offer",
                                    offerDate: eventData.job.offerDate
                                })
                                .then(entry => {

                                })
                                .catch(console.error)
                        }
                    })
                    .catch(console.error)
            )
        default:
            return
    }
}

module.exports = { sortData, memberCheck, jobCheck, companyCheck }

//NOTES
// const entryCheck = (memberId, jobId) => {
//     Entry
//         .findOne({
//             where: {
//                 jobId: jobId,
//                 memberId: memberId
//             }
//         })
//         .then(entity => {
//             if (!entity) {
//                 Entry
//                     .create({
//                         jobId: jobId,
//                         memberId: memberId
//                     })
//                     .then(newEntry => {
//                         return newEntry
//                     })
//                     .catch(console.error)
//             } else {
//                 return entity
//             }
//         })
//         .catch(console.error)
// }