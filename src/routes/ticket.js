const express = require('express')
const router = express.Router()

const ticketsController = require("../app/controllers/ticketController")

// ticketsController.app

router.post('/', ticketsController.buy)

module.exports = router
