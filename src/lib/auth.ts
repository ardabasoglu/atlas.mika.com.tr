import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

const isDevelopment = process.env.NODE_ENV === "development";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const smtpFrom = process.env.SMTP_FROM;

const hasSmtpConfig =
  smtpHost &&
  smtpPort &&
  smtpUser !== undefined &&
  smtpPassword !== undefined;

async function sendMagicLinkEmail(data: {
  email: string;
  url: string;
  token: string;
}): Promise<void> {
  if (hasSmtpConfig) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number.parseInt(smtpPort, 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });
    await transporter.sendMail({
      from: smtpFrom ?? smtpUser,
      to: data.email,
      subject: "Atlas – Giriş bağlantınız",
      html: `Giriş yapmak için <a href="${data.url}">bu bağlantıya</a> tıklayın. Bağlantı 5 dakika geçerlidir.`,
    });
    return;
  }
  if (isDevelopment) {
    // eslint-disable-next-line no-console
    console.log("[Better Auth] Magic link (dev):", data.url);
  }
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  basePath: "/api/auth",
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        input: false,
        defaultValue: () => "MEMBER",
      },
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async (data) => {
        await sendMagicLinkEmail(data);
      },
    }),
  ],
});
