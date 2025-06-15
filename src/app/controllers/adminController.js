const Event = require('../models/Event');
const TicketStock = require('../models/TicketStock');
const User = require('../models/User');
const { multipleMongooseToObject, mongooseToObject } = require('../../until/mongoose');

class AdminController {
    // GET /admin/stored/events
    storedEvents(req, res, next) {
        Event.find({})
            .then(events => res.render('admin/stored-events', {
                events: multipleMongooseToObject(events)
            }))
            .catch(next);
    }

    // GET /admin/stored/tickets

    storedTickets(req, res, next) {
        Promise.all([
            TicketStock.find({}),
            Event.find({})
        ])
            .then(([tickets, events]) => {
                const plainTickets = multipleMongooseToObject(tickets);
                const plainEvents = multipleMongooseToObject(events);
                const eventMap = {};

                plainEvents.forEach((event) => {
                    eventMap[event.slug] = event;
                });

                const enrichedTickets = plainTickets.map((ticket) => {
                    return {
                        ...ticket,
                        event: eventMap[ticket.eventSlug] || null
                    };
                });

                res.render('admin/stored-tickets', {
                    tickets: enrichedTickets
                });
            })
            .catch(next);
    }



    // GET /admin/tickets/create
    async createTicketForm(req, res) {
        try {
            const events = await Event.find({});
            res.render('admin/create-ticket', {
                events: multipleMongooseToObject(events)
            });
        } catch (err) {
            res.redirect('back');
        }
    }

    // POST /admin/tickets/store
    async storeTicket(req, res) {
        try {
            const { type, price, total, remaining, eventSlug } = req.body;

            const ticket = new TicketStock({ type, price, total, remaining, eventSlug });
            await ticket.save();

            res.redirect('/admin/stored/tickets');
        } catch (err) {
            console.error(err);
            res.redirect('back');
        }
    }

    // GET /admin/tickets/:id/edit
    async editTicketForm(req, res, next) {
        try {
            const ticket = await TicketStock.findById(req.params.id);
            res.render('admin/edit-ticket', {
                ticket: mongooseToObject(ticket)
            });
        } catch (err) {
            next(err);
        }
    }

    // PUT /admin/tickets/:id
    async updateTicket(req, res, next) {
        try {
            await TicketStock.updateOne({ _id: req.params.id }, req.body);
            res.redirect('/admin/stored/tickets');
        } catch (err) {
            next(err);
        }
    }

    // DELETE /admin/tickets/:id
    async deleteTicket(req, res, next) {
        try {
            await TicketStock.deleteOne({ _id: req.params.id });
            res.redirect(req.query.redirectUrl || '/admin/stored/tickets');
        } catch (err) {
            next(err);
        }
    }

    async storedUsers(req, res, next) {
        try {
            const users = await User.find({});
            res.render('admin/stored-users', {
                users: multipleMongooseToObject(users)
            });
        } catch (err) {
            next(err);
        }
    }

    async topupForm(req, res, next) {
        try {
            const user = await User.findById(req.params.id);
            res.render('admin/topup', { user: mongooseToObject(user) });
        } catch (err) {
            next(err);
        }
    }

    async topupBalance(req, res, next) {
        try {
            const { amount } = req.body;
            const parsedAmount = parseInt(amount);

            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                req.flash('error_msg', 'Số tiền không hợp lệ');
                return res.redirect('back');
            }

            await User.updateOne(
                { _id: req.params.id },
                { $inc: { balance: parsedAmount } }
            );

            req.flash('success_msg', 'Nạp tiền thành công!');
            res.redirect('/admin/stored/users');
        } catch (err) {
            next(err);
        }
    }


}

module.exports = new AdminController();
