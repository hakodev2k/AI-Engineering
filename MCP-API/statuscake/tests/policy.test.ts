import { describe, expect, it } from "vitest";
import { enforceRisk } from "../src/policy.js";
import type { StatusCakeConfig } from "../src/config.js";

const base: StatusCakeConfig = { apiToken:"x", apiBaseUrl:"https://api.statuscake.com/v1", timeoutMs:1000, maxRetries:0, requireWriteApproval:true, enableDestructive:false };

describe("risk policy", () => {
  it("allows READ without approval", () => expect(() => enforceRisk(base,"READ",{})).not.toThrow());
  it("requires WRITE approval by default", () => expect(() => enforceRisk(base,"WRITE",{})).toThrow(/approval/));
  it("allows approved WRITE", () => expect(() => enforceRisk(base,"WRITE",{approved:true})).not.toThrow());
  it("blocks DESTRUCTIVE while disabled", () => expect(() => enforceRisk(base,"DESTRUCTIVE",{approved:true})).toThrow(/disabled/));
});
