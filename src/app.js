const express = require('express')
const session = require('express-session')
const { engine } = require('express-handlebars')
const morgan = require('morgan')
const methodOverride = require('method-override')
const path = require('path')
const flash = require('connect-flash')

const app = express()
const port = 3000

// Cấu hình handlebars/ Template engine 
app.engine('hbs',
    engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b
        }
    }))

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources', 'views'))

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Middleware parse form và JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Method override
app.use(methodOverride('_method'))

// Logger
app.use(morgan('combined', {
    skip: (req, res) => req.url.startsWith('/json')
}))

// Session và Flash
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true
}))

app.use(flash())

// Đẩy flash và session user vào res.locals cho view
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.user = req.session.user || null;
    console.log('[RES.LOCALS.USER]', res.locals.user);
    next()
})

// Kết nối route
const route = require('./routes/app.js')
route(app)

// Kết nối DB
const db = require("./config/db")
db.connect()

// Start server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
