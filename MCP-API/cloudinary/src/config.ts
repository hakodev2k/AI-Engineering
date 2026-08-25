import crypto from 'node:crypto';
import { v2 as cloudinary } from 'cloudinary';

export type ConnectorConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ConnectorConfig {
  const cloudName = env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) throw new Error('Missing Cloudinary credentials');
  const timeoutMs = Number(env.CLOUDINARY_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.CLOUDINARY_MAX_RETRIES ?? 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('Invalid CLOUDINARY_TIMEOUT_MS');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('Invalid CLOUDINARY_MAX_RETRIES');
  return { cloudName, apiKey, apiSecret, approvalSecret: env.CLOUDINARY_APPROVAL_SECRET, timeoutMs, maxRetries };
}

export function configureCloudinary(config: ConnectorConfig) {
  cloudinary.config({ cloud_name: config.cloudName, api_key: config.apiKey, api_secret: config.apiSecret, secure: true });
  return cloudinary;
}

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
