const mongoose = require('mongoose')
const generateSlug = require('../../until/generateSlug')

const Schema = mongoose.Schema;

const Event = new Schema({
    slug: {
        type: String,
        unique: true
    },
    time: String,
    tournament: String,
    league: String,
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
});

generateSlug(Event)


module.exports = mongoose.model('Event', Event)
