"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
// Create a transporter for sending emails through Gmail's SMTP server
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "hariggait@gmail.com", // Your email address
        pass: "hles osbo qive nror", // Your Gmail app password
    },
});
// Email options including attachments
const mailOptions = {
    from: "hariggait@gmail.com", // Sender email
    to: "ggharisms@gmail.com", // Receiver email
    subject: "Testing Email from Nodemailer with attachments", // Subject of the email
    text: "Practicing by sending an email!", // Text content of the email
    html: "<h1>Hello guys!</h1>", // HTML content of the email
    attachments: [
        // Example attachments
        {
            filename: "download(1).jpg",
            path: path_1.default.join(__dirname, "../src/images/download(1).jpg"), // Path to the image
        },
        {
            filename: "download.jpg",
            path: path_1.default.join(__dirname, "./images/download.jpg"), // Another image
        },
        {
            filename: "document.txt",
            path: path_1.default.join(__dirname, "./example/document.txt"), // Path to a text file
        },
        {
            filename: "use.txt",
            path: path_1.default.join(__dirname, "./example/use.txt"), // Path to a text file
        },
    ],
};
// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Error:", error); // If an error occurs, log it
    }
    else {
        console.log("Email sent: " + info.response); // Log success if email is sent
    }
});
