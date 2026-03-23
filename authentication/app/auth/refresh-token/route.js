import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "@/models/Session";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  await connectDB();

  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ msg: "No token" }, { status: 401 });
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

  const hash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  const session = await Session.findOne({
    refreshTokenHash: hash,
    revoked: false
  });

  if (!session) {
    return NextResponse.json({ msg: "Invalid token" }, { status: 401 });
  }

  // 🔁 ROTATION
  const newAccessToken = jwt.sign(
    { id: decoded.id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const newRefreshToken = jwt.sign(
    { id: decoded.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const newHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

  session.refreshTokenHash = newHash;
  await session.save();

  const res = NextResponse.json({ accessToken: newAccessToken });

  res.cookies.set("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true
  });

  return res;
}