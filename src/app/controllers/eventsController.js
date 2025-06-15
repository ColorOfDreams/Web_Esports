const Event = require('../models/Event');
const Tournament = require('../models/Tournament');
const { mongooseToObject, multipleMongooseToObject } = require('../../until/mongoose');
const TicketStock = require('../models/TicketStock');

class EventsController {
    // GET /events/:slug
    async show(req, res, next) {
        try {
            const event = await Event.findOne({ slug: req.params.slug });

            if (!event) {
                return res.status(404).send('Không tìm thấy trận đấu');
            }

            const ticketStocks = await TicketStock.find({ eventSlug: event.slug });

            if (!ticketStocks || ticketStocks.length === 0) {
                console.warn('⚠️ Không tìm thấy vé cho eventSlug:', event.slug);
            }

            const tournament = await Tournament.findOne({ _id: event.league });

            if (!tournament) {
                console.warn('⚠️ Không tìm thấy tournament cho ID:', event.league);
            }

            res.render('events/show', {
                event: mongooseToObject(event),
                tournament: tournament ? mongooseToObject(tournament) : null,
                ticketStocks: multipleMongooseToObject(ticketStocks)
            });

        } catch (err) {
            next(err);
        }
    }

    // GET /events/create
    create(req, res) {
        res.render('events/create');
    }


    store(req, res, next) {
        const event = new Event(req.body);

        event.save()
            .then(async (savedEvent) => {
                // Sau khi tạo sự kiện thành công, tạo các vé mặc định
                const defaultStocks = [
                    {
                        eventSlug: savedEvent.slug,
                        type: 'master',
                        total: 100,
                        remaining: 100,
                        price: 100
                    },
                    {
                        eventSlug: savedEvent.slug,
                        type: 'grandmaster',
                        total: 50,
                        remaining: 50,
                        price: 200
                    },
                    {
                        eventSlug: savedEvent.slug,
                        type: 'challenge',
                        total: 30,
                        remaining: 30,
                        price: 300
                    }
                ];

                await TicketStock.insertMany(defaultStocks);
                res.redirect('/');
            })
            .catch(next);
    }


    // GET /events/:id/edit
    edit(req, res, next) {
        Event.findById(req.params.id)
            .then(event => {
                res.render('events/edit', {
                    event: mongooseToObject(event)
                });
            });
    }

    // PUT /events/:id
    update(req, res, next) {
        Event.updateOne({ _id: req.params.id }, req.body)
            .then(async () => {
                const event = await Event.findById(req.params.id);

                if (event && event.slug) {
                    // Reset lại số lượng vé về ban đầu
                    const updates = {
                        master: { total: 100, remaining: 100, price: 100 },
                        grandmaster: { total: 50, remaining: 50, price: 200 },
                        challenge: { total: 30, remaining: 30, price: 300 }
                    };

                    for (const [type, data] of Object.entries(updates)) {
                        await TicketStock.updateOne(
                            { eventSlug: event.slug, type },
                            {
                                $set: {
                                    total: data.total,
                                    remaining: data.remaining,
                                    price: data.price
                                }
                            },
                            { upsert: true } // nếu chưa có vé → tạo mới
                        );
                    }
                }

                res.redirect('/admin/stored/events');
            })
            .catch(next);
    }

    // DELETE /events/:id
    destroy(req, res, next) {
        const redirectUrl = req.query.redirectUrl || "/events";
        Event.deleteOne({ _id: req.params.id })
            .then(() => res.redirect(redirectUrl))
            .catch(next);
    }
}

module.exports = new EventsController();
