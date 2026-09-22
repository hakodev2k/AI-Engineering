import { describe, expect, it } from "vitest";
import { tools, validateLocalPolicy } from "../src/tools.js";
import { IncidentIoClient } from "../src/client.js";

describe("incident.io connector policy", () => {
  it("registers a useful fixed allowlist", () => { expect(tools.length).toBe(12); expect(new Set(tools.map(t => t.external)).size).toBe(12); });
  it("accepts strict read input", () => {
    const spec = tools.find(t => t.external === "incident-io.incident.show")!;
    expect(validateLocalPolicy(spec, { id: "INC-123", include: ["postmortem"] }, false).id).toBe("INC-123");
    expect(() => validateLocalPolicy(spec, { id: "INC-123", surprise: true }, false)).toThrow();
  });
  it("denies writes globally", () => {
    const spec = tools.find(t => t.external === "incident-io.incident.create")!;
    expect(() => validateLocalPolicy(spec, { name: "Outage", approved: true }, false)).toThrow(/writes disabled/);
  });
  it("requires per-call human approval", () => {
    const spec = tools.find(t => t.external === "incident-io.action.create")!;
    expect(() => validateLocalPolicy(spec, { incident_id: "01", description: "Rollback" }, true)).toThrow(/APPROVAL_REQUIRED/);
    expect(validateLocalPolicy(spec, { incident_id: "01", description: "Rollback", approved: true }, true)).not.toHaveProperty("approved");
  });
  it("prevents mutation through read-only ask", () => {
    const spec = tools.find(t => t.external === "incident-io.on_call.query")!;
    expect(() => validateLocalPolicy(spec, { question: "Who is on call now?" }, false)).not.toThrow();
    expect(() => validateLocalPolicy(spec, { question: "Acknowledge my page" }, false)).toThrow(/read-only/);
  });
  it("rejects SSRF-style upstream configuration", () => {
    expect(() => new IncidentIoClient("secret", "http://127.0.0.1/mcp")).toThrow();
    expect(() => new IncidentIoClient("secret", "https://mcp.incident.io/evil")).toThrow();
  });
});
