#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';

const file=process.argv[2];
if(!file){console.error('Usage: schema-cache-probe.mjs <tools.json>');process.exit(2);}
let data;try{data=JSON.parse(fs.readFileSync(file,'utf8'));}catch(e){console.error(`Invalid JSON: ${e.message}`);process.exit(2);}
const tools=Array.isArray(data)?data:data.tools;
if(!Array.isArray(tools)){console.error('Expected array or {tools:[...]}');process.exit(2);}
function stable(v){if(Array.isArray(v))return v.map(stable);if(v&&typeof v==='object')return Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])]));return v;}
function fp(v){return crypto.createHash('sha256').update(JSON.stringify(stable(v))).digest('hex');}
const rows=tools.map(t=>({name:t.name,hasOutputSchema:!!t.outputSchema,hasId:!!(t.outputSchema&&typeof t.outputSchema.$id==='string'),fingerprint:t.outputSchema?fp(t.outputSchema):null}));
const byFp=new Map();for(const r of rows){if(!r.fingerprint)continue;const a=byFp.get(r.fingerprint)||[];a.push(r.name);byFp.set(r.fingerprint,a);}
const duplicates=[...byFp.entries()].filter(([,names])=>names.length>1).map(([fingerprint,names])=>({fingerprint,names}));
const report={toolCount:rows.length,outputSchemaCount:rows.filter(r=>r.hasOutputSchema).length,outputSchemasWithoutId:rows.filter(r=>r.hasOutputSchema&&!r.hasId).length,distinctOutputSchemaFingerprints:byFp.size,duplicateStructuralSchemas:duplicates,tools:rows};
console.log(JSON.stringify(report,null,2));
