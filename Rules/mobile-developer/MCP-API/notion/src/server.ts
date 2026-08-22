import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { NotionUpstream } from './upstream.js';
import { assertApproval } from './policy.js';

const cfg = loadConfig();
const upstream = new NotionUpstream(cfg);
const server = new McpServer({ name: 'notion-mcp-connector', version: '1.0.0' });

function register(name: string, description: string, schema: Record<string, z.ZodTypeAny>, upstreamName: string, risk: 'READ'|'WRITE'|'HIGH_RISK', transform?: (args: any) => Record<string, unknown>) {
  server.tool(name, description, schema, async (args: any) => {
    if (risk !== 'READ') assertApproval(name, args.approvalId, cfg.approvalSecret);
    const clean = transform ? transform(args) : { ...args };
    delete (clean as any).approvalId;
    const result = await upstream.call(upstreamName, clean);
    return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
  });
}

const objectRecord = () => z.record(z.string(), z.unknown());

register('notion.workspace.get','Get connected workspace/user identity.',{},'notion-fetch','READ',()=>({id:'self'}));
register('notion.search','Search accessible Notion content.',{query:z.string().min(1).max(500)},'notion-search','READ');
register('notion.content.fetch','Fetch a page, database, data source, or subtree.',{id:z.string().min(1).max(500)},'notion-fetch','READ');
register('notion.comments.get','Get comments/discussions for a page.',{page_id:z.string().min(1)},'notion-get-comments','READ');
register('notion.users.get','List/search users.',{query:z.string().max(200).optional(),user_id:z.string().optional(),page_size:z.number().int().min(1).max(100).optional()},'notion-get-users','READ');
register('notion.teams.get','List teams/teamspaces.',{query:z.string().max(200).optional()},'notion-get-teams','READ');
register('notion.page.create','Create one or more pages. Requires approval.',{parent:objectRecord().optional(),pages:z.array(objectRecord()).min(1).max(20),approvalId:z.string()},'notion-create-pages','WRITE');
register('notion.page.update','Update a page. Requires approval.',{page_id:z.string().min(1),command:z.string().min(1),approvalId:z.string(),properties:objectRecord().optional(),content:z.string().max(200000).optional(),new_str:z.string().max(200000).optional()},'notion-update-page','WRITE');
register('notion.comment.create','Create a comment. Requires approval.',{page_id:z.string().min(1),markdown:z.string().min(1).max(20000),approvalId:z.string()},'notion-create-comment','WRITE');
register('notion.page.move','Move pages to a new parent. High-risk; requires approval.',{page_or_database_ids:z.array(z.string()).min(1).max(20),new_parent:objectRecord(),approvalId:z.string()},'notion-move-pages','HIGH_RISK');
register('notion.page.duplicate','Duplicate a page. Requires approval.',{page_id:z.string().min(1),approvalId:z.string()},'notion-duplicate-page','WRITE');
register('notion.database.create','Create a database. Requires approval.',{parent:objectRecord(),title:z.string().min(1).max(200),properties:objectRecord(),approvalId:z.string()},'notion-create-database','WRITE');

await server.connect(new StdioServerTransport());
