import nodemailer from "nodemailer";
import config from "./config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: config.GOOGLE_USER,
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    refreshToken: config.GOOGLE_REFRESH_TOKEN
  }
});

export const sendEmail = async (to, subject, text, html) => {
  await transporter.sendMail({
    from: `"Your Name" <${config.GOOGLE_USER}>`,
    to,
    subject,
    text,
    html
  });
};