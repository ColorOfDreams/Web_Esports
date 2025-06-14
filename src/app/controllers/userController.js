const User = require('../models/User')



class UserController {
    // GET /profile
    profile(req, res) {

        const user = req.session.user;
        if (!user) return res.redirect('/auth/login')

        res.render('user/profile', { user })
    }
}

module.exports = new UserController()
