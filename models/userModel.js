import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: false }, // To track email verification
  verificationToken: { type: String, default: false },
},);

const User = mongoose.model("User", userSchema);

export default User;
