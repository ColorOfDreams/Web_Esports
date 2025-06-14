// controllers/AuthController.js
const User = require('../models/User')
const bcrypt = require('bcrypt')

class authController {
    // Hiển thị form đăng ký
    registerForm(req, res) {
        res.render('auth/register')
    }
    // Hiển thị form đăng nhập
    loginForm(req, res) {
        res.render('auth/login')
    }
    // Xử lý đăng ký
    async register(req, res) {
        const { name, email, password } = req.body;

        // kiểm nếu email đã tồn tại
        const existing = await User.findOne({ email })
        if (existing) {
            return res.render('auth/register', { error: 'Email đã được sử dụng!' })
        }

        // Hash password trước khi lưu
        const hashed = await bcrypt.hash(password, 10)

        await User.create({ name, email, password: hashed })

        // Chuyển hướng về đăng nhập kèm thông báo
        res.redirect('/auth/login?msg=Đăng ký thành công!')
    }
    // Xử lý đăng nhập
    async login(req, res) {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.render('auth/login', { error: 'Sai tài khoản hoặc mật khẩu!' })
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.render('auth/login', { error: 'Sai tài khoản hoặc mật khẩu!' })
        }
        // Lưu thông tin vào session
        req.session.userid = user._id
        res.redirect('/')
    }
}

module.exports = new authController()
