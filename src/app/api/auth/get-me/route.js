import { NextResponse } from 'next/server';
import jwt from "jsonwebtoken";
import config from "../../../../config/config.js";
import connectDB from "../../../../config/database.js";
import userModel from "../../../../models/user.model.js";

export async function GET(req) {
    try {
        await connectDB();

        const authHeader = req.headers.get("authorization");
        const token = authHeader?.split(" ")[1];

        if (!token) {
            return NextResponse.json({
                message: "token not found"
            }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.JWT_SECRET);
        } catch (err) {
            return NextResponse.json({
                message: "invalid or expired token"
            }, { status: 401 });
        }

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return NextResponse.json({
                message: "user not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "user fetched successfully",
            user: {
                username: user.username,
                email: user.email,
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Get Me Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
