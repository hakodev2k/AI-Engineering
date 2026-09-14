import { CloudConvertClient } from "./client.js";
import { OfficialMcpBridge } from "./mcp-upstream.js";
import { assertId, assertPublicHttpsUrl, clampInt, requireApproval, type Risk, ValidationError } from "./security.js";

export type ToolSpec = { name: string; description: string; risk: Risk; inputSchema: any; annotations: any };
const obj = (properties: any, required: string[] = []) => ({ type: "object", additionalProperties: false, properties, required });
const s = (description: string) => ({ type: "string", description });
const approval = { approvalId: s("Opaque approval grant supplied out-of-band by the MCP host for gated actions.") };

export const tools: ToolSpec[] = [
  { name: "cloudconvert.user.get", risk: "READ", description: "READ: get the authenticated CloudConvert user and remaining credits.", inputSchema: obj({}), annotations: { readOnlyHint: true } },
  { name: "cloudconvert.job.list", risk: "READ", description: "READ: list jobs with optional status/tag filters and pagination.", inputSchema: obj({ status: { type: "string", enum: ["processing","finished","error"] }, tag: s("Exact job tag."), page: { type: "integer", minimum: 1, maximum: 10000 }, perPage: { type: "integer", minimum: 1, maximum: 100 } }), annotations: { readOnlyHint: true } },
  { name: "cloudconvert.job.get", risk: "READ", description: "READ: get a job by ID, including tasks and results.", inputSchema: obj({ jobId: s("CloudConvert job ID.") }, ["jobId"]), annotations: { readOnlyHint: true } },
  { name: "cloudconvert.task.get", risk: "READ", description: "READ: get an individual task by ID.", inputSchema: obj({ taskId: s("CloudConvert task ID.") }, ["taskId"]), annotations: { readOnlyHint: true } },
  { name: "cloudconvert.file.convert", risk: "WRITE", description: "WRITE: convert a file reachable at a public HTTPS URL and export a temporary download URL. May consume credits.", inputSchema: obj({ inputUrl: s("Public HTTPS input file URL."), outputFormat: { type: "string", pattern: "^[a-z0-9]{1,16}$" }, filename: s("Optional output filename."), tag: s("Optional job tag."), ...approval }, ["inputUrl","outputFormat"]), annotations: { readOnlyHint: false } },
  { name: "cloudconvert.file.optimize", risk: "WRITE", description: "WRITE: optimize a PDF, PNG, or JPG from a public HTTPS URL. May consume credits.", inputSchema: obj({ inputUrl: s("Public HTTPS input file URL."), profile: { type: "string", enum: ["web","print","archive","max"] }, ...approval }, ["inputUrl"]), annotations: { readOnlyHint: false } },
  { name: "cloudconvert.pdf.ocr", risk: "WRITE", description: "WRITE: add an OCR text layer to a PDF from a public HTTPS URL.", inputSchema: obj({ inputUrl: s("Public HTTPS PDF URL."), languages: { type: "array", minItems: 1, maxItems: 5, items: { type: "string", pattern: "^[a-z]{3}$" } }, ...approval }, ["inputUrl"]), annotations: { readOnlyHint: false } },
  { name: "cloudconvert.website.capture", risk: "WRITE", description: "WRITE: capture a public HTTPS website as PDF/PNG/JPG. Private/local destinations are rejected.", inputSchema: obj({ url: s("Public HTTPS webpage URL."), outputFormat: { type: "string", enum: ["pdf","png","jpg"] }, ...approval }, ["url","outputFormat"]), annotations: { readOnlyHint: false } },
  { name: "cloudconvert.job.create", risk: "HIGH_RISK", description: "HIGH_RISK: create an advanced job from a bounded task graph. Arbitrary command operations and credential-bearing import headers are forbidden.", inputSchema: obj({ tasks: { type: "object", minProperties: 1, maxProperties: 20, additionalProperties: { type: "object" } }, tag: s("Optional job tag."), ...approval }, ["tasks","approvalId"]), annotations: { readOnlyHint: false } },
  { name: "cloudconvert.task.cancel", risk: "WRITE", description: "WRITE: cancel a waiting or processing task.", inputSchema: obj({ taskId: s("CloudConvert task ID."), ...approval }, ["taskId"]), annotations: { readOnlyHint: false } },
  { name: "cloudconvert.webhook.list", risk: "READ", description: "READ: list configured webhooks without exposing signing secrets to the model.", inputSchema: obj({ page: { type: "integer", minimum: 1, maximum: 10000 }, perPage: { type: "integer", minimum: 1, maximum: 100 } }), annotations: { readOnlyHint: true } },
  { name: "cloudconvert.webhook.create", risk: "HIGH_RISK", description: "HIGH_RISK: create a webhook to a public HTTPS endpoint for selected job events.", inputSchema: obj({ url: s("Public HTTPS webhook URL."), events: { type: "array", minItems: 1, maxItems: 3, uniqueItems: true, items: { type: "string", enum: ["job.created","job.finished","job.failed"] } }, ...approval }, ["url","events","approvalId"]), annotations: { readOnlyHint: false } },
  { name: "cloudconvert.webhook.delete", risk: "DESTRUCTIVE", description: "DESTRUCTIVE: delete a webhook. Disabled by default and requires explicit approval.", inputSchema: obj({ webhookId: { type: "integer", minimum: 1 }, ...approval }, ["webhookId","approvalId"]), annotations: { readOnlyHint: false, destructiveHint: true } }
];

function stripSecretFields(data: any): any {
  if (Array.isArray(data)) return data.map(stripSecretFields);
  if (!data || typeof data !== "object") return data;
  const out: any = {};
  for (const [k,v] of Object.entries(data)) if (!/secret|token|password|authorization/i.test(k)) out[k] = stripSecretFields(v);
  return out;
}

function validateAdvancedTasks(tasks: Record<string, any>): void {
  const names = Object.keys(tasks);
  if (names.length < 1 || names.length > 20) throw new ValidationError("tasks must contain 1-20 entries.");
  for (const [name, task] of Object.entries(tasks)) {
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(name) || !task || typeof task !== "object") throw new ValidationError("Invalid task name or task payload.");
    const op = String(task.operation || "");
    if (!op || op === "command" || op.startsWith("command/") || /ffmpeg|imagemagick|graphicsmagick/i.test(op)) throw new ValidationError("Arbitrary command operations are not allowed by this connector.");
    if (task.headers != null) throw new ValidationError("Credential-bearing import headers are not allowed in advanced jobs.");
    if (typeof task.url === "string") assertPublicHttpsUrl(task.url);
  }
}

export class ToolRouter {
  constructor(private api = new CloudConvertClient(), private mcp = new OfficialMcpBridge()) {}
  async execute(name: string, a: any): Promise<any> {
    const spec = tools.find(t => t.name === name); if (!spec) throw new ValidationError("Unknown tool.");
    requireApproval(spec.risk, a?.approvalId);
    switch (name) {
      case "cloudconvert.user.get": {
        const m = await this.mcp.callIfCompatible("getUser", {}); if (m.handled) return m.data;
        return this.api.get("/users/me");
      }
      case "cloudconvert.job.list": {
        const q = new URLSearchParams(); if (a.status) q.set("filter[status]", a.status); if (a.tag) q.set("filter[tag]", a.tag); q.set("page", String(clampInt(a.page,1,1,10000))); q.set("per_page", String(clampInt(a.perPage,50,1,100)));
        return this.api.get(`/jobs?${q}`);
      }
      case "cloudconvert.job.get": return this.api.get(`/jobs/${assertId(a.jobId,"jobId")}`);
      case "cloudconvert.task.get": return this.api.get(`/tasks/${assertId(a.taskId,"taskId")}`);
      case "cloudconvert.file.convert": {
        const inputUrl = assertPublicHttpsUrl(a.inputUrl); const outputFormat = String(a.outputFormat).toLowerCase();
        if (!/^[a-z0-9]{1,16}$/.test(outputFormat)) throw new ValidationError("Invalid outputFormat.");
        const m = await this.mcp.callIfCompatible("convertFile", { inputUrl, outputFormat }); if (m.handled) return m.data;
        return this.api.post("/jobs", { tag: a.tag, tasks: { import: { operation:"import/url", url: inputUrl }, convert: { operation:"convert", input:"import", output_format: outputFormat, ...(a.filename ? { filename:String(a.filename) } : {}) }, export: { operation:"export/url", input:"convert" } } });
      }
      case "cloudconvert.file.optimize": {
        const inputUrl = assertPublicHttpsUrl(a.inputUrl); const args = { inputUrl, ...(a.profile ? { profile:a.profile } : {}) };
        const m = await this.mcp.callIfCompatible("optimizeFile", args); if (m.handled) return m.data;
        return this.api.post("/jobs", { tasks: { import: { operation:"import/url", url:inputUrl }, optimize: { operation:"optimize", input:"import", ...(a.profile ? { profile:a.profile } : {}) }, export: { operation:"export/url", input:"optimize" } } });
      }
      case "cloudconvert.pdf.ocr": {
        const inputUrl = assertPublicHttpsUrl(a.inputUrl); const languages = a.languages || ["eng"];
        const m = await this.mcp.callIfCompatible("pdfOcr", { inputUrl, languages }); if (m.handled) return m.data;
        return this.api.post("/jobs", { tasks: { import: { operation:"import/url", url:inputUrl }, ocr: { operation:"pdf/ocr", input:"import", language:languages }, export: { operation:"export/url", input:"ocr" } } });
      }
      case "cloudconvert.website.capture": {
        const url = assertPublicHttpsUrl(a.url); const m = await this.mcp.callIfCompatible("captureWebsite", { url, outputFormat:a.outputFormat }); if (m.handled) return m.data;
        return this.api.post("/jobs", { tasks: { capture: { operation:"capture-website", url, output_format:a.outputFormat }, export: { operation:"export/url", input:"capture" } } });
      }
      case "cloudconvert.job.create": validateAdvancedTasks(a.tasks); return this.api.post("/jobs", { tasks:a.tasks, ...(a.tag ? {tag:String(a.tag)} : {}) });
      case "cloudconvert.task.cancel": return this.api.post(`/tasks/${assertId(a.taskId,"taskId")}/cancel`);
      case "cloudconvert.webhook.list": {
        const q = new URLSearchParams({ page:String(clampInt(a.page,1,1,10000)), per_page:String(clampInt(a.perPage,50,1,100)) });
        return stripSecretFields(await this.api.get(`/users/me/webhooks?${q}`));
      }
      case "cloudconvert.webhook.create": return stripSecretFields(await this.api.post("/webhooks", { url:assertPublicHttpsUrl(a.url), events:a.events }));
      case "cloudconvert.webhook.delete": return this.api.delete(`/webhooks/${clampInt(a.webhookId,1,1,Number.MAX_SAFE_INTEGER)}`);
      default: throw new ValidationError("Tool not implemented.");
    }
  }
}
