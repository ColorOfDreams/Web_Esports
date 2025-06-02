const express = require('express')
const router = express.Router()

const siteController = require("../app/controllers/siteController")

// siteController.app

router.use('/', siteController.index)

module.exports = router
