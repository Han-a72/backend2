import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { PORT, mongoDBURL } from "./config.js";
import bodyParser from 'body-parser';
import booksRoute from "./routes/booksRoute.js";
// import authRoute from "./routes/authRoute.js";
import { connectToDB } from "./db.config.js";
import dotenv from 'dotenv';
import authRoute from "./routes/authRoute.js"; // Adjust path as needed
// import { sendEmail } from "../backend/untils/sendEmail.js";

dotenv.config(); // Load environment variables

const app = express(); // Initialize express app

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({ origin: "https://backend-io-eight.vercel.app",
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
 }));
 app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.use("/api", authRoute);
// Routes
// app.use("/", authRoute);
app.use("/books", booksRoute);

// Connect to the database
connectToDB();
// app.get("/test-email", async (req, res) => {
//   try {
//     await sendEmail(
//       "test@example.com", // Replace with your email to test
//       "Test Email Subject",
//       "This is a plain text test email.",
//       "<p>This is an HTML test email.</p>"
//     );
//     res.status(200).send("Test email sent successfully!");
//   } catch (error) {
//     res.status(500).send(`Error: ${error.message}`);
//   }
// });
// Start the server
app.listen(PORT, () => {
  console.log(`✅ App is listening on port: ${PORT}`);
});
