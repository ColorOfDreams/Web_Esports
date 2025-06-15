
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketStockSchema = new Schema({
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    eventSlug: { type: String, required: true },
    type: { type: String, enum: ['master', 'grandmaster', 'challenge'], required: true },
    total: { type: Number, required: true },
    remaining: { type: Number, required: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('TicketStock', TicketStockSchema);
