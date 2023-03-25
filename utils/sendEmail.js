// // eslint-disable-next-line import/no-extraneous-dependencies
// const nodemailer = require("nodemailer");

// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: process.env.EMAIL_PORT,
//     auth: { user: "loai.tarek98@gmail.com", pass: "yhguuxqeeuapropd" },
//   });

//   const mailOpts = {
//     from: "E-shop App <loai.tarek98@gmail.com>",
//     to: options.to,
//     subject: options.subject,
//     text: options.message,
//   };

//   transporter.sendMail(mailOpts, (err) => {
//     if (err) {
//       console.log("have error", err);
//     } else {
//       console("done");
//     }
//   });
// };
// module.exports = sendEmail;
const nodemailer = require("nodemailer");

// Nodemailer
const sendEmail = async (options) => {
  // 1) Create transporter ( service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure false port = 587, if true port= 465
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define email options (like from, to, subject, email content)
  const mailOpts = {
    from: "E-shop App <loai.tarek98d@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
