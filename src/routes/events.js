const express = require('express')
const router = express.Router()

const eventsController = require("../app/controllers/eventsController")

// eventsController.app

router.get('/create', eventsController.create)
router.post('/store', eventsController.store)
router.get('/:id/edit', eventsController.edit)
router.put('/:id', eventsController.update)
router.delete('/:id', eventsController.destroy)
router.get('/:slug', eventsController.show)

module.exports = router
