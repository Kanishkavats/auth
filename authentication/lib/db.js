// import mongoose from "mongoose";

// export const connectDB = async () => {
//   if (mongoose.connection.readyState >= 1) return;

//   await mongoose.connect(process.env.MONGO_URI);
// };
// import mongoose from "mongoose";

// export const connectDB = async () => {
//   if (mongoose.connections[0].readyState) return;

//   await mongoose.connect(process.env.MONGO_URI);
// };

import mongoose from "mongoose";

let isConnected = false;

export default async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;

  console.log("Connected to DB");
}