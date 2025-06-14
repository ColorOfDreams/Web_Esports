const Event = require('../models/Event')
const Ticket = require('../models/Ticket')
const { mongooseToObject } = require('../../until/mongoose')

class ticketController {
    // GET /events/:slug
    async buy(req, res) {
        if (!req.session?.userId) {
            return res.redirect('/auth/login') // nếu chưa đăng nhập
        }
        const eventId = req.params.eventId;
        const { type, quantity } = req.body;

        try {
            const event = await Event.findById(eventId);
            if (!event) return res.status(404).send('Không tìm thấy trận đấu');

            // Kiểm dư ghế nếu cần
            // kiểm tài chính nếu User đủ để mua vé
            // Ở đây chỉ minh họa
            for (let i = 0; i < quantity; i++) {
                await Ticket.create({
                    matchId: eventId,
                    userId: req.session?.userId,
                    type
                })
            }
            res.redirect('/ticket/success'); // Chuyển đến trang thông báo mua thành công
        } catch (err) {
            res.status(500).send(err.toString())
        }
    }
}

module.exports = new ticketController()