const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Event = new Schema({
    slug: String,
    time: String,
    tournament: String,
    league: String, // PHẢI CÓ DÒNG NÀY
    img: String,
    team1: {
        name: String,
        color: String,
        logo: String
    },
    team2: {
        name: String,
        color: String,
        logo: String
    },
    competition_format: String
})


module.exports = mongoose.model('Event', Event)
