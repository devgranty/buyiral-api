const sendMail = async (to, subject, template) => {
    try {
        const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {}
        });

        await transporter.sendMail({
            from: `${process.env.APP_NAME} <${process.env.AUTO_MAIL_ADDRESS}>`,
            to,
            subject,
            html: template
        });

    } catch (error) {
        console.log(error);
    }
}

module.exports = sendMail;