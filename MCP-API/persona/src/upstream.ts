import Ajv, { type ValidateFunction } from "ajv";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { Config } from "./config.js";

export interface Upstream {
  connect(): Promise<void>;
  call(operation: OperationKey, args: Record<string, unknown>): Promise<unknown>;
  close(): Promise<void>;
}

export type OperationKey =
  | "inquiry.list" | "inquiry.get" | "inquiry.search" | "inquiry.create"
  | "account.list" | "account.get"
  | "case.list" | "case.get"
  | "verification.get" | "report.get" | "transaction.get" | "webhook.list";

type OperationHint = { aliases: string[]; requiredTokens: string[]; forbiddenTokens?: string[] };

const HINTS: Record<OperationKey, OperationHint> = {
  "inquiry.list": { aliases: ["list_all_inquiries", "list_inquiries", "inquiries_list"], requiredTokens: ["inquir", "list"] },
  "inquiry.get": { aliases: ["retrieve_an_inquiry", "get_inquiry", "retrieve_inquiry"], requiredTokens: ["inquir", "retrieve"] },
  "inquiry.search": { aliases: ["search_inquiries", "inquiries_search"], requiredTokens: ["inquir", "search"] },
  "inquiry.create": { aliases: ["create_an_inquiry", "create_inquiry", "inquiries_create"], requiredTokens: ["inquir", "create"] },
  "account.list": { aliases: ["list_all_accounts", "list_accounts", "accounts_list"], requiredTokens: ["account", "list"] },
  "account.get": { aliases: ["retrieve_an_account", "get_account", "retrieve_account"], requiredTokens: ["account", "retrieve"] },
  "case.list": { aliases: ["list_all_cases", "list_cases", "cases_list"], requiredTokens: ["case", "list"] },
  "case.get": { aliases: ["retrieve_a_case", "get_case", "retrieve_case"], requiredTokens: ["case", "retrieve"] },
  "verification.get": { aliases: ["retrieve_a_verification", "get_verification", "retrieve_verification"], requiredTokens: ["verification", "retrieve"] },
  "report.get": { aliases: ["retrieve_a_report", "get_report", "retrieve_report"], requiredTokens: ["report", "retrieve"] },
  "transaction.get": { aliases: ["retrieve_a_transaction", "get_transaction", "retrieve_transaction"], requiredTokens: ["transaction", "retrieve"] },
  "webhook.list": { aliases: ["list_all_webhooks", "list_webhooks", "webhooks_list"], requiredTokens: ["webhook", "list"] }
};

function normalized(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function hasStem(text: string, stem: string): boolean {
  return normalized(text).includes(normalized(stem));
}

function resolveTool(operation: OperationKey, tools: Tool[]): Tool {
  const hint = HINTS[operation];
  const exact = tools.find((tool) => hint.aliases.includes(normalized(tool.name)));
  if (exact) return exact;

  const scored = tools.map((tool) => {
    const haystack = `${tool.name} ${tool.description ?? ""}`;
    if (hint.forbiddenTokens?.some((token) => hasStem(haystack, token))) return { tool, score: -1 };
    const score = hint.requiredTokens.reduce((sum, token) => sum + (hasStem(haystack, token) ? 1 : 0), 0);
    return { tool, score };
  }).filter((entry) => entry.score === hint.requiredTokens.length);

  if (scored.length !== 1) {
    const matches = scored.map((entry) => entry.tool.name).join(", ") || "none";
    throw new Error(`Could not safely resolve Persona MCP operation '${operation}'. Candidate matches: ${matches}`);
  }
  return scored[0].tool;
}

export class PersonaUpstream implements Upstream {
  private readonly client = new Client({ name: "daily-persona-connector", version: "1.0.0" });
  private readonly validators = new Map<string, ValidateFunction>();
  private readonly resolved = new Map<OperationKey, string>();
  private readonly ajv = new Ajv({ allErrors: true, strict: false });
  private connected = false;

  constructor(private readonly config: Config) {}

  async connect(): Promise<void> {
    if (this.connected) return;
    const transport = new StreamableHTTPClientTransport(new URL(this.config.mcpUrl), {
      requestInit: {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Persona-Version": this.config.personaVersion
        }
      }
    });
    await this.client.connect(transport);
    const response = await this.client.listTools();
    const tools = response.tools as Tool[];
    for (const operation of Object.keys(HINTS) as OperationKey[]) {
      const tool = resolveTool(operation, tools);
      if (!tool.inputSchema) throw new Error(`Persona MCP tool '${tool.name}' has no input schema`);
      this.resolved.set(operation, tool.name);
      this.validators.set(tool.name, this.ajv.compile(tool.inputSchema as object));
    }
    this.connected = true;
  }

  async call(operation: OperationKey, args: Record<string, unknown>): Promise<unknown> {
    await this.connect();
    const name = this.resolved.get(operation);
    if (!name) throw new Error(`Persona operation '${operation}' is unavailable`);
    const validate = this.validators.get(name);
    if (!validate || !validate(args)) throw new Error(`Invalid arguments for ${operation}: ${this.ajv.errorsText(validate?.errors)}`);

    let lastError: unknown;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        return await this.client.callTool({ name, arguments: args }, undefined, { signal: controller.signal });
      } catch (error) {
        lastError = error;
        const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
        const retryable = /429|rate.?limit|temporar|timeout|timed out|502|503|504/.test(message);
        if (!retryable || attempt === this.config.maxRetries) throw error;
        await new Promise((resolve) => setTimeout(resolve, Math.min(300 * 2 ** attempt, 3000)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError;
  }

  async close(): Promise<void> {
    if (this.connected) await this.client.close();
    this.connected = false;
  }
}
