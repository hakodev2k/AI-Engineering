import { describe, expect, it, vi } from "vitest";
import { registerTools } from "../src/tools.js";
import type { StatusCakeConfig } from "../src/config.js";

const config: StatusCakeConfig = { apiToken:"x", apiBaseUrl:"https://api.statuscake.com/v1", timeoutMs:1000, maxRetries:0, requireWriteApproval:true, enableDestructive:false };

describe("tool registration", () => {
  it("registers the documented provider-scoped tools", () => {
    const names: string[] = [];
    const server = { tool: (name: string) => { names.push(name); } } as any;
    const api = { request: vi.fn() } as any;
    registerTools(server, api, config);
    expect(names).toHaveLength(19);
    expect(names).toContain("statuscake.uptime.list");
    expect(names).toContain("statuscake.maintenance_window.create");
    expect(names).toContain("statuscake.location.list");
    expect(names.every(n => n.startsWith("statuscake."))).toBe(true);
  });
});
