const nodemailer = require('nodemailer');

console.log(process.env.MAILTRAP_PASS);
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  }
});

const sendMail = async ({ to, subject, body }) => {
  let info;
  try {
    info = await transporter.sendMail({
      from: 'no-reply@feedbook.com',
      to,
      subject,
      html: body,
    });

    console.log('Mail successfully sent to ' + to);
  } catch (error) {
    console.log('Error while sending email ' + error);
    throw new Error(error);
  }
};

module.exports = sendMail;