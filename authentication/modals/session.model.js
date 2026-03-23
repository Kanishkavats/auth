import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  refreshTokenHash: String,
  ip: String,
  userAgent: String,
  revoked: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Session || mongoose.model("Session", sessionSchema);