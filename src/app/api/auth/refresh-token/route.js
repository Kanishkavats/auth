import { NextResponse } from 'next/server';
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../../../../config/config.js";
import connectDB from "../../../../config/database.js";
import sessionModel from "../../../../models/session.model.js";

export async function GET(req) {
    try {
        await connectDB();

        const refreshToken = req.cookies.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json({
                message: "Refresh token not found"
            }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, config.JWT_SECRET);
        } catch (err) {
            return NextResponse.json({
                message: "Invalid refresh token"
            }, { status: 401 });
        }

        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked: false
        });

        if (!session) {
            return NextResponse.json({
                message: "Invalid refresh token"
            }, { status: 401 });
        }

        const accessToken = jwt.sign({
            id: decoded.id
        }, config.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        const newRefreshToken = jwt.sign({
            id: decoded.id
        }, config.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

        session.refreshTokenHash = newRefreshTokenHash;
        await session.save();

        const response = NextResponse.json({
            message: "Access token refreshed successfully",
            accessToken
        }, { status: 200 });

        response.cookies.set({
            name: "refreshToken",
            value: newRefreshToken,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
        });

        return response;

    } catch (error) {
        console.error("Refresh Token Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
