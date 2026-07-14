import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";

const envPath = path.resolve(".env.local");

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...valueParts] = trimmed.split("=");
    if (process.env[key]) continue;
    process.env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
  }
}

const smtpHost = process.env.SMTP_HOST || "smtp.hostinger.com";
const smtpPort = Number(process.env.SMTP_PORT || "465");
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";

if (!smtpUser || !smtpPass) {
  console.error("Missing SMTP_USER or SMTP_PASS in .env.local.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

try {
  await transporter.verify();
  console.log(`SMTP login OK for ${smtpUser} via ${smtpHost}:${smtpPort}.`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`SMTP login failed for ${smtpUser}: ${message}`);
  process.exit(1);
}
