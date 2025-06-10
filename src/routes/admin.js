const express = require('express')
const router = express.Router()

const adminController = require('../app/controllers/adminController')

// eventsController.app

router.get('/stored/events', adminController.storedEvents)

module.exports = router
