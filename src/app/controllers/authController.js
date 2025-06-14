const { multipleMongooseToObject } = require('../../until/mongoose')

class AuthController {
    // Hiển thị trang đăng nhập
    loginForm(req, res) {
        res.render('auth/login')
    }

    // Hiển thị trang đăng ký
    registerForm(req, res) {
        res.render('auth/register')
    }

    login(req, res) {
        const { email, password } = req.body;
        // TODO: kiểm tra thông tin người dùng
        res.send(`Đăng nhập với ${email}`)
    }

    // Xử lý đăng ký
    register(req, res) {
        const { name, email, password } = req.body;
        // TODO: thêm người dùng vào database
        res.send(`Đăng ký với ${name}`)
    }
}

module.exports = new AuthController()




