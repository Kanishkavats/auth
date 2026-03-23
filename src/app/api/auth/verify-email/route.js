import { NextResponse } from 'next/server';
import crypto from "crypto";
import connectDB from "../../../../config/database.js";
import userModel from "../../../../models/user.model.js";
import otpModel from "../../../../models/otp.model.js";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { otp, email } = body;

        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

        const otpDoc = await otpModel.findOne({
            email,
            otpHash
        });

        if (!otpDoc) {
            return NextResponse.json({
                message: "Invalid OTP"
            }, { status: 400 });
        }

        // We use findByIdAndUpdate and set { new: true } to get the updated document, OR
        // we can fetch user normally.
        const user = await userModel.findByIdAndUpdate(otpDoc.user, {
            verified: true
        }, { new: true });

        await otpModel.deleteMany({
            user: otpDoc.user
        });

        return NextResponse.json({
            message: "Email verified successfully",
            user: {
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Verify Email Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
