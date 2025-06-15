// models/Ticket.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ['master', 'grandmaster', 'challenge'], required: true },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
    createdAt: { type: Date, default: Date.now },
    qrCodeData: { type: String }
});

module.exports = mongoose.model('Ticket', TicketSchema);
