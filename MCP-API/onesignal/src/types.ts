export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export interface JsonSchema {
  type?: string;
  properties?: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
  [key: string]: unknown;
}

export interface UpstreamTool {
  name: string;
  description?: string;
  inputSchema: JsonSchema;
  [key: string]: unknown;
}

export interface Upstream {
  listTools(): Promise<UpstreamTool[]>;
  callTool(name: string, args: Record<string, unknown>): Promise<unknown>;
  close(): Promise<void>;
}

export interface ToolPolicy {
  externalName: string;
  upstreamName: string;
  risk: Risk;
  purpose: string;
}
