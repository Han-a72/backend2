import express from "express";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from '../models/userModel.js'; // Make sure this file exists and the model is set correctly

const router = express.Router();

// Helper Function to Generate JWT
const generateToken = (userId) => {
    const payload = { id: userId };
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};

// Helper Function to Send Verification Email
const sendVerificationEmail = async (email, token) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5173';  // Default to localhost if not set
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Verify your email',
        html: `<p>Click <a href="${baseUrl}/verify?token=${token}">here</a> to verify your email.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending verification email:", error.message);
    }
};

// Middleware to Authenticate User
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Signup Endpoint
router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Validate data
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });

        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            verificationToken,
            isActive: false,  // New user is not active until verified
        });

        await newUser.save();
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: 'User created successfully. Please verify your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
});

// Signin Endpoint
router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Please verify your email to login' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const token = generateToken(user._id);
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify Email Endpoint
router.get('/verify', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email, verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Activate user and clear the verification token
        user.isActive = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Resend Verification Email Route
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }

      if (user.isActive) {
          return res.status(400).json({ message: 'Email already verified' });
      }

      const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      user.verificationToken = verificationToken;
      await user.save();

      await sendVerificationEmail(email, verificationToken);

      res.status(200).json({ message: 'New verification email sent.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Profile Endpoint (Protected)
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Basic Test Route (Optional)
router.get("/", (req, res) => {
  res.send("Auth Route Works!");
});

export default router;
