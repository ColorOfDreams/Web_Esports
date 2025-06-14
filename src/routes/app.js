const eventsRouter = require('./events')
const adminController = require('./admin')
const siteRouter = require('./site')
const authRoutes = require('./auth')
const ticketRoutes = require('./ticket')
const userRoutes = require('./user')



function route(app) {

    app.use('/admin', adminController)

    app.use('/events', eventsRouter)

    app.use('/auth', authRoutes)

    app.use('/ticket', ticketRoutes)

    app.use('/user', userRoutes)

    app.use('/', siteRouter)

}

module.exports = route