const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "83e4fdff7f243f",
        pass: "1e5b48f2a33644"
    }
});