
import nodemailer from "nodemailer";
import path from "path";

// Create a transporter for sending emails through Gmail's SMTP server
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hariggait@gmail.com", // Your email address
    pass: "hles osbo qive nror", // Your Gmail app password
  },
});

// Email options including attachments
export const mailOptions = {
  from: "hariggait@gmail.com", // Sender email
  to: "ggharisms@gmail.com", // Receiver email
  subject: "Testing Email from Nodemailer with attachments", // Subject of the email
  text: "Practicing by sending an email!", // Text content of the email
  html: "<h1>Hello guys!</h1>", // HTML content of the email
  attachments: [
    // Example attachments
    {
      filename: "download(1).jpg",
      path: path.join(__dirname, "../src/images/download(1).jpg"), // Path to the image
    },
    {
      filename: "download.jpg",
      path: path.join(__dirname, "./images/download.jpg"), // Another image
    },
    {
      filename: "document.txt",
      path: path.join(__dirname, "./example/document.txt"), // Path to a text file
    },
    {
      filename: "use.txt",
      path: path.join(__dirname, "./example/use.txt"), // Path to a text file
    },
  ],
};

// Export a function that sends the email
export const sendTestEmail = () => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error:", error);
        reject(error);
      } else {
        console.log("Email sent: " + info.response);
        resolve(info);
      }
    });
  });
};































































































// import nodemailer from "nodemailer";
// import path from "path";
// import dotenv from 'dotenv';

// dotenv.config();

// // Create a reusable transporter instance
// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_SERVICE || 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// interface Attachment {
//   filename: string;
//   path?: string; // Path to the file on the server
//   content?: Buffer | string; // Raw content (e.g., base64 decoded)
//   contentType?: string; // MIME type if providing content
// }

// // Export a more flexible function for sending emails
// export const sendEmail = (
//   to: string,
//   subject: string,
//   text?: string,
//   html?: string,
//   attachments?: Attachment[]
// ): Promise<nodemailer.SentMessageInfo> => {
//   const mailOptions = {
//     from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
//     to: to,
//     subject: subject,
//     text: text,
//     html: html,
//     attachments: attachments,
//   };

//   return new Promise((resolve, reject) => {
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error sending email:', error);
//         reject(error);
//       } else {
//         console.log('Email sent:', info.response);
//         resolve(info);
//       }
//     });
//   });
// };
