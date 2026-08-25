import crypto from 'node:crypto';
import type { SquareConfig } from './config.js';

export interface CredentialProvider {
  getAccessToken(): Promise<string>;
}

export class EnvironmentCredentialProvider implements CredentialProvider {
  constructor(private readonly config: SquareConfig) {}
  async getAccessToken(): Promise<string> {
    return this.config.accessToken;
  }
}

export function approvalToken(secret: string, toolName: string, payload: unknown): string {
  const canonical = JSON.stringify({ toolName, payload });
  return crypto.createHmac('sha256', secret).update(canonical).digest('hex');
}

export function timingSafeEqualText(a: string, b: string): boolean {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}
