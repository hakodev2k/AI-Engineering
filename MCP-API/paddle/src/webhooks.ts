import { createHmac, timingSafeEqual } from "node:crypto";

export interface PaddleSignature {
  timestamp: number;
  signatures: string[];
}

export function parsePaddleSignature(header: string): PaddleSignature {
  let timestamp: number | undefined;
  const signatures: string[] = [];
  for (const part of header.split(";")) {
    const [key, value] = part.trim().split("=", 2);
    if (key === "ts") timestamp = Number(value);
    if (key === "h1" && value) signatures.push(value);
  }
  if (!Number.isInteger(timestamp) || !timestamp || signatures.length === 0) throw new Error("Invalid Paddle-Signature header.");
  return { timestamp, signatures };
}

export function verifyPaddleWebhook(rawBody: string | Buffer, signatureHeader: string, secret: string, toleranceSeconds = 5, nowSeconds = Math.floor(Date.now() / 1000)): boolean {
  if (!secret) throw new Error("Webhook secret is required.");
  if (!Number.isInteger(toleranceSeconds) || toleranceSeconds < 0 || toleranceSeconds > 300) throw new Error("Invalid webhook tolerance.");
  const parsed = parsePaddleSignature(signatureHeader);
  if (Math.abs(nowSeconds - parsed.timestamp) > toleranceSeconds) return false;
  const payload = `${parsed.timestamp}:${Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : rawBody}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  return parsed.signatures.some(signature => {
    if (!/^[a-f\d]{64}$/i.test(signature)) return false;
    const actual = Buffer.from(signature, "hex");
    return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer);
  });
}
