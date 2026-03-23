import mongoose from "mongoose";
import config from "./config.js";

// Connection sharing in Next.js Serverless Environment
let isConnected = false;

async function connectDB() {
    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(config.MONGO_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("Connected to DB");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

export default connectDB;
