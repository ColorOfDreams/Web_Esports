const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// ✅ Đặt cấu hình mail bên ngoài class
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'youremail@gmail.com',
        pass: 'your-app-password'
    }
});

class AuthController {
    // Form đăng ký
    registerForm(req, res) {
        res.render('auth/register');
    }

    // Form đăng nhập
    loginForm(req, res) {
        res.render('auth/login');
    }

    // Xử lý đăng ký
    async registerLogic(req, res) {
        const { name, email, password } = req.body;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                req.flash('error_msg', 'Email đã tồn tại!');
                return res.redirect('/auth/register');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({ name, email, password: hashedPassword });
            await newUser.save();

            // Gửi email xác nhận
            await transporter.sendMail({
                from: 'Web Esports <youremail@gmail.com>',
                to: email,
                subject: 'Xác nhận đăng ký Web Esports',
                html: `
          <h2>Chào ${name},</h2>
          <p>Bạn đã đăng ký tài khoản thành công tại <b>Web Esports</b>.</p>
          <p>Cảm ơn bạn đã tham gia!</p>
        `
            });

            req.flash('success_msg', 'Đăng ký thành công, kiểm tra email để xác nhận!');
            res.redirect('/auth/login');
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Lỗi server khi đăng ký!');
            res.redirect('/auth/register');
        }
    }

    // Xử lý đăng nhập
    async loginLogic(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                req.flash('error_msg', 'Sai email hoặc mật khẩu!');
                return res.redirect('/auth/login');
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                req.flash('error_msg', 'Sai email hoặc mật khẩu!');
                return res.redirect('/auth/login');
            }

            req.session.user = {
                id: user._id,
                name: user.name,
                email: user.email,
                balance: user.balance,
                joinedAt: user.createdAt
            };

            res.redirect('/home');
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Lỗi server khi đăng nhập!');
            res.redirect('/auth/login');
        }
    }
}

module.exports = new AuthController();
