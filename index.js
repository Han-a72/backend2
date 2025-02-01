import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { PORT, mongoDBURL } from "./config.js";
import bodyParser from 'body-parser';
import booksRoute from "./routes/booksRoute.js";
import authRoute from "./routes/authRoute.js";
import { connectToDB } from "./db.config.js";
import dotenv from 'dotenv';
import signupRouter from "./routes/signupRouter.js"; // Adjust path as needed


dotenv.config(); // Load environment variables

const app = express(); // Initialize express app

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/api", signupRouter);
// Routes
app.use("/", authRoute);
app.use("/books", booksRoute);

// Connect to the database
connectToDB();

// Start the server
app.listen(PORT, () => {
  console.log(`✅ App is listening on port: ${PORT}`);
});
