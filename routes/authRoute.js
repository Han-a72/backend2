
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // Adjust path to your User model

const router = express.Router();

// Register user and send verification email
router.post("/register", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Request Body:", req.body);
  
      const user = new User({ email, password });
      console.log("New User Object:", user);
  
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
      console.log("Generated Token:", token);
  
      user.verificationToken = token;
      await user.save();
      console.log("User saved:", user);
  
      const verificationLink = `https://your-frontend-url.com/ConfirmEmail?token=${token}`;
      console.log("Verification Link:", verificationLink);
  
      res.status(201).json({ message: "User registered successfully. Check your email for verification.", token });
    } catch (error) {
      console.error("Error during registration:", error.message);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  });
  
// Verify email
router.get("/verify", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email, verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isActive = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Error verifying email:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

export default router;
