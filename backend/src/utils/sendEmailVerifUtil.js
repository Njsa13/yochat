import { v4 } from "uuid";
import nodemailer from "nodemailer";
import prisma from "../prisma/client.js";

export const saveAndSendToken = async (user) => {
  const unexpiredToken = await prisma.emailVerification.findFirst({
    select: { emailVerificationId: true, expirationDate: true },
    where: {
      AND: [{ userId: user.userId }, { expirationDate: { gt: new Date() } }],
    },
  });

  if (unexpiredToken) {
    const timeRemaining = Math.floor(
      (unexpiredToken.expirationDate - new Date()) / 1000
    );
    const err = new Error(
      `Please wait ${timeRemaining} seconds before trying again`
    );
    err.status = 429;
    throw err;
  }

  const token = v4();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"YoChat" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Email Verification",
    html: `
    <p>
      Thank you for signing up! Please verify your email address by clicking the link below: <br>
      <a href="http://localhost:5173/verify-email?token=${token}">Verify Email</a> or copy and paste this URL into your browser: <br>
      <b>http://localhost:5173/verify-email?token=${token}</b>
    </p>`,
  });

  const expiration = process.env.EMAIL_VERIFICATION_EXPIRATION;
  await prisma.emailVerification.create({
    data: {
      token,
      expirationDate: new Date(Date.now() + expiration * 1000),
      user: {
        connect: { userId: user.userId },
      },
    },
  });
};
