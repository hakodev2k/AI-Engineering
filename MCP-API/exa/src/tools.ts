import { z } from "zod";
import type { Config } from "./config.js";
import type { Upstream } from "./upstream.js";

export const schemas = {
  search: z.object({ query: z.string().min(1).max(2000), numResults: z.number().int().min(1).max(20).default(10) }),
  advanced: z.object({ query: z.string().min(1).max(2000), numResults: z.number().int().min(1).max(20).default(10), includeDomains: z.array(z.string().min(1).max(253)).max(20).optional(), excludeDomains: z.array(z.string().min(1).max(253)).max(20).optional(), startPublishedDate: z.string().datetime().optional(), endPublishedDate: z.string().datetime().optional() }),
  fetch: z.object({ urls: z.array(z.string().url().refine(v => v.startsWith("https://") || v.startsWith("http://"), "HTTP(S) only")).min(1).max(10) }),
  research: z.object({ prompt: z.string().min(3).max(8000), outputSchema: z.record(z.unknown()).optional(), approval: z.literal("APPROVE_EXA_RESEARCH").optional() })
};

export function handlers(upstream: Upstream, config: Config) {
  return {
    search: async (input: unknown) => upstream.call("web_search_exa", schemas.search.parse(input)),
    advanced: async (input: unknown) => upstream.call("web_search_advanced_exa", schemas.advanced.parse(input)),
    fetch: async (input: unknown) => upstream.call("web_fetch_exa", schemas.fetch.parse(input)),
    research: async (input: unknown) => {
      const parsed = schemas.research.parse(input);
      if (config.requireApproval && parsed.approval !== "APPROVE_EXA_RESEARCH") throw new Error("Human approval required: approval must equal APPROVE_EXA_RESEARCH");
      const { approval: _approval, ...args } = parsed;
      return upstream.call("agent_run", args);
    }
  };
}

export function safeResult(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify({ source: "exa", trust: "untrusted_external_content", data: value }) }] };
}
