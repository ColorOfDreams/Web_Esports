const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/adminController');

// Sự kiện
router.get('/stored/events', adminController.storedEvents);

router.get('/stored/tickets', adminController.storedTickets);
router.get('/tickets/create', adminController.createTicketForm);
router.post('/tickets/store', adminController.storeTicket);
router.get('/tickets/:id/edit', adminController.editTicketForm);
router.put('/tickets/:id', adminController.updateTicket);
router.delete('/tickets/:id', adminController.deleteTicket);


router.get('/stored/users', adminController.storedUsers);
router.get('/users/:id/topup', adminController.topupForm);
router.post('/users/:id/topup', adminController.topupBalance);


module.exports = router;
