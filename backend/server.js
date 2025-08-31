// importing required packages
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");
const generateToken = require("./utils/jwt");
const auth = require("./middleware/auth");
const { OAuth2Client } = require("google-auth-library");

// create Express app
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// connect to MongoDB
connectDB();

// default route
app.get("/", (req, res) => {
  res.send("udibaba!");
});

// Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --------------------- Google Login ---------------------
app.post("/google-login", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: "ID token is required" });

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        dob: "N/A",
        isVerified: true,
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google login failed" });
  }
});

// --------------------- Signup OTP ---------------------
app.post("/generate-otp-signup", async (req, res) => {
  const { name, email, dob } = req.body;

  if (!name) return res.status(400).json({ message: "Your name cannot be empty!!" });
  if (!email) return res.status(400).json({ message: "Email cannot be empty!!" });
  if (!dob) return res.status(400).json({ message: "Date-of-birth cannot be empty!!" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with that email already exists!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.create({
      name,
      email,
      dob,
      otp,
      isVerified: false,
    });

    res.status(200).json({ message: "OTP generated successfully!", otp });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// --------------------- Signin OTP ---------------------
app.post("/generate-otp-signin", async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(400).json({ message: "User with that email does not exist!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    existingUser.otp = otp;
    await existingUser.save();

    res.status(200).json({ message: "OTP generated successfully!", otp });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// --------------------- Verify OTP Signup ---------------------
app.post("/verify-otp-signup", async (req, res) => {
  const { email, otp } = req.body;
  if (!otp) return res.status(400).json({ message: "OTP cannot be empty" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Incorrect OTP" });

    user.otp = null;
    user.isVerified = true;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// --------------------- Verify OTP Signin ---------------------
app.post("/verify-otp-signin", async (req, res) => {
  const { email, otp } = req.body;
  if (!otp) return res.status(400).json({ message: "OTP cannot be empty" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User with that email does not exist" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    user.otp = null;
    user.isVerified = true;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      message: "OTP verified",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// --------------------- Get user profile ---------------------
app.get("/me", auth, (req, res) => {
  const { name, email, _id } = req.user;
  res.status(200).json({ name, email, _id });
});

// --------------------- Notes routes ---------------------
app.post("/notes", auth, async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Note title is required" });

  try {
    const user = req.user;
    const newNote = { title };
    user.notes.push(newNote);
    await user.save();
    res.status(201).json(user.notes[user.notes.length - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/notes", auth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user.notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/notes/:noteId", auth, async (req, res) => {
  const { noteId } = req.params;

  try {
    const user = req.user;
    const noteIndex = user.notes.findIndex((note) => note._id.toString() === noteId);
    if (noteIndex === -1) return res.status(404).json({ message: "Note not found" });

    user.notes.splice(noteIndex, 1);
    await user.save();
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------- Start server ---------------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
