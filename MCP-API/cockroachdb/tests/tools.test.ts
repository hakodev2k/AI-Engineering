import test from "node:test";import assert from "node:assert/strict";import {TOOL_ROUTES,ROUTE_BY_EXTERNAL} from "../src/tools.js";
test("exposes 8-20 curated tools",()=>assert.ok(TOOL_ROUTES.length>=8&&TOOL_ROUTES.length<=20));
test("names are unique and provider scoped",()=>{assert.equal(new Set(TOOL_ROUTES.map(x=>x.external)).size,TOOL_ROUTES.length);for(const x of TOOL_ROUTES){assert.match(x.external,/^cockroachdb\.[a-z0-9_.]+$/);assert.equal(ROUTE_BY_EXTERNAL.get(x.external),x)}});
test("no delete/drop/truncate capability is exposed",()=>{for(const x of TOOL_ROUTES)assert.doesNotMatch(x.external+" "+x.upstream,/(delete|drop|truncate)/i)});
test("write tools are explicitly classified",()=>{assert.equal(ROUTE_BY_EXTERNAL.get("cockroachdb.database.create")?.risk,"WRITE");assert.equal(ROUTE_BY_EXTERNAL.get("cockroachdb.row.update")?.risk,"HIGH_RISK")});
