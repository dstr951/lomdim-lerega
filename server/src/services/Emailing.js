const sgMail = require("@sendgrid/mail");
const { idToSubject, idToGrade } = require("../../../webClient/src/Converters");

function notifyTeacherWasRequested(
  teacherEmail,
  studentPhoneNumber,
  studentEmail,
  studentMessage
) {
  sgMail.setApiKey(process.env.SEND_GRIND_NOTIFY_MATCH_KEY);
  const msg = {
    to: teacherEmail,
    from: "lomdimlerega@gmail.com",
    dynamic_template_data: {
      subject: `תלמיד ביקש ללמוד איתך - ${studentEmail}`,
      content: studentMessage,
      number: studentPhoneNumber,
      email: studentEmail,
    },
    template_id: "d-55fdb512444844178dc3b235fb88cac8",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error.response.body);
    });
}

function notifyMatch(request, student, teacher) {
  const msg = {
    to: `${student.email}`,
    from: "lomdimlerega@gmail.com",
    dynamic_template_data: {
      subject: `לומדים לרגע -נמצאה התאמה-${request._id}`,
      parentName: `${student.parent.firstName} ${student.parent.lastName}`,
      parentPhone: `${student.parent.phoneNumber}`,
      studentName: `${student.student.firstName} ${student.student.lastName}`,
      studentGrade: `${idToGrade[student.student.grade]}`,
      studySubject: `${idToSubject[request.subject]}`,
      studentMessage: `${request.messageContent}`,
      teacherName: `${teacher.firstName} ${teacher.lastName}`,
      teacherPhone: `${teacher.phoneNumber}`,
    },
    template_id: "d-bef71c0ae3da475c84b632c4255f3eef",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error.response.body);
    });
}

module.exports = { notifyTeacherWasRequested, notifyMatch };
