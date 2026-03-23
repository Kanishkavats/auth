import { NextResponse } from "next/server";
import crypto from "crypto";
import Session from "@/models/Session";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  await connectDB();

  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (refreshToken) {
    const hash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    await Session.findOneAndUpdate(
      { refreshTokenHash: hash },
      { revoked: true }
    );
  }

  const res = NextResponse.json({ message: "Logged out" });

  res.cookies.set("refreshToken", "", { maxAge: 0 });

  return res;
}