import sgMail from '@sendgrid/mail'
const sgMail = require('@sendgrid/mail')

function notifyTeacherWasRequested(teacherEmail, studentPhoneNumber, studentEmail, studentMessage, ){
    sgMail.setApiKey(process.env.SEND_GRIND_NOTIFY_MATCH_KEY)
    const msg = {
    to: teacherEmail,
    from: 'lomdimlerega@gmail.com',
    dynamic_template_data: {
        subject: `תלמיד ביקש ללמוד איתך - ${studentEmail}`,
        content: studentMessage,
        number: studentPhoneNumber,
        email: studentEmail
    },
    template_id: "d-55fdb512444844178dc3b235fb88cac8"
    }
    sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error.response.body)
    })
}

module.exports={ notifyTeacherWasRequested }
