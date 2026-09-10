import { describe, expect, it } from "vitest";
import crypto from "node:crypto";
import { loadConfig } from "../src/config.js";
import { authorize, TOOLS } from "../src/policy.js";

describe("PlanetScale connector policy", () => {
  it("rejects missing credentials", () => expect(() => loadConfig({})).toThrow());
  it("rejects non-official MCP hosts", () => expect(() => loadConfig({ PLANETSCALE_MCP_TOKEN:"x", PLANETSCALE_MCP_URL:"https://evil.example/mcp" })).toThrow());
  it("has provider-scoped unique tools", () => {
    const names = Object.keys(TOOLS); expect(new Set(names).size).toBe(names.length); expect(names.every(n=>n.startsWith("planetscale."))).toBe(true);
  });
  it("allows reads without approval", () => {
    const c = loadConfig({ PLANETSCALE_MCP_TOKEN:"x" }); expect(() => authorize(c,"planetscale.database.list",{})).not.toThrow();
  });
  it("denies writes by default", () => {
    const c = loadConfig({ PLANETSCALE_MCP_TOKEN:"x", PLANETSCALE_APPROVAL_SECRET:"0123456789abcdef" });
    expect(() => authorize(c,"planetscale.query.write",{query:"UPDATE t SET x=1 WHERE id=1",approvalToken:"x"})).toThrow(/disabled/);
  });
  it("requires payload-bound approval for writes", () => {
    const secret="0123456789abcdef";
    const c=loadConfig({PLANETSCALE_MCP_TOKEN:"x",PLANETSCALE_APPROVAL_SECRET:secret,PLANETSCALE_ENABLE_WRITE:"true"});
    const payload={organization:"o",database:"d",branch:"main",query:"UPDATE t SET x=1 WHERE id=1"};
    const stable=(v:any):string=>Array.isArray(v)?`[${v.map(stable).join(",")}]`:v&&typeof v==="object"?`{${Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>`${JSON.stringify(k)}:${stable(x)}`).join(",")}}`:JSON.stringify(v);
    const approvalToken=crypto.createHmac("sha256",secret).update(`planetscale.query.write\n${stable(payload)}`).digest("hex");
    expect(()=>authorize(c,"planetscale.query.write",{...payload,approvalToken})).not.toThrow();
    expect(()=>authorize(c,"planetscale.query.write",{...payload,query:"DELETE FROM t WHERE id=1",approvalToken})).toThrow(/approval/);
  });
});
