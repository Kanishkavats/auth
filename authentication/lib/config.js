// import jwt from "jsonwebtoken";

// export const generateAccessToken = (user) => {
//   return jwt.sign({ id: user._id }, process.env.ACCESS_SECRET, {
//     expiresIn: "15m",
//   });
// };

// export const generateRefreshToken = (user) => {
//   return jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, {
//     expiresIn: "7d",
//   });
// };
const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  GOOGLE_USER: process.env.GOOGLE_USER
};

export default config;