// Import required modules
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js"; // Adjust path as needed
import booksRoute from "./routes/booksRoute.js"; // Adjust path as needed
import { connectToDB } from "./db.config.js"; // Adjust path as needed

dotenv.config(); // Load environment variables

const app = express(); // Initialize express app

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// CORS Configuration


app.use(
  cors()
);

// Default route to check if backend is working
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Handle POST requests to the root route
app.post("/", (req, res) => {
  res.status(200).json({ message: "Root POST route works!" });
});

// Use routes

app.use("/api", authRoute);
app.use("/books", booksRoute);

// Connect to the database
connectToDB();

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ App is listening on port: ${PORT}`);
});
