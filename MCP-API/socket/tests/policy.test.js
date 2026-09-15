import test from 'node:test';
import assert from 'node:assert/strict';
import { TOOLS, assertAllowed } from '../src/policy.js';

test('registers exactly the curated Socket tool surface',()=>{ assert.equal(Object.keys(TOOLS).length,7); assert.equal(TOOLS['socket.dependency.score'].upstream,'depscore'); });
test('public dependency scoring does not require token',()=>{ assert.equal(assertAllowed('socket.dependency.score',{}).risk,'READ'); });
test('organization operations require token',()=>{ assert.throws(()=>assertAllowed('socket.alert.list',{}),/SOCKET_API_TOKEN/); assert.doesNotThrow(()=>assertAllowed('socket.alert.list',{SOCKET_API_TOKEN:'test'})); });
test('unknown upstream escape hatch is denied',()=>{ assert.throws(()=>assertAllowed('socket.execute_any_api_request',{}),/not allowed/); });
test('all exposed operations are read-only',()=>{ for(const p of Object.values(TOOLS)) assert.equal(p.risk,'READ'); });
