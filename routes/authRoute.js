
import express from "express";
import jwt from "jsonwebtoken";

import { loginUser, registerUser, verifyEmail } from "../controllers/authcontroller.js";

const router = express.Router();

// Register user and send verification email
router.post("/register",registerUser);
  
// Verify email
router.get("/verify",verifyEmail);
router.post("/login",loginUser);

export default router;
