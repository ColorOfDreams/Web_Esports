const Event = require('../models/Event');
const Tournament = require('../models/Tournament');
const { mongooseToObject } = require('../../until/mongoose');

class EventsController {
    // GET /events/:slug
    show(req, res, next) {
        Event.findOne({ slug: req.params.slug })
            .then(event => {
                if (!event) return res.status(404).send('Không tìm thấy trận đấu');

                console.log('Event:', event);
                console.log('event.league:', event.league); // Phải là 'LCK' hoặc 'LCP'

                Tournament.findOne({ _id: event.league })
                    .then(tournament => {
                        console.log('Tournament:', tournament);

                        res.render('events/show', {
                            event: mongooseToObject(event),
                            tournament: mongooseToObject(tournament)
                        });
                    })
                    .catch(next);
            })
            .catch(next);
    }
}


module.exports = new EventsController();
