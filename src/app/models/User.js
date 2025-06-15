const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    name: String,
    email: String,
    password: String,
    balance: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user' // Mặc định là người dùng bình thường
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', User);
