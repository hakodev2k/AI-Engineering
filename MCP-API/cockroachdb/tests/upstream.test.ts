import test from "node:test";import assert from "node:assert/strict";import {withTimeout} from "../src/upstream.js";
test("bounded timeout rejects stalled upstream",async()=>{await assert.rejects(()=>withTimeout(new Promise(()=>{}),10),/timed out/)});
test("bounded timeout returns successful upstream value",async()=>assert.equal(await withTimeout(Promise.resolve("ok"),100),"ok"));
