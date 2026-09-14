import { PipedreamClient, PipedreamError } from "@pipedream/sdk";

export class ConnectorError extends Error {
  constructor(public code: string, message: string, public status?: number, public retryable = false) { super(message); }
}

export type PdLike = {
  apps: { list(r?: any, o?: any): Promise<any>; retrieve(id: string, r?: any, o?: any): Promise<any> };
  components: { list(r?: any, o?: any): Promise<any>; retrieve(id: string, r?: any, o?: any): Promise<any> };
  actions: {
    list(r?: any, o?: any): Promise<any>;
    retrieve(id: string, r?: any, o?: any): Promise<any>;
    configureProp(r: any, o?: any): Promise<any>;
    reloadProps(r: any, o?: any): Promise<any>;
    run(r: any, o?: any): Promise<any>;
  };
  accounts: { list(r?: any, o?: any): Promise<any> };
};

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new ConnectorError("CONFIGURATION_ERROR", `${name} is required.`);
  return v;
}

export function createPipedreamClient(): PdLike {
  return new PipedreamClient({
    clientId: required("PIPEDREAM_CLIENT_ID"),
    clientSecret: required("PIPEDREAM_CLIENT_SECRET"),
    projectId: required("PIPEDREAM_PROJECT_ID"),
    projectEnvironment: process.env.PIPEDREAM_PROJECT_ENVIRONMENT || "development",
    timeoutInSeconds: Number(process.env.PIPEDREAM_TIMEOUT_SECONDS || 30),
    maxRetries: Math.min(5, Math.max(0, Number(process.env.PIPEDREAM_READ_MAX_RETRIES || 2)))
  }) as unknown as PdLike;
}

export function readOptions() {
  return {
    timeoutInSeconds: Number(process.env.PIPEDREAM_TIMEOUT_SECONDS || 30),
    maxRetries: Math.min(5, Math.max(0, Number(process.env.PIPEDREAM_READ_MAX_RETRIES || 2)))
  };
}

export function writeOptions() {
  return { timeoutInSeconds: Number(process.env.PIPEDREAM_TIMEOUT_SECONDS || 30), maxRetries: 0 };
}

export async function safeCall<T>(fn: () => Promise<T>): Promise<T> {
  try { return await fn(); }
  catch (e: any) {
    if (e instanceof ConnectorError) throw e;
    if (e instanceof PipedreamError) {
      const status = Number((e as any).statusCode || 0) || undefined;
      const retryable = status === 408 || status === 429 || status === 502 || status === 503 || status === 504;
      const code = status === 401 ? "AUTHENTICATION_ERROR" : status === 403 ? "PERMISSION_ERROR" : status === 429 ? "RATE_LIMITED" : "PIPEDREAM_API_ERROR";
      throw new ConnectorError(code, `Pipedream request failed${status ? ` (${status})` : ""}.`, status, retryable);
    }
    if (e?.name === "AbortError") throw new ConnectorError("TIMEOUT", "Pipedream request timed out.", undefined, true);
    throw new ConnectorError("NETWORK_ERROR", e instanceof Error ? e.message : "Unknown Pipedream error", undefined, true);
  }
}

export function pageData(page: any): unknown {
  if (page?.response) return page.response;
  return page;
}
