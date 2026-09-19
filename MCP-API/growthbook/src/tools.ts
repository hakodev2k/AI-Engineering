import { z } from "zod";
import type { Risk } from "./policy.js";

const id = z.string().min(1).max(200).regex(/^[A-Za-z0-9._:-]+$/);
const approval = z.string().min(1).max(512).optional();
const jsonObject = z.record(z.string(), z.unknown());

export type ToolSpec = { description: string; risk: Risk; schema: Record<string, z.ZodTypeAny> };

export const tools: Record<string, ToolSpec> = {
  "growthbook.project.list": { description: "List GrowthBook projects.", risk: "READ", schema: {} },
  "growthbook.feature.list": { description: "List feature flags with bounded pagination.", risk: "READ", schema: { limit: z.number().int().min(1).max(100).default(50), offset: z.number().int().min(0).max(100000).default(0) } },
  "growthbook.feature.get": { description: "Get one feature flag by ID.", risk: "READ", schema: { featureId: id } },
  "growthbook.feature.create": { description: "Create a feature flag using an explicit GrowthBook feature payload.", risk: "WRITE", schema: { payload: jsonObject, approval } },
  "growthbook.feature.toggle": { description: "Enable or disable a feature in one environment by creating/updating the draft revision toggle.", risk: "WRITE", schema: { featureId: id, environment: id, enabled: z.boolean(), approval } },
  "growthbook.experiment.list": { description: "List/search experiments.", risk: "READ", schema: { query: z.string().max(200).optional(), status: z.enum(["draft", "running", "stopped"]).optional(), limit: z.number().int().min(1).max(100).default(50) } },
  "growthbook.experiment.get": { description: "Get one experiment by ID.", risk: "READ", schema: { experimentId: id } },
  "growthbook.experiment.results": { description: "Get computed results for an experiment.", risk: "READ", schema: { experimentId: id } },
  "growthbook.experiment.create": { description: "Create an experiment from an explicit GrowthBook experiment payload.", risk: "WRITE", schema: { payload: jsonObject, approval } },
  "growthbook.experiment.stop": { description: "Stop a running experiment. This can affect live experimentation and requires explicit high-risk approval.", risk: "HIGH_RISK", schema: { experimentId: id, payload: jsonObject.optional(), approval } }
};

export function pathFor(name: string, args: Record<string, unknown>): { method: "GET" | "POST"; path: string; body?: unknown } {
  const enc = (v: unknown) => encodeURIComponent(String(v));
  switch (name) {
    case "growthbook.project.list": return { method: "GET", path: "/api/v1/projects" };
    case "growthbook.feature.list": return { method: "GET", path: `/api/v2/features?limit=${args.limit}&offset=${args.offset}` };
    case "growthbook.feature.get": return { method: "GET", path: `/api/v2/features/${enc(args.featureId)}` };
    case "growthbook.feature.create": return { method: "POST", path: "/api/v2/features", body: args.payload };
    case "growthbook.feature.toggle": return { method: "POST", path: `/api/v2/features/${enc(args.featureId)}/revisions/new/toggle`, body: { environment: args.environment, enabled: args.enabled } };
    case "growthbook.experiment.list": {
      const q = new URLSearchParams({ limit: String(args.limit) });
      if (args.query) q.set("q", String(args.query));
      if (args.status) q.set("status", String(args.status));
      return { method: "GET", path: `/api/v1/experiments?${q}` };
    }
    case "growthbook.experiment.get": return { method: "GET", path: `/api/v1/experiments/${enc(args.experimentId)}` };
    case "growthbook.experiment.results": return { method: "GET", path: `/api/v1/experiments/${enc(args.experimentId)}/results` };
    case "growthbook.experiment.create": return { method: "POST", path: "/api/v1/experiments", body: args.payload };
    case "growthbook.experiment.stop": return { method: "POST", path: `/api/v1/experiments/${enc(args.experimentId)}/stop`, body: args.payload ?? {} };
    default: throw new Error("Unknown tool");
  }
}
