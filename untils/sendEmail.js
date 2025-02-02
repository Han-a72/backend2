import nodemailer from "nodemailer";

// Configure the transporter for sending emails
export const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail service
  auth: {
    user: process.env.EMAIL_USER, // Your email address from .env
    pass: process.env.EMAIL_PASS, // Your App Password from .env
  },
});

// Function to send an email
export const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email
    to: to, // Recipient's email
    subject: subject, // Email subject
    text: text, // Plain text content
    html: html, // HTML content (optional)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Email could not be sent");
  }
};
