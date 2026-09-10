import type { ConnectorConfig } from "../config.js";

const SAFE_CHILD_ENV = [
  "PATH", "HOME", "USERPROFILE", "APPDATA", "LOCALAPPDATA", "TMP", "TEMP", "SYSTEMROOT",
];

export class CredentialProvider {
  constructor(private readonly config: ConnectorConfig) {}

  apiHeaders(): Record<string, string> {
    if (!this.config.apiKey) throw new Error("PREFECT_API_KEY is required for REST API operations");
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.config.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (this.config.apiVersion) headers["X-PREFECT-API-VERSION"] = this.config.apiVersion;
    return headers;
  }

  mcpHeaders(): Record<string, string> {
    return this.config.mcpAccessToken
      ? { Authorization: `Bearer ${this.config.mcpAccessToken}` }
      : {};
  }

  stdioEnv(): Record<string, string> {
    const env: Record<string, string> = {};
    for (const key of SAFE_CHILD_ENV) {
      const value = process.env[key];
      if (value) env[key] = value;
    }
    if (this.config.apiUrl) env.PREFECT_API_URL = this.config.apiUrl;
    if (this.config.apiKey) env.PREFECT_API_KEY = this.config.apiKey;
    return env;
  }
}
