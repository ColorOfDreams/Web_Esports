const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    name: String,
    email: String,
    password: String,
    balance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true // ✅ Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model('User', User);