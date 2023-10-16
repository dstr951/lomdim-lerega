const Resend = require("resend");
const { idToSubject, idToGrade } = require("../Converters");
const LoggerService = require("./Logger");

function notifyMatchHTML(
  parentName,
  parentPhone,
  studentName,
  studentGrade,
  studySubject,
  studentMessage,
  teacherName,
  teacherPhone
) {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">

<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #e6f7ff;
      /* Light blue background */
      margin: 0;
      padding: 20px;
    }

    .container {
      background-color: #ffffff;
      margin: auto;
      padding: 20px;
      max-width: 800px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .header,
    .header a {
      color: #2c3e50;
      font-size: 24px;
      font-weight: bold;
      border-bottom: 2px solid #3498db;
      padding-bottom: 10px;
      margin-bottom: 20px;
      text-align: center;
      display: block;
      text-decoration: none;
    }

    img {
    max-width: 200px;
    margin: 0 auto 20px auto;
    display: block;
    border-radius: 50%; /* rounded images */
    }

    .section {
      width: 48%;
      float: right;
    }

    .clear {
      clear: both;
    }

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0 0 20px 0;
    }

    li {
      margin-bottom: 10px;
      color: #7f8c8d;
    }

    b {
      color: #2c3e50;
    }

    p {
      color: #7f8c8d;
      margin: 0 0 20px 0;
    }

    a {
      color: #3498db;
      text-decoration: none;
    }

    .footer-text {
      color: #7f8c8d;
      font-size: 16px;
    }
  </style>
</head>

<body>
  <div class="container">
    <a href="https://lomdim-lerega.vercel.app/" class="header">
      <!-- Replace with your website link -->
      <img src="http://cdn.mcauto-images-production.sendgrid.net/d611d23cb861ad75/6be46b08-f3b8-4836-a4c5-345d26ceccc0/1080x1080.png" alt="Logo">
      <!-- Replace with your logo link -->
    </a>
    <div class="section">
      <p class="header">מורה יקר,</p>
      <p>להלן פרטי התלמיד:</p>
      <ul>
        <li><b>שם ההורה:</b> ${parentName}</li>
        <li><b>טלפון הורה לתיאום:</b> ${parentPhone}</li>
        <li><b>שם התלמיד:</b> ${studentName}</li>
      </ul>
      <p>התלמיד בכיתה ${studentGrade} ומעוניין ללמוד איתך את הנושא <b>${studySubject}</b>.</p>
      <p>בנוסף, הוא צירף את ההודעה הבאה:</p>
      <p style="margin-right: 20px; font-style: italic;">${studentMessage}</p>
    </div>
    <!-- Student Section -->
    <div class="section">
      <p class="header">תלמיד יקר,</p>
      <p>להלן פרטי המורה:</p>
      <ul>
        <li><b>שם המורה:</b> ${teacherName}</li>
        <li><b>טלפון המורה:</b> ${teacherPhone}</li>
      </ul>
    </div>
    <!-- Clear Floats -->
    <div class="clear"></div>

    <!-- Separation Line -->
    <hr style="border: 0; height: 1px; background: #e6f7ff; margin: 20px 0;">

    <!-- Common Ending -->
    <p>תרגישו חופשי לפנות אחד לשני ולכל בעיה ניתן לפנות אלינו במייל:</p>
    <a href="mailto:lomdimlerega@gmail.com">lomdimlerega@gmail.com</a>

    <!-- Signature -->
    <p class="footer-text" style="text-align: center; margin-top: 20px;">בברכה,</p>
    <p class="footer-text" style="text-align: center;">צוות לומדים לרגע</p>
  </div>
</body>

</html>
`;
}

function notifyMatch(request, student, teacher) {
  const resend = new Resend.Resend(process.env.RESEND_API_KEY);
  const subject = `לומדים לרגע -נמצאה התאמה-${request._id}`;
  const parentName = `${student.parent.firstName} ${student.parent.lastName}`;
  const parentPhone = `${student.parent.phoneNumber}`;
  const studentName = `${student.student.firstName} ${student.student.lastName}`;
  const studentGrade = `${idToGrade[student.student.grade]}`;
  const studySubject = `${idToSubject[request.subject]}`;
  const studentMessage = `${request.messageContent}`;
  const teacherName = `${teacher.firstName} ${teacher.lastName}`;
  const teacherPhone = `${teacher.phoneNumber}`;
  const HTMLstring = notifyMatchHTML(
    parentName,
    parentPhone,
    studentName,
    studentGrade,
    studySubject,
    studentMessage,
    teacherName,
    teacherPhone
  );
  resend.emails
    .send({
      to: [`${student.email}`, `${teacher.email}`],
      from: `${process.env.RESEND_SENDER_NAME}@lomdim-lerega.info`,
      html: HTMLstring,
      subject,
    })
    .then(() => {
      LoggerService.log(
        `matching email was sent successfully teacherEmail:${teacherEmail}, studentEmail:${studentEmail}`
      );
    })
    .catch(() => {
      LoggerService.error(
        `matching email wasn't sent, teacherEmail:${teacherEmail}, studentEmail:${studentEmail}`
      );
    });
}

module.exports = { notifyMatch };
