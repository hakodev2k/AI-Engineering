import { Risk } from './policy.js';

const idPattern = '^[^/?#\\s]+$';
const id = { type: 'string', minLength: 1, maxLength: 300, pattern: idPattern };
const approval = { type: 'string', minLength: 16, maxLength: 512 };
const pagination = {
  limit: { type: 'integer', minimum: 1, maximum: 500 },
  pageToken: { type: 'string', minLength: 1, maxLength: 4096 }
};
const schema = (properties, required = []) => ({ type: 'object', properties, required, additionalProperties: false });

function ensureObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Tool arguments must be an object.');
}
function rejectUnknown(args, allowed) {
  for (const key of Object.keys(args)) if (!allowed.includes(key)) throw new Error(`Unknown argument: ${key}.`);
}
function string(args, key, { required = false, max = 300, pattern } = {}) {
  const value = args[key];
  if (value === undefined && !required) return;
  if (typeof value !== 'string' || value.length < 1 || value.length > max) throw new Error(`${key} must be a non-empty string up to ${max} characters.`);
  if (pattern && !pattern.test(value)) throw new Error(`${key} contains unsupported characters.`);
}
function integer(args, key, min, max) {
  if (args[key] === undefined) return;
  if (!Number.isInteger(args[key]) || args[key] < min || args[key] > max) throw new Error(`${key} must be an integer between ${min} and ${max}.`);
}
function boolean(args, key) { if (args[key] !== undefined && typeof args[key] !== 'boolean') throw new Error(`${key} must be boolean.`); }
function approvalCheck(args) { string(args, 'approvalToken', { required: true, max: 512 }); if (args.approvalToken.length < 16) throw new Error('approvalToken must be at least 16 characters.'); }
function idCheck(args, key) { string(args, key, { required: true, max: 300, pattern: /^[^/?#\s]+$/ }); }
function page(args) { integer(args, 'limit', 1, 500); string(args, 'pageToken', { max: 4096 }); }
function cells(args) {
  if (!Array.isArray(args.cells) || args.cells.length < 1 || args.cells.length > 100) throw new Error('cells must contain 1-100 entries.');
  for (const c of args.cells) {
    if (!c || typeof c !== 'object' || Array.isArray(c)) throw new Error('Each cell must be an object.');
    rejectUnknown(c, ['column', 'value']);
    string(c, 'column', { required: true, max: 300 });
    if (!Object.hasOwn(c, 'value')) throw new Error('Each cell requires value.');
  }
}

const defs = [
  ['coda.account.whoami','Verify the API token and return the current Coda user.',Risk.READ,schema({}),[], async c=>c.request('GET','/whoami')],
  ['coda.doc.list','List or search accessible Coda docs with bounded pagination.',Risk.READ,schema({...pagination,query:{type:'string',maxLength:500},isOwner:{type:'boolean'},workspaceId:id,folderId:id}),[], async(c,a)=>c.request('GET','/docs',{query:a})],
  ['coda.doc.get','Read metadata for one Coda doc.',Risk.READ,schema({docId:id},['docId']),['docId'], async(c,a)=>c.request('GET',`/docs/${encodeURIComponent(a.docId)}`)],
  ['coda.doc.create','Create a Coda doc, optionally from a source doc.',Risk.WRITE,schema({title:{type:'string',minLength:1,maxLength:250},sourceDoc:id,timezone:{type:'string',maxLength:100},folderId:id,approvalToken:approval},['title','approvalToken']),['title','approvalToken'], async(c,a)=>c.request('POST','/docs',{body:pick(a,['title','sourceDoc','timezone','folderId'])})],
  ['coda.page.list','List pages in a Coda doc.',Risk.READ,schema({docId:id,...pagination},['docId']),['docId'], async(c,a)=>c.request('GET',`/docs/${e(a.docId)}/pages`,{query:pick(a,['limit','pageToken'])})],
  ['coda.page.get','Read metadata for a page.',Risk.READ,schema({docId:id,pageIdOrName:id},['docId','pageIdOrName']),['docId','pageIdOrName'], async(c,a)=>c.request('GET',`/docs/${e(a.docId)}/pages/${e(a.pageIdOrName)}`)],
  ['coda.page.content.list','Read structured page content elements.',Risk.READ,schema({docId:id,pageIdOrName:id,...pagination},['docId','pageIdOrName']),['docId','pageIdOrName'], async(c,a)=>c.request('GET',`/docs/${e(a.docId)}/pages/${e(a.pageIdOrName)}/content`,{query:pick(a,['limit','pageToken'])})],
  ['coda.page.create','Create a page with optional initial text content.',Risk.WRITE,schema({docId:id,name:{type:'string',minLength:1,maxLength:250},subtitle:{type:'string',maxLength:500},parentPageId:id,html:{type:'string',maxLength:100000},approvalToken:approval},['docId','name','approvalToken']),['docId','name','approvalToken'], async(c,a)=>c.request('POST',`/docs/${e(a.docId)}/pages`,{body:{name:a.name,...defined({subtitle:a.subtitle,parentPageId:a.parentPageId,pageContent:a.html===undefined?undefined:{type:'canvas',canvasContent:{format:'html',content:a.html}}})}})],
  ['coda.page.update','Update page metadata or append/prepend Markdown content.',Risk.WRITE,schema({docId:id,pageIdOrName:id,name:{type:'string',minLength:1,maxLength:250},subtitle:{type:'string',maxLength:500},isHidden:{type:'boolean'},html:{type:'string',maxLength:100000},insertionMode:{type:'string',enum:['append','prepend']},approvalToken:approval},['docId','pageIdOrName','approvalToken']),['docId','pageIdOrName','approvalToken'], async(c,a)=>c.request('PUT',`/docs/${e(a.docId)}/pages/${e(a.pageIdOrName)}`,{body:defined({name:a.name,subtitle:a.subtitle,isHidden:a.isHidden,contentUpdate:a.html===undefined?undefined:{insertionMode:a.insertionMode||'append',canvasContent:{format:'html',content:a.html}}})})],
  ['coda.table.list','List tables and views in a doc.',Risk.READ,schema({docId:id,...pagination,tableTypes:{type:'array',items:{type:'string',enum:['table','view','database']},maxItems:3}},['docId']),['docId'], async(c,a)=>c.request('GET',`/docs/${e(a.docId)}/tables`,{query:pick(a,['limit','pageToken','tableTypes'])})],
  ['coda.table.get','Read details for a table or view.',Risk.READ,schema({docId:id,tableIdOrName:id},['docId','tableIdOrName']),['docId','tableIdOrName'], async(c,a)=>c.request('GET',`/docs/${e(a.docId)}/tables/${e(a.tableIdOrName)}`)],
  ['coda.column.list','List columns in a table.',Risk.READ,schema({docId:id,tableIdOrName:id,...pagination},['docId','tableIdOrName']),['docId','tableIdOrName'], async(c,a)=>c.request('GET',`/docs/${e(a.docId)}/tables/${e(a.tableIdOrName)}/columns`,{query:pick(a,['limit','pageToken'])})],
  ['coda.row.list','List/filter rows in a table with bounded pagination.',Risk.READ,schema({docId:id,tableIdOrName:id,...pagination,query:{type:'string',maxLength:2000},sortBy:{type:'string',enum:['createdAt','natural','updatedAt']},useColumnNames:{type:'boolean'},valueFormat:{type:'string',enum:['simple','simpleWithArrays','rich']}},['docId','tableIdOrName']),['docId','tableIdOrName'], async(c,a)=>c.request('GET',`/docs/${e(a.docId)}/tables/${e(a.tableIdOrName)}/rows`,{query:pick(a,['limit','pageToken','query','sortBy','useColumnNames','valueFormat'])})],
  ['coda.row.get','Read one row in a table.',Risk.READ,schema({docId:id,tableIdOrName:id,rowIdOrName:id,useColumnNames:{type:'boolean'},valueFormat:{type:'string',enum:['simple','simpleWithArrays','rich']}},['docId','tableIdOrName','rowIdOrName']),['docId','tableIdOrName','rowIdOrName'], async(c,a)=>c.request('GET',`/docs/${e(a.docId)}/tables/${e(a.tableIdOrName)}/rows/${e(a.rowIdOrName)}`,{query:pick(a,['useColumnNames','valueFormat'])})],
  ['coda.row.upsert','Insert or upsert one row in a base table.',Risk.WRITE,schema({docId:id,tableIdOrName:id,cells:{type:'array',minItems:1,maxItems:100,items:{type:'object',properties:{column:{type:'string',minLength:1,maxLength:300},value:{}},required:['column','value'],additionalProperties:false}},keyColumns:{type:'array',items:{type:'string',minLength:1,maxLength:300},maxItems:20},disableParsing:{type:'boolean'},approvalToken:approval},['docId','tableIdOrName','cells','approvalToken']),['docId','tableIdOrName','cells','approvalToken'], async(c,a)=>c.request('POST',`/docs/${e(a.docId)}/tables/${e(a.tableIdOrName)}/rows`,{query:pick(a,['disableParsing']),body:defined({rows:[{cells:a.cells}],keyColumns:a.keyColumns})})],
  ['coda.row.update','Update one existing row.',Risk.WRITE,schema({docId:id,tableIdOrName:id,rowIdOrName:id,cells:{type:'array',minItems:1,maxItems:100,items:{type:'object',properties:{column:{type:'string',minLength:1,maxLength:300},value:{}},required:['column','value'],additionalProperties:false}},disableParsing:{type:'boolean'},approvalToken:approval},['docId','tableIdOrName','rowIdOrName','cells','approvalToken']),['docId','tableIdOrName','rowIdOrName','cells','approvalToken'], async(c,a)=>c.request('PUT',`/docs/${e(a.docId)}/tables/${e(a.tableIdOrName)}/rows/${e(a.rowIdOrName)}`,{query:pick(a,['disableParsing']),body:{row:{cells:a.cells}}})],
  ['coda.formula.list','List named formulas in a doc.',Risk.READ,schema({docId:id,...pagination},['docId']),['docId'], async(c,a)=>c.request('GET',`/docs/${e(a.docId)}/formulas`,{query:pick(a,['limit','pageToken'])})],
  ['coda.formula.get','Read a formula and its computed value.',Risk.READ,schema({docId:id,formulaIdOrName:id},['docId','formulaIdOrName']),['docId','formulaIdOrName'], async(c,a)=>c.request('GET',`/docs/${e(a.docId)}/formulas/${e(a.formulaIdOrName)}`)],
  ['coda.automation.trigger','Trigger a configured webhook automation. This may cause external side effects.',Risk.HIGH_RISK,schema({docId:id,ruleId:id,message:{type:'string',maxLength:2000},approvalToken:approval},['docId','ruleId','approvalToken']),['docId','ruleId','approvalToken'], async(c,a)=>c.request('POST',`/docs/${e(a.docId)}/hooks/automation/${e(a.ruleId)}`,{body:defined({message:a.message})})],
  ['coda.button.push','Push a row button. The button may invoke arbitrary configured side effects.',Risk.HIGH_RISK,schema({docId:id,tableIdOrName:id,rowIdOrName:id,columnIdOrName:id,approvalToken:approval},['docId','tableIdOrName','rowIdOrName','columnIdOrName','approvalToken']),['docId','tableIdOrName','rowIdOrName','columnIdOrName','approvalToken'], async(c,a)=>c.request('POST',`/docs/${e(a.docId)}/tables/${e(a.tableIdOrName)}/rows/${e(a.rowIdOrName)}/buttons/${e(a.columnIdOrName)}`)]
];

const e = encodeURIComponent;
const pick = (o, keys) => Object.fromEntries(keys.filter(k=>o[k]!==undefined).map(k=>[k,o[k]]));
const defined = o => Object.fromEntries(Object.entries(o).filter(([,v])=>v!==undefined));

function validateSchema(value, spec, path = 'arguments') {
  if (!spec || Object.keys(spec).length === 0) return;
  if (spec.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${path} must be an object.`);
    const props = spec.properties || {};
    for (const key of Object.keys(value)) if (spec.additionalProperties === false && !Object.hasOwn(props, key)) throw new Error(`Unknown argument: ${path}.${key}.`);
    for (const key of spec.required || []) if (!Object.hasOwn(value, key)) throw new Error(`Missing required argument: ${path}.${key}.`);
    for (const [key, child] of Object.entries(props)) if (Object.hasOwn(value, key)) validateSchema(value[key], child, `${path}.${key}`);
    return;
  }
  if (spec.type === 'array') {
    if (!Array.isArray(value)) throw new Error(`${path} must be an array.`);
    if (spec.minItems !== undefined && value.length < spec.minItems) throw new Error(`${path} must contain at least ${spec.minItems} items.`);
    if (spec.maxItems !== undefined && value.length > spec.maxItems) throw new Error(`${path} must contain at most ${spec.maxItems} items.`);
    if (spec.items) value.forEach((item, i) => validateSchema(item, spec.items, `${path}[${i}]`));
    return;
  }
  if (spec.type === 'string') {
    if (typeof value !== 'string') throw new Error(`${path} must be a string.`);
    if (spec.minLength !== undefined && value.length < spec.minLength) throw new Error(`${path} is too short.`);
    if (spec.maxLength !== undefined && value.length > spec.maxLength) throw new Error(`${path} is too long.`);
    if (spec.pattern && !(new RegExp(spec.pattern)).test(value)) throw new Error(`${path} contains unsupported characters.`);
  } else if (spec.type === 'integer') {
    if (!Number.isInteger(value)) throw new Error(`${path} must be an integer.`);
    if (spec.minimum !== undefined && value < spec.minimum) throw new Error(`${path} is below minimum ${spec.minimum}.`);
    if (spec.maximum !== undefined && value > spec.maximum) throw new Error(`${path} exceeds maximum ${spec.maximum}.`);
  } else if (spec.type === 'boolean') {
    if (typeof value !== 'boolean') throw new Error(`${path} must be boolean.`);
  }
  if (spec.enum && !spec.enum.includes(value)) throw new Error(`${path} must be one of: ${spec.enum.join(', ')}.`);
}

function validate(def, args) {
  validateSchema(args, def.inputSchema);
  if (def.name === 'coda.page.update') {
    const changed = ['name','subtitle','isHidden','html'].some(k => Object.hasOwn(args, k));
    if (!changed) throw new Error('coda.page.update requires at least one of name, subtitle, isHidden, or html.');
    if (Object.hasOwn(args, 'insertionMode') && !Object.hasOwn(args, 'html')) throw new Error('insertionMode requires html.');
  }
  return args;
}

export const TOOLS = defs.map(([name,description,risk,inputSchema,requiredForValidation,handler]) => ({
  name, description, risk, inputSchema, requiredPermissions: risk===Risk.READ?['read']:['write'], approvalRequired:risk!==Risk.READ,
  validate(args){ return validate(this,args); }, handler
}));
export const TOOL_MAP = new Map(TOOLS.map(t=>[t.name,t]));
