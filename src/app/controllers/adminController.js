const Event = require('../models/Event')
const { multipleMongooseToObject } = require('../../until/mongoose')

class AdminController {
    // GET /admin/stored/events
    storedEvents(req, res, next) {
        Event.find({})
            .then(events => res.render('admin/stored-events', {
                events: multipleMongooseToObject(events)
            }))
            .catch(next)
    }
}

module.exports = new AdminController()
