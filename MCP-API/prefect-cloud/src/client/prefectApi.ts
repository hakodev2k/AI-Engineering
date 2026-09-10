import type { ConnectorConfig } from "../config.js";
import { CredentialProvider } from "../auth/credentials.js";

export class PrefectApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly retryAfterMs?: number,
  ) {
    super(message);
    this.name = "PrefectApiError";
  }
}

type FetchLike = typeof fetch;

function retryAfterMs(headers: Headers): number | undefined {
  const raw = headers.get("retry-after");
  if (!raw) return undefined;
  const seconds = Number(raw);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(raw);
  return Number.isFinite(date) ? Math.max(0, date - Date.now()) : undefined;
}

function isRetriableStatus(status: number): boolean {
  return status === 429 || status === 502 || status === 503 || status === 504;
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export class PrefectApiClient {
  private readonly credentials: CredentialProvider;

  constructor(
    private readonly config: ConnectorConfig,
    private readonly fetchImpl: FetchLike = fetch,
  ) {
    this.credentials = new CredentialProvider(config);
  }

  private url(path: string): string {
    if (!this.config.apiUrl) throw new Error("PREFECT_API_URL is required for REST API operations");
    if (!path.startsWith("/") || path.includes("..") || /^\/\//.test(path)) {
      throw new Error("Unsafe API path rejected");
    }
    return `${this.config.apiUrl}${path}`;
  }

  async request<T>(
    path: string,
    init: RequestInit,
    options: { safeToRetry?: boolean } = {},
  ): Promise<T> {
    const attempts = options.safeToRetry ? this.config.maxRetries + 1 : 1;
    let lastError: unknown;

    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.requestTimeoutMs);
      try {
        const response = await this.fetchImpl(this.url(path), {
          ...init,
          headers: { ...this.credentials.apiHeaders(), ...(init.headers ?? {}) },
          signal: controller.signal,
        });
        const text = await response.text();
        if (Buffer.byteLength(text, "utf8") > this.config.maxResponseBytes) {
          throw new Error("Prefect response exceeded configured maximum size");
        }
        if (!response.ok) {
          const wait = retryAfterMs(response.headers);
          const error = new PrefectApiError(
            `Prefect API ${response.status}: ${text.slice(0, 1000)}`,
            response.status,
            wait,
          );
          if (options.safeToRetry && isRetriableStatus(response.status) && attempt + 1 < attempts) {
            await sleep(wait ?? Math.min(250 * 2 ** attempt, 4000));
            continue;
          }
          throw error;
        }
        if (!text) return undefined as T;
        return JSON.parse(text) as T;
      } catch (error) {
        lastError = error;
        const networkFailure = !(error instanceof PrefectApiError) &&
          (error instanceof TypeError || (error instanceof Error && error.name === "AbortError"));
        if (options.safeToRetry && networkFailure && attempt + 1 < attempts) {
          await sleep(Math.min(250 * 2 ** attempt, 4000));
          continue;
        }
        throw error;
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError instanceof Error ? lastError : new Error("Prefect API request failed");
  }

  filter<T>(collection: "deployments" | "flows" | "flow_runs" | "task_runs" | "work_pools", filter: unknown, limit: number, offset: number): Promise<T> {
    const body: Record<string, unknown> = { limit, offset };
    if (filter && typeof filter === "object") body[collection] = filter;
    return this.request<T>(`/${collection}/filter`, {
      method: "POST",
      body: JSON.stringify(body),
    }, { safeToRetry: true });
  }

  getFlowRunLogs(flowRunId: string, limit: number): Promise<unknown> {
    return this.request("/logs/filter", {
      method: "POST",
      body: JSON.stringify({
        logs: { flow_run_id: { any_: [flowRunId] } },
        limit,
        sort: "TIMESTAMP_ASC",
      }),
    }, { safeToRetry: true });
  }

  createFlowRunFromDeployment(
    deploymentId: string,
    body: { parameters?: Record<string, unknown>; name?: string; tags?: string[]; idempotency_key?: string },
  ): Promise<unknown> {
    return this.request(`/deployments/${encodeURIComponent(deploymentId)}/create_flow_run`, {
      method: "POST",
      body: JSON.stringify(body),
    }, { safeToRetry: false });
  }
}
