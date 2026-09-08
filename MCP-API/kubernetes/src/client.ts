import * as k8s from '@kubernetes/client-node';
import { config } from './config.js';

export class KubernetesError extends Error {
  constructor(public code: string, message: string, public status?: number, public retryAfter?: number) { super(message); }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export class KubernetesClient {
  readonly core: k8s.CoreV1Api;
  readonly apps: k8s.AppsV1Api;
  private kc: k8s.KubeConfig;

  constructor(private cfg = config) {
    this.kc = new k8s.KubeConfig();
    if (cfg.kubeconfig) this.kc.loadFromFile(cfg.kubeconfig); else this.kc.loadFromDefault();
    if (cfg.context) this.kc.setCurrentContext(cfg.context);
    this.core = this.kc.makeApiClient(k8s.CoreV1Api);
    this.apps = this.kc.makeApiClient(k8s.AppsV1Api);
  }

  context() { return this.kc.getCurrentContext(); }

  async call<T>(operation: () => Promise<T>, opts: { retry?: boolean } = { retry: true }): Promise<T> {
    let last: unknown;
    for (let attempt = 0; attempt <= (opts.retry ? this.cfg.maxRetries : 0); attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        return await Promise.race([
          operation(),
          new Promise<T>((_, reject) => controller.signal.addEventListener('abort', () => reject(new KubernetesError('TIMEOUT', `Kubernetes request timed out after ${this.cfg.timeoutMs}ms`))))
        ]);
      } catch (e: any) {
        last = e;
        const status = e?.statusCode ?? e?.response?.statusCode ?? e?.body?.code;
        const headers = e?.response?.headers ?? {};
        const retryAfter = Number(headers['retry-after']);
        if ([400, 401, 403, 404, 409, 422].includes(status) || !opts.retry || attempt >= this.cfg.maxRetries) throw this.map(e);
        if (!(status === 429 || status >= 500 || e?.code === 'ECONNRESET' || e?.code === 'ETIMEDOUT')) throw this.map(e);
        await sleep(Number.isFinite(retryAfter) ? retryAfter * 1000 : Math.min(250 * 2 ** attempt, 2000));
      } finally { clearTimeout(timer); }
    }
    throw this.map(last);
  }

  map(e: any): KubernetesError {
    if (e instanceof KubernetesError) return e;
    const status = e?.statusCode ?? e?.response?.statusCode ?? e?.body?.code;
    const reason = e?.body?.reason ?? e?.body?.message ?? e?.message ?? 'Kubernetes API error';
    const code = status === 401 ? 'AUTHENTICATION_FAILED' : status === 403 ? 'PERMISSION_DENIED' : status === 404 ? 'NOT_FOUND' : status === 409 ? 'CONFLICT' : status === 429 ? 'RATE_LIMITED' : status >= 500 ? 'UPSTREAM_ERROR' : 'KUBERNETES_ERROR';
    return new KubernetesError(code, String(reason), status, Number(e?.response?.headers?.['retry-after']) || undefined);
  }
}
