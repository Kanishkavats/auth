import { NextResponse } from 'next/server';
import crypto from "crypto";
import connectDB from "../../../../config/database.js";
import sessionModel from "../../../../models/session.model.js";

export async function GET(req) {
    try {
        await connectDB();

        const refreshToken = req.cookies.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json({
                message: "Refresh token not found"
            }, { status: 400 });
        }

        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked: false
        });

        if (!session) {
            return NextResponse.json({
                message: "Invalid refresh token"
            }, { status: 400 });
        }

        session.revoked = true;
        await session.save();

        const response = NextResponse.json({
            message: "Logged out successfully"
        }, { status: 200 });

        response.cookies.delete("refreshToken");

        return response;

    } catch (error) {
        console.error("Logout Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
