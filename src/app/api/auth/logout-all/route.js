import { NextResponse } from 'next/server';
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
            }, { status: 400 });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, config.JWT_SECRET);
        } catch (err) {
            return NextResponse.json({
                message: "Invalid or expired refresh token"
            }, { status: 400 });
        }

        await sessionModel.updateMany({
            user: decoded.id,
            revoked: false
        }, {
            revoked: true
        });

        const response = NextResponse.json({
            message: "Logged out from all devices successfully"
        }, { status: 200 });

        response.cookies.delete("refreshToken");

        return response;

    } catch (error) {
        console.error("Logout All Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
