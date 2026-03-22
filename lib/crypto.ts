import crypto from "crypto";

function getEncryptionKey() {
  const rawKey = process.env.TRELLO_TOKEN_ENCRYPTION_KEY;

  if (!rawKey) {
    throw new Error("TRELLO_TOKEN_ENCRYPTION_KEY is not configured.");
  }

  return crypto.createHash("sha256").update(rawKey).digest();
}

export function encryptSecret(plainText: string) {
  const iv = crypto.randomBytes(12);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("base64")}.${encrypted.toString("base64")}.${authTag.toString("base64")}`;
}

export function decryptSecret(cipherText: string) {
  const [ivPart, encryptedPart, authTagPart] = cipherText.split(".");

  if (!ivPart || !encryptedPart || !authTagPart) {
    throw new Error("Invalid encrypted token format.");
  }

  const iv = Buffer.from(ivPart, "base64");
  const encrypted = Buffer.from(encryptedPart, "base64");
  const authTag = Buffer.from(authTagPart, "base64");
  const key = getEncryptionKey();
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
