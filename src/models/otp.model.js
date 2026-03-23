import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [ true, "Email is required" ]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [ true, "User is required" ]
    },
    otpHash: {
        type: String,
        required: [ true, "OTP hash is required" ]
    }
}, {
    timestamps: true
})

// Check if model exists to avoid OverwriteModelError in Next.js
const otpModel = mongoose.models.otps || mongoose.model("otps", otpSchema)

export default otpModel;
