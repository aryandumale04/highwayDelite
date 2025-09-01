import mongoose, { Document, Schema, model, Types } from "mongoose";

export interface Note {
  _id?: Types.ObjectId;
  title: string;
  createdAt?: Date;
}

export interface UserDocument extends Document {
  _id: Types.ObjectId; // ADD THIS LINE explicitly
  name: string;
  email: string;
  otp: string | null;
  dob: string;
  isVerified: boolean;
  authType: "otp" | "google";
  notes: Note[];
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  otp: { type: String, default: null },
  dob: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  authType: {
    type: String,
    enum: ["otp", "google"],
    required: true,
    default: "otp",
  },
  notes: [
    {
      title: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

export default model<UserDocument>("User", userSchema);
