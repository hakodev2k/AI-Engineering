import {z} from 'zod'; import type {Upstream,AllowedTool} from './upstream.js'; import {requireApproval,type Risk} from './security.js';
export interface ToolDef{name:string;description:string;risk:Risk;schema:z.ZodObject<any>;run:(raw:unknown,signal?:AbortSignal)=>Promise<unknown>}
const approved={approved:z.boolean().optional()}; const text=z.string().min(1).max(20000); const ident=z.string().min(1).max(256);
export function createTools(upstream:Upstream,requireWrite=true):ToolDef[]{ const make=(name:string,description:string,risk:Risk,up:AllowedTool,schema:z.ZodObject<any>,map:(v:any)=>Record<string,unknown>)=>({name,description,risk,schema,run:async(raw:unknown,signal?:AbortSignal)=>{const v=schema.parse(raw);requireApproval(risk,v.approved,requireWrite);return upstream.callTool(up,map(v),signal)}}); return [
make('motherduck.database.list','List databases visible to the authenticated MotherDuck principal.','READ','list_databases',z.object({}).strict(),()=>({})),
make('motherduck.share.list','List MotherDuck shares visible to the authenticated principal.','READ','list_shares',z.object({}).strict(),()=>({})),
make('motherduck.table.list','List tables in a database/schema using the official catalog tool.','READ','list_tables',z.object({database:ident,schema:ident.optional()}).strict(),v=>v),
make('motherduck.column.list','List columns and comments for a table.','READ','list_columns',z.object({database:ident,schema:ident.optional(),table:ident}).strict(),v=>v),
make('motherduck.catalog.search','Search MotherDuck catalog metadata without exhaustively listing it.','READ','search_catalog',z.object({query:z.string().min(1).max(1000)}).strict(),v=>v),
make('motherduck.docs.ask','Ask the official MotherDuck documentation tool a bounded question.','READ','ask_docs_question',z.object({question:z.string().min(1).max(4000)}).strict(),v=>v),
make('motherduck.query.read','Run read-only SQL through MotherDuck official MCP.','READ','query',z.object({sql:text}).strict(),v=>({query:v.sql})),
make('motherduck.query.write','Run read-write SQL through MotherDuck official MCP. Requires explicit approval and upstream write permission.','HIGH_RISK','query_rw',z.object({sql:text,...approved}).strict(),v=>({query:v.sql}))
];}
