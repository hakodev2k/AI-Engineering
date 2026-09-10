import Ajv, { type ValidateFunction } from "ajv";
import type { ConnectorConfig } from "./auth.js";
import { assertApproved, BY_EXTERNAL, TOOL_POLICIES } from "./policy.js";
import type { JsonSchema, ToolPolicy, Upstream, UpstreamTool } from "./types.js";

export interface ExposedTool {
  name: string;
  description: string;
  inputSchema: JsonSchema;
  risk: ToolPolicy["risk"];
}

interface RuntimeTool extends ExposedTool {
  policy: ToolPolicy;
  validate: ValidateFunction;
}

function schemaWithApproval(schema: JsonSchema, policy: ToolPolicy, config: ConnectorConfig): JsonSchema {
  const base: JsonSchema = structuredClone(schema);
  base.type = "object";
  base.properties = { ...(base.properties || {}), _approval: { type: "boolean", description: "Set true only after explicit human approval." } };
  base.additionalProperties = false;
  const approvalRequired = policy.risk === "HIGH_RISK" || (policy.risk === "WRITE" && config.requireWriteApproval);
  if (approvalRequired) base.required = [...new Set([...(base.required || []), "_approval"])];
  return base;
}

function retryAfterMs(error: unknown): number | undefined {
  const text = error instanceof Error ? error.message : String(error);
  const match = text.match(/retry(?:-| )after[^0-9]*(\d+(?:\.\d+)?)/i);
  return match ? Math.min(30_000, Math.ceil(Number(match[1]) * 1000)) : undefined;
}

function transient(error: unknown): boolean {
  const text = error instanceof Error ? error.message : String(error);
  return /429|rate.?limit|timeout|timed out|ECONNRESET|ECONNREFUSED|network|fetch failed|502|503|504/i.test(text);
}

export class ToolRegistry {
  private readonly ajv = new Ajv({ allErrors: true, strict: false });
  private readonly runtime = new Map<string, RuntimeTool>();

  constructor(private readonly upstream: Upstream, private readonly config: ConnectorConfig) {}

  async initialize(): Promise<void> {
    const upstreamTools = await this.upstream.listTools();
    const byName = new Map(upstreamTools.map((t) => [t.name, t]));
    for (const policy of TOOL_POLICIES) {
      const source = byName.get(policy.upstreamName);
      if (!source) throw new Error(`Official OneSignal MCP is missing required allowlisted tool: ${policy.upstreamName}`);
      const inputSchema = schemaWithApproval(source.inputSchema, policy, this.config);
      this.runtime.set(policy.externalName, {
        name: policy.externalName,
        description: `${policy.purpose} Risk: ${policy.risk}. Upstream: official OneSignal MCP/${policy.upstreamName}.`,
        inputSchema,
        risk: policy.risk,
        policy,
        validate: this.ajv.compile(inputSchema)
      });
    }
  }

  list(): ExposedTool[] {
    return [...this.runtime.values()].map(({ name, description, inputSchema, risk }) => ({ name, description, inputSchema, risk }));
  }

  async call(externalName: string, args: Record<string, unknown>): Promise<unknown> {
    const tool = this.runtime.get(externalName);
    if (!tool || !BY_EXTERNAL.has(externalName)) throw new Error(`Unknown or disallowed tool: ${externalName}`);
    if (!tool.validate(args)) throw new Error(`Invalid input: ${this.ajv.errorsText(tool.validate.errors)}`);

    const approved = args._approval === true;
    assertApproved(tool.risk, approved, this.config);
    const upstreamArgs = { ...args };
    delete upstreamArgs._approval;

    const maxAttempts = tool.risk === "READ" ? 3 : 1;
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try { return await this.upstream.callTool(tool.policy.upstreamName, upstreamArgs); }
      catch (error) {
        lastError = error;
        if (attempt === maxAttempts || !transient(error)) break;
        const delay = retryAfterMs(error) ?? Math.min(4000, 250 * 2 ** (attempt - 1));
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }
}
