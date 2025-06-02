const express = require('express')
const router = express.Router()

const eventsController = require("../app/controllers/eventsController")

// eventsController.app

router.get('/:slug', eventsController.show)

module.exports = router
