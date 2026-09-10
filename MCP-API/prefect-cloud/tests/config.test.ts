import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";

describe("authentication and configuration", () => {
  it("keeps credentials optional until a transport actually needs them", () => {
    const cfg = loadConfig({ PREFECT_MCP_TRANSPORT: "http" });
    expect(cfg.mcpUrl).toBe("https://prefect.fastmcp.app/mcp");
    expect(cfg.apiKey).toBeUndefined();
  });

  it("rejects cleartext remote REST targets", () => {
    expect(() => loadConfig({ PREFECT_API_URL: "http://example.com/api" })).toThrow(/HTTPS/);
  });

  it("permits localhost for self-hosted development", () => {
    expect(loadConfig({ PREFECT_API_URL: "http://localhost:4200/api" }).apiUrl)
      .toBe("http://localhost:4200/api");
  });

  it("rejects weak approval secrets", () => {
    expect(() => loadConfig({ PREFECT_APPROVAL_TOKEN: "short" })).toThrow();
  });
});
