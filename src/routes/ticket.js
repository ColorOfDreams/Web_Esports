const express = require('express');
const router = express.Router();
const ticketController = require('../app/controllers/ticketController');

// Gửi form với ticketStockId tương ứng loại vé
router.post('/buy', ticketController.buy);

module.exports = router;
