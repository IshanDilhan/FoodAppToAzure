// utils/email.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const SendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: `"FoodDelivery App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("✅ Email sent to", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
