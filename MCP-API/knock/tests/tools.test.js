import test from "node:test";import assert from "node:assert/strict";import {tools,byName} from "../src/tools.js";
test("curated count",()=>assert.ok(tools.length>=8&&tools.length<=20));
test("scoped names",()=>tools.forEach(t=>assert.match(t.name,/^knock\.[a-z0-9_.]+$/)));
test("no destructive",()=>assert.equal(tools.some(t=>t.risk==="DESTRUCTIVE"),false));
test("workflow trigger high risk",()=>assert.equal(byName.get("knock.workflow.trigger").risk,"HIGH_RISK"));
test("strict validation",()=>assert.throws(()=>byName.get("knock.user.get").validate({user_id:"u1",url:"https://evil.test"}),/Unknown argument/));
