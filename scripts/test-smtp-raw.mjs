import fs from "node:fs";
import path from "node:path";
import tls from "node:tls";

const envPath = path.resolve(".env.local");

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...valueParts] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
    }
  }
}

const host = process.env.SMTP_HOST || "smtp.hostinger.com";
const port = Number(process.env.SMTP_PORT || "465");
const user = process.env.SMTP_USER || "";
const pass = process.env.SMTP_PASS || "";

if (!user || !pass) {
  console.error("Missing SMTP_USER or SMTP_PASS in .env.local.");
  process.exit(1);
}

const readResponse = (socket) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    const onData = (chunk) => {
      chunks.push(chunk);
      const text = Buffer.concat(chunks).toString("utf8");
      const lines = text.trimEnd().split(/\r?\n/);
      const lastLine = lines[lines.length - 1] || "";
      if (/^\d{3} /.test(lastLine)) {
        socket.off("data", onData);
        resolve(text);
      }
    };
    socket.on("data", onData);
    socket.once("error", reject);
  });

const sendCommand = async (socket, command) => {
  socket.write(`${command}\r\n`);
  return readResponse(socket);
};

const socket = tls.connect({
  host,
  port,
  servername: host,
  rejectUnauthorized: true,
});

try {
  await new Promise((resolve, reject) => {
    socket.once("secureConnect", resolve);
    socket.once("error", reject);
  });

  await readResponse(socket);
  const ehlo = await sendCommand(socket, "EHLO localhost");
  if (!ehlo.includes("AUTH")) {
    throw new Error(`SMTP server did not advertise AUTH support:\n${ehlo}`);
  }

  const auth = Buffer.from(`\u0000${user}\u0000${pass}`).toString("base64");
  const authResponse = await sendCommand(socket, `AUTH PLAIN ${auth}`);

  if (authResponse.startsWith("235")) {
    console.log(`SMTP login OK for ${user} via ${host}:${port}.`);
    await sendCommand(socket, "QUIT");
    process.exit(0);
  }

  console.error(`SMTP login failed for ${user} via ${host}:${port}:`);
  console.error(authResponse.trim());
  process.exit(1);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`SMTP test failed: ${message}`);
  process.exit(1);
} finally {
  socket.end();
}
