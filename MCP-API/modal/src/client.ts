import { ModalClient } from "modal";
import type { Config } from "./config.js";

export type JsonValue = null | boolean | number | string | JsonValue[] | { [k: string]: JsonValue };

export class ModalConnectorClient {
  private readonly client: ModalClient;
  constructor(private readonly config: Config, client?: ModalClient) {
    this.client = client ?? new ModalClient({
      tokenId: config.tokenId,
      tokenSecret: config.tokenSecret,
      environment: config.environment,
      timeoutMs: config.timeoutMs,
      maxRetries: config.maxRetries,
      maxThrottleWaitSecs: config.maxThrottleWaitSecs
    });
  }

  async appGet(name: string) {
    const app = await this.client.apps.fromName(name, { environment: this.config.environment });
    return { appId: app.appId, name: app.name };
  }

  async functionInvoke(appName: string, functionName: string, args: JsonValue[] = [], kwargs: Record<string, JsonValue> = {}) {
    const fn = await this.client.functions.fromName(appName, functionName, { environment: this.config.environment });
    const result = await fn.remote(args, kwargs);
    return { result: result as JsonValue };
  }

  async functionSpawn(appName: string, functionName: string, args: JsonValue[] = [], kwargs: Record<string, JsonValue> = {}) {
    const fn = await this.client.functions.fromName(appName, functionName, { environment: this.config.environment });
    const call = await fn.spawn(args, kwargs);
    return { functionCallId: call.functionCallId };
  }

  async sandboxList(appId?: string, limit = 50) {
    const items: { sandboxId: string }[] = [];
    for await (const sb of this.client.sandboxes.list({ appId, environment: this.config.environment })) {
      items.push({ sandboxId: sb.sandboxId });
      if (items.length >= limit) break;
    }
    return { items };
  }

  async sandboxCreate(input: {
    appName: string;
    image: string;
    command?: string[];
    cpu?: number;
    memoryMiB?: number;
    gpu?: string;
    timeoutMs?: number;
    blockNetwork?: boolean;
    outboundDomainAllowlist?: string[];
    name?: string;
  }) {
    const app = await this.client.apps.fromName(input.appName, { environment: this.config.environment, createIfMissing: false });
    const image = this.client.images.fromRegistry(input.image);
    const sb = await this.client.sandboxes.create(app, image, {
      command: input.command,
      cpu: input.cpu,
      memoryMiB: input.memoryMiB,
      gpu: input.gpu,
      timeoutMs: input.timeoutMs,
      blockNetwork: input.blockNetwork,
      outboundDomainAllowlist: input.outboundDomainAllowlist,
      name: input.name
    });
    return { sandboxId: sb.sandboxId };
  }

  async sandboxExec(sandboxId: string, command: string[], timeoutMs?: number) {
    const sb = await this.client.sandboxes.fromId(sandboxId);
    const proc = await sb.exec(command, { timeoutMs, mode: "text" });
    const [stdout, stderr] = await Promise.all([proc.stdout.readText(), proc.stderr.readText()]);
    return { stdout, stderr };
  }

  async sandboxTerminate(sandboxId: string) {
    const sb = await this.client.sandboxes.fromId(sandboxId);
    const exitCode = await sb.terminate({ wait: true });
    return { sandboxId, exitCode };
  }

  async volumeGet(name: string) {
    const volume = await this.client.volumes.fromName(name, { environment: this.config.environment, createIfMissing: false });
    return { volumeId: volume.volumeId, name: volume.name };
  }

  async volumeDelete(name: string) {
    await this.client.volumes.delete(name, { environment: this.config.environment, allowMissing: false });
    return { deleted: true, name };
  }

  close(): void { this.client.close(); }
}
