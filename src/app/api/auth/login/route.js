import { NextResponse } from 'next/server';
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../../../../config/config.js";
import connectDB from "../../../../config/database.js";
import userModel from "../../../../models/user.model.js";
import sessionModel from "../../../../models/session.model.js";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { email, password } = body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return NextResponse.json({
                message: "Invalid email or password"
            }, { status: 401 });
        }

        if (!user.verified) {
            return NextResponse.json({
                message: "Email not verified"
            }, { status: 401 });
        }

        const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

        const isPasswordValid = hashedPassword === user.password;

        if (!isPasswordValid) {
            return NextResponse.json({
                message: "Invalid email or password"
            }, { status: 401 });
        }

        const refreshToken = jwt.sign({
            id: user._id
        }, config.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

        const session = await sessionModel.create({
            user: user._id,
            refreshTokenHash,
            ip: req.ip || "unknown",
            userAgent: req.headers.get("user-agent") || "unknown"
        });

        const accessToken = jwt.sign({
            id: user._id,
            sessionId: session._id
        }, config.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        const response = NextResponse.json({
            message: "Logged in successfully",
            user: {
                username: user.username,
                email: user.email,
            },
            accessToken,
        }, { status: 200 });

        response.cookies.set({
            name: "refreshToken",
            value: refreshToken,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
        });

        return response;

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
