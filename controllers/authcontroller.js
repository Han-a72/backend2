import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { sendVerificationEmail } from "../services/emailservice.js";
import dotenv from "dotenv"
dotenv.config()
export const registerUser = async (request, response) => {
  try {
    const { email, password, username } = request.body;

    if (!email || !password || !username) {
      return response.status(400).json({
        message: "Please add all fields.",
      });
    }

    const isEmailExist = await User.findOne({ email });
    const isUserNameExist = await User.findOne({ username });

    if (isEmailExist) {
      return response.status(400).json({
        message: "This email is already taken",
      });
    }
    if (isUserNameExist) {
      return response.status(400).json({
        message: "This username is already taken",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    if (newUser) {
      const verificationToken = jwt.sign(
        { id: newUser._id },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      await sendVerificationEmail(newUser.email, verificationToken);

      response.status(201).json({
        message:
          "User registered. Please verify your email to activate your account.",
      });
    } else {
      return response.status(400).json({
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (request, response) => {
  try {
    const { username, password } = request.body;

    if (!username || !password) {
      return response.status(400).json({
        message: "Please provide both username and password.",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return response.status(400).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(400).json({
        message: "Invalid email or password.",
      });
    }
    if (!user.isVerified) {
      return response.status(400).json({
        message: "Please verify your email before logging in.",
      });
    }

    response.status(200).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
};
export const verifyEmail = async (request, response) => {
  try {
    const { token } = request.query;

    if (!token) {
      return response.status(400).json({
        message: "Invalid or missing token.",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.id);
    if (!user) {
      return response.status(400).json({
        message: "User not found.",
      });
    }

    if (user.isVerified) {
      return response.status(400).json({
        message: "Email is already verified.",
      });
    }

    user.isVerified = true;
    await user.save();

    response.status(200).json({
      message: "Email successfully verified. You can now log in.",
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
};
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: "500s",
  });
};

