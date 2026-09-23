import { describe, expect, it } from "vitest";
import { PdfCoUpstream } from "../src/upstream.js";

describe("PDF.co upstream configuration", () => {
  it("fails safely without credentials before spawning upstream", async () => {
    const client = new PdfCoUpstream({});
    await expect(client.connect()).rejects.toThrow("PDFCO_API_KEY is required");
  });
  it("rejects non-allowlisted upstream tool names", async () => {
    const client = new PdfCoUpstream({ PDFCO_API_KEY: "unit-test-only", PDFCO_UVX_COMMAND: "definitely-not-executed" });
    await expect(client.call("arbitrary_request", {})).rejects.toThrow("Upstream tool is not allowlisted");
  });
});
