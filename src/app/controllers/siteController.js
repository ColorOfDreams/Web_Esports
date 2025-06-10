const Event = require('../models/Event')
const { multipleMongooseToObject } = require('../../until/mongoose')

class SiteController {

    // Get / site
    index(req, res, next) {
        Event.find({})
            .then(event => {
                res.render('home', {
                    event: multipleMongooseToObject(event)
                })
            })
            .catch(next);
    }
}

module.exports = new SiteController()



