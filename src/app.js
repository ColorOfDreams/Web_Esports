const express = require('express')
const session = require('express-session')
const { engine } = require('express-handlebars')
const morgan = require('morgan')
const methodOverride = require('method-override')
const path = require('path')

// __dirname có sẵn trong CommonJS rồi nên không cần khai báo gì thêm

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


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}))


app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources', 'views'))

// Static file
app.use(express.static(path.join(__dirname, 'public')))

// Middleware parse form và JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'))

// Logger
app.use(morgan('combined', {
    skip: (req, res) => req.url.startsWith('/json')
}));


// Connect  route

const route = require('./routes/app.js')

// Route

route(app)

// Connect DB

const db = require("./config/db")

// DB

db.connect()

// Start server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
