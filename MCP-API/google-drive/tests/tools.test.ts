import test from 'node:test';import assert from 'node:assert/strict';import {defs,byName} from '../src/tools.js';
test('8-20 curated tools',()=>assert.ok(defs.length>=8&&defs.length<=20));
test('provider-scoped unique names',()=>{assert.equal(new Set(defs.map(x=>x.name)).size,defs.length);for(const d of defs)assert.match(d.name,/^google-drive\./)});
test('no destructive tool',()=>assert.equal(defs.some(x=>x.risk==='DESTRUCTIVE'),false));
test('permission sharing is high risk',()=>assert.equal(byName.get('google-drive.permission.create')?.risk,'HIGH_RISK'));
test('strict validation rejects arbitrary fields',()=>assert.equal(byName.get('google-drive.file.metadata.get')!.schema.safeParse({fileId:'abc123',url:'https://evil.test'}).success,false));
