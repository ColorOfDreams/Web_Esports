const User = require('../models/User');
const bcrypt = require('bcrypt');

class UserController {
    // GET /user/profile
    profile(req, res) {
        const user = req.session.user;
        if (!user) return res.redirect('/auth/login');
        res.render('user/profile', { user });
    }

    // GET /user/change-password
    changePasswordForm(req, res) {
        if (!req.session.user) return res.redirect('/auth/login');
        res.render('user/change-password');
    }

    // POST /user/change-password
    async updatePassword(req, res) {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!req.session.user) {
            req.flash('error_msg', 'Bạn cần đăng nhập.');
            return res.redirect('/auth/login');
        }

        if (newPassword !== confirmPassword) {
            req.flash('error_msg', 'Mật khẩu mới không khớp.');
            return res.redirect('/user/change-password');
        }

        try {
            const user = await User.findById(req.session.user.id);
            const match = await bcrypt.compare(currentPassword, user.password);

            if (!match) {
                req.flash('error_msg', 'Mật khẩu hiện tại không đúng.');
                return res.redirect('/user/change-password');
            }

            const hashed = await bcrypt.hash(newPassword, 10);
            user.password = hashed;
            await user.save();

            req.flash('success_msg', 'Đổi mật khẩu thành công!');
            res.redirect('/user/profile');
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Lỗi hệ thống khi đổi mật khẩu.');
            res.redirect('/user/change-password');
        }
    }
}

module.exports = new UserController();
