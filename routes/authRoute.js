import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // Adjust the path to your User model
import nodemailer from "nodemailer";

const router = express.Router();

// Verify email route
router.get("/verify", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Verification token is missing." });
  }

  try {
    // Decode and verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Log decoded information for debugging
    console.log("Decoded token:", decoded);

    // Find the user with the matching email and token
    const user = await User.findOne({ email: decoded.email, verificationToken: token });

    if (!user) {
      console.log("User not found or token invalid.");
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Activate the user and clear the verification token
    user.isActive = true;
    user.verificationToken = null;
    await user.save();

    console.log("Email verified successfully for user:", user.email);
    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      console.error("JWT Error:", error.message);
      return res.status(400).json({ message: "Invalid token." });
    }

    if (error.name === "TokenExpiredError") {
      console.error("Token Expired:", error.message);
      return res.status(400).json({ message: "Token has expired." });
    }

    // Log unexpected errors
    console.error("Unexpected error during verification:", error.message);
    res.status(500).json({ message: "An error occurred during verification. Please try again later." });
  }
});

// Export router
export default router;
