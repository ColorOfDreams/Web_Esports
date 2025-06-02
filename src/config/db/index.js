const mongoose = require('mongoose');

async function connect() {
    mongoose.connect('mongodb://127.0.0.1:27017/LOL_Esports')
        .then(() => console.log('✅ Connected to MongoDB (local)'))
        .catch(err => console.error('❌ Connection error', err));
}

module.exports = { connect };
