import express from 'express';
// import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/userModel.js';
import {  authLists } from '../controllers/authcontroller.js';
const router = express.Router();


router.get("/auth/",(req, res) => {

  return res.status(200).send("Welcome to MERN Stack Tutorial");
})
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong, please try again later." });
  }
});



router.post('/signout', (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: 'User signed out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong, please try again later.' });
  }
});

router.post("/signin",authLists,);
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong, please try again later.' });
  }
});


export default router;
