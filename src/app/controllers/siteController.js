const Event = require('../models/Event')
const { multipleMongooseToObject } = require('../../until/mongoose')

class SiteController {

    // Get / site
    index(req, res, next) {
        Event.find({})
            .then(events => {
                res.render('home', {
                    events: multipleMongooseToObject(events)
                })
            })
            .catch(next);
    }
}

module.exports = new SiteController()



