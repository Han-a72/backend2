

import nodemailer from "nodemailer";

// Configure the transporter for sending emails
export const transporter = nodemailer.createTransport({
  service: "Gmail", // You can change this to another email provider (e.g., Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

// Function to send an email
export const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email
    to, // Receiver's email
    subject, // Email subject
    text, // Plain text email content
    html, // HTML email content (optional)
  };

  // Attempt to send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};
