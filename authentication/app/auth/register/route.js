// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import Session from "@/models/Session";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";

// export async function POST(req) {
//   await connectDB();

//   const { email, password } = await req.json();

//   const user = await User.create({ email, password });

//   const accessToken = jwt.sign(
//     { id: user._id },
//     process.env.JWT_SECRET,
//     { expiresIn: "15m" }
//   );

//   const refreshToken = jwt.sign(
//     { id: user._id },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );

//   const hash = crypto.createHash("sha256").update(refreshToken).digest("hex");

//   await Session.create({
//     user: user._id,
//     refreshTokenHash: hash
//   });

//   const res = NextResponse.json({ accessToken });

//   res.cookies.set("refreshToken", refreshToken, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "strict"
//   });

//   return res;
// }


import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import userModel from "@/models/user.model";
import crypto from "crypto";
import { sendEmail } from "@/lib/mailer";
import { generateOtp, getOtpHtml } from "@/utils/utils";
import otpModel from "@/models/otp.model";

export async function POST(req) {
  await connectDB();

  const { username, email, password } = await req.json();

  const isAlreadyRegistered = await userModel.findOne({
    $or: [{ username }, { email }]
  });

  if (isAlreadyRegistered) {
    return NextResponse.json(
      { message: "Username or email already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword
  });

  const otp = generateOtp();
  const html = getOtpHtml(otp);

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  await otpModel.create({
    email,
    user: user._id,
    otpHash
  });

  await sendEmail(email, "OTP Verification", `Your OTP code is ${otp}`, html);

  return NextResponse.json({
    message: "User registered successfully",
    user: {
      username: user.username,
      email: user.email,
      verified: user.verified
    }
  }, { status: 201 });
}