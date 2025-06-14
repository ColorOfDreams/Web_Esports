const Event = require('../models/Event')
const Tournament = require('../models/Tournament')
const { mongooseToObject } = require('../../until/mongoose')

class EventsController {
    // GET /events/:slug
    show(req, res, next) {
        Event.findOne({ slug: req.params.slug })
            .then(event => {
                if (!event) return res.status(404).send('Không tìm thấy trận đấu');
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
    // GET /events/createẽ
    create(req, res, next) {
        res.render('events/create')
    }

    // POST /events/store
    store(req, res, next) {
        const event = new Event(req.body);
        event.save()
            .then(() => res.redirect('/'))
            .catch(error => {
            })
    }

    // EDIT /events/:id/store
    edit(req, res, next) {
        Event.findById(req.params.id)
            .then(event => {
                res.render('events/edit', {
                    event: mongooseToObject(event)
                })
            })
    }

    // Update /events/:id/store
    update(req, res, next) {
        Event.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/admin/stored/events'))
            .catch(next)
    }

    destroy(req, res, next) {
        const redirectUrl = req.query.redirectUrl || '/events'; // fallback nếu không có
        Event.deleteOne({ _id: req.params.id })
            .then(() => res.redirect(redirectUrl))
            .catch(next);
    }

}

// GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD

module.exports = new EventsController();