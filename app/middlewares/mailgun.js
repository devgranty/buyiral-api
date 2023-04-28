// Send via API
const sendMail = (to, subject, template, template_vars) => {
    
    try {
        console.log('Trying to send mail...');

        const mailgun = require('mailgun-js')({apiKey: process.env.MAIL_API_KEY, domain: process.env.MAIL_DOMAIN});

        let mailOptions = {
            from: `${process.env.APP_NAME} <noreply@mail.buyiral.com>`,
            to,
            subject,
            template,
            'h:X-Mailgun-Variables': JSON.stringify(template_vars)
        }

        mailgun.messages().send(mailOptions, (error, body) => {
            console.log(body)
        })

    } catch (error) {
        console.log(error)
    }
}

module.exports = sendMail




// Send via SMTP

// const nodemailer = require('nodemailer')
// const nodemailer_mailgun_transport = require('nodemailer-mailgun-transport')

// const sendMail = (to, subject, template, template_vars) => {
//     const mailgunAuth = {
//         auth: {
//             apiKey: process.env.MAIL_API_KEY,
//             domain: process.env.MAIL_DOMAIN
//         }
//     }

//     let transporter = nodemailer.createTransport(nodemailer_mailgun_transport(mailgunAuth))

//     let mailOptions = {
//         from: 'Buyiral <noreply@mail.buyiral.com>',
//         to,
//         subject,
//         template,
// 	    'h:X-Mailgun-Variables': JSON.stringify(template_vars)
//     }
//     return transporter.sendMail(mailOptions)
// }

// module.exports = sendMail
