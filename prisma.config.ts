import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "prisma/config";

function loadEnvFile(fileName: string) {
  const filePath = path.resolve(fileName);
  if (!fs.existsSync(filePath)) return;

  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex < 1) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();
    const quote = value[0];
    if ((quote === '"' || quote === "'") && value.endsWith(quote)) {
      value = value.slice(1, -1);
    }

    process.env[key] ??= value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL;

if (!databaseUrl) {
  throw new Error(
    "Missing database URL. Set DATABASE_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL.",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
