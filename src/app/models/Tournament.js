const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const Tournament = new Schema({
    _id: String, // Ví dụ: "LCK"
    arena: String,
    venue: String,
    district: String,
    province: String,
    city: String,
    country: String,
    capacity: String,
    competition: String,
});

module.exports = mongoose.model('Tournament', Tournament);
