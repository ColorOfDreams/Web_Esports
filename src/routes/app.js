const eventsRouter = require('./events')
const adminController = require('./admin')
const siteRouter = require('./site')
const authRoutes = require('./auth');

function route(app) {

    app.use('/admin', adminController)

    app.use('/events', eventsRouter)

    app.use('/auth', authRoutes);

    app.use('/', siteRouter)

}

module.exports = route