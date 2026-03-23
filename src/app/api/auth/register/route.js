import { NextResponse } from 'next/server';
import crypto from "crypto";
import connectDB from "../../../../config/database.js";
import userModel from "../../../../models/user.model.js";
import otpModel from "../../../../models/otp.model.js";
import { generateOtp, getOtpHtml } from "../../../../utils/utils.js";
import { sendEmail } from "../../../../services/email.service.js";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { username, email, password } = body;

        const isAlreadyRegistered = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (isAlreadyRegistered) {
            return NextResponse.json({
                message: "Username or email already exists"
            }, { status: 409 });
        }

        const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

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
            },
        }, { status: 201 });

    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
