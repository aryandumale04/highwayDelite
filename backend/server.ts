import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db";
import User, { UserDocument, Note } from "./src/models/User";
import generateToken from "./src/utils/jwt";
import auth, { AuthenticatedRequest } from "./src/middleware/auth";
import { OAuth2Client } from "google-auth-library";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
connectDB();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

// Helper to assert Mongoose documents as UserDocument
const assertUser = (user: unknown): UserDocument => user as UserDocument;

// --------------------- Google Signup ---------------------
app.post("/google-signup", async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: "ID token is required" });

  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken as string,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ message: "Invalid Google token" });

    const { email, name } = payload;
    if (!email || !name)
      return res.status(400).json({ message: "Google token payload invalid" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists, please login" });

    user = await User.create({
      name,
      email,
      dob: "N/A",
      isVerified: true,
      authType: "google",
    });

    const token = generateToken(assertUser(user)._id.toHexString());
    res.status(201).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google signup failed" });
  }
});

// --------------------- Google Signin ---------------------
app.post("/google-signin", async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: "ID token is required" });

  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken as string,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ message: "Invalid Google token" });

    const { email } = payload;
    if (!email) return res.status(400).json({ message: "Google token payload invalid" });

    const user = await User.findOne({ email });
    if (!user || user.authType !== "google") {
      return res.status(400).json({ message: "No Google account found, please signup first" });
    }

    const token = generateToken(assertUser(user)._id.toHexString());
    res.status(200).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google signin failed" });
  }
});
// --------------------- Health check / root route ---------------------
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running" });
});


// --------------------- OTP Signup ---------------------
app.post("/generate-otp-signup", async (req: Request, res: Response) => {
  const { name, email, dob } = req.body;
  if (!name || !email || !dob)
    return res.status(400).json({ message: "Name, email and DOB are required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User with that email already exists!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      name,
      email,
      dob,
      otp,
      isVerified: false,
      authType: "otp",
    });

    const token = generateToken(assertUser(newUser)._id.toHexString());
    res.status(200).json({ message: "OTP generated successfully!", otp, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// --------------------- OTP Signin ---------------------
app.post("/generate-otp-signin", async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(400).json({ message: "User with that email does not exist!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = assertUser(existingUser);
    user.otp = otp;
    await user.save();

    const token = generateToken(user._id.toHexString());
    res.status(200).json({ message: "OTP generated successfully!", otp, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// --------------------- Verify OTP ---------------------
app.post("/verify-otp-signup", async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!otp) return res.status(400).json({ message: "OTP cannot be empty" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const u = assertUser(user);
    if (u.otp !== otp) return res.status(400).json({ message: "Incorrect OTP" });

    u.otp = null;
    u.isVerified = true;
    await u.save();

    const token = generateToken(u._id.toHexString());
    res.status(200).json({ message: "OTP verified successfully", token, user: { name: u.name, email: u.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/verify-otp-signin", async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!otp) return res.status(400).json({ message: "OTP cannot be empty" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User with that email does not exist" });
    const u = assertUser(user);
    if (u.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    u.otp = null;
    u.isVerified = true;
    await u.save();

    const token = generateToken(u._id.toHexString());
    res.status(200).json({ message: "OTP verified", token, user: { name: u.name, email: u.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// --------------------- Profile ---------------------
app.get("/me", auth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  res.status(200).json({ name: user.name, email: user.email, _id: user._id });
});

// --------------------- Notes ---------------------
app.post("/notes", auth, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Note title is required" });

  const newNote: Note = { title };
  user.notes.push(newNote);
  await user.save();
  res.status(201).json(user.notes[user.notes.length - 1]);
});

app.get("/notes", auth, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  res.status(200).json(user.notes);
});

app.delete("/notes/:noteId", auth, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { noteId } = req.params;

  const noteIndex = user.notes.findIndex((note: Note) => note._id?.toString() === noteId);
  if (noteIndex === -1) return res.status(404).json({ message: "Note not found" });

  user.notes.splice(noteIndex, 1);
  await user.save();
  res.status(200).json({ message: "Note deleted successfully" });
});

// --------------------- Start server ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
