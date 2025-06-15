const Ticket = require('../models/Ticket');
const TicketStock = require('../models/TicketStock');
const User = require('../models/User');
const Event = require('../models/Event');
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "83e4fdff7f243f",
        pass: "1e5b48f2a33644"
    }
});

class TicketController {
    async buy(req, res) {
        const { ticketStockId } = req.body;

        if (!req.session.user) {
            req.flash('error_msg', 'Bạn cần đăng nhập để đặt vé.');
            return res.redirect('/auth/login');
        }

        try {
            const stock = await TicketStock.findById(ticketStockId);
            if (!stock || stock.remaining <= 0) {
                req.flash('error_msg', 'Vé đã hết hoặc không tồn tại.');
                return res.redirect('/');
            }

            const event = await Event.findOne({ slug: stock.eventSlug });
            if (!event) {
                req.flash('error_msg', 'Không tìm thấy sự kiện.');
                return res.redirect('/');
            }

            const user = await User.findById(req.session.user.id);
            if (user.balance < stock.price) {
                req.flash('error_msg', 'Không đủ tiền trong tài khoản.');
                return res.redirect(`/events/${stock.eventSlug}`);
            }

            const qrPayload = `TICKET|${user.email}|${stock.eventSlug}|${stock.type}|${Date.now()}`;
            const qrCodeData = await QRCode.toDataURL(qrPayload);

            const ticket = new Ticket({
                event: event._id,           // ✅ KHỚP với schema Ticket
                user: user._id,
                price: stock.price,
                type: stock.type,
                qrCodeData
            });
            stock.remaining -= 1;
            user.balance -= stock.price;

            await Promise.all([ticket.save(), stock.save(), user.save()]);

            await transporter.sendMail({
                from: 'Web Esports <noreply@webesports.vn>',
                to: user.email,
                subject: `Xác nhận đặt vé ${stock.type.toUpperCase()}`,
                html: `
          <h2>Chúc mừng bạn đã đặt vé thành công</h2>
          <p>Sự kiện: ${event.team1.name} vs ${event.team2.name}</p>
          <p>Loại vé: ${stock.type}</p>
          <p>Giá vé: ${stock.price} VNĐ</p>
          <img src="${qrCodeData}" alt="Mã QR Vé"/>
        `
            });

            req.flash('success_msg', `Đặt vé ${stock.type} thành công!`);
            res.redirect(`/events/${stock.eventSlug}`);
        } catch (err) {
            console.error('[❌ LỖI MUA VÉ]', err);
            return res.status(500).send(`<pre>${err.stack}</pre>`);
        }
    }
}

module.exports = new TicketController();
