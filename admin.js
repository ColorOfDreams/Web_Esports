const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/webesport'); // chỉnh URL nếu khác

async function createAdmin() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = new User({
        name: 'Admin',
        email: 'admin@webesport.vn',
        password: hashedPassword,
        role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin created');
    mongoose.disconnect();
}

createAdmin();
