import express from "express";// 
import mongoose from "mongoose";
import cors from "cors";
import { PORT, mongoDBURL } from "./config.js";
import bodyParser from 'body-parser';
import booksRoute from "./routes/booksRoute.js";
import authRoute from "./routes/authRoute.js"
import { connectToDB } from "./db.config.js";
const app = express();// we're calling our express function (module) or Initiate express app



// MVC- architecture


app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(cors({ origin: "http://localhost:5173" }));

// GET- HTTP method

// 200 - Status Code OK

// "Welcome to Mern stack tutorial" - > response data


/// http://localhost:4000/


app.use("/",authRoute)
app.use("/books", booksRoute);


connectToDB()

  app.listen(PORT, () => {
    console.log(`✅ App is listening on port: ${PORT}`);
  });