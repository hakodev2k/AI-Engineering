import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export class PdfCoUpstream {
  private client?: Client;
  private transport?: StdioClientTransport;
  constructor(private readonly env = process.env) {}

  async connect(): Promise<void> {
    const apiKey = this.env.PDFCO_API_KEY;
    if (!apiKey) throw new Error("PDFCO_API_KEY is required");
    if (this.client) return;
    this.transport = new StdioClientTransport({
      command: this.env.PDFCO_UVX_COMMAND || "uvx",
      args: ["pdfco-mcp"],
      env: { ...this.env, X_API_KEY: apiKey } as Record<string, string>
    });
    this.client = new Client({ name: "daily-pdf-co-connector", version: "1.0.0" });
    await this.client.connect(this.transport);
    const listed = await this.client.listTools();
    const allowed = new Set([
      "pdf_to_text","pdf_to_json","pdf_info_reader","read_pdf_forms_info","find_text",
      "pdf_merge","pdf_split","pdf_make_searchable","ai_invoice_parser","fill_pdf_forms"
    ]);
    for (const tool of listed.tools) if (!allowed.has(tool.name)) continue;
    const missing = [...allowed].filter(x => !listed.tools.some(t => t.name === x));
    if (missing.length) { await this.close(); throw new Error(`Trusted upstream MCP missing required tools: ${missing.join(", ")}`); }
  }

  async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    await this.connect();
    const allowed = new Set(["pdf_to_text","pdf_to_json","pdf_info_reader","read_pdf_forms_info","find_text","pdf_merge","pdf_split","pdf_make_searchable","ai_invoice_parser","fill_pdf_forms"]);
    if (!allowed.has(name)) throw new Error("Upstream tool is not allowlisted");
    return this.client!.callTool({ name, arguments: args });
  }

  async close(): Promise<void> {
    await this.client?.close();
    this.client = undefined;
    this.transport = undefined;
  }
}
