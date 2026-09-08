import { describe,expect,it } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { HetznerClient } from '../src/client.js';
import { registerTools,TOOL_NAMES } from '../src/tools.js';

describe('tool registration',()=>{
  it('defines a stable unique provider-scoped tool catalog',()=>{expect(TOOL_NAMES.length).toBe(13);expect(new Set(TOOL_NAMES).size).toBe(TOOL_NAMES.length);for(const name of TOOL_NAMES)expect(name.startsWith('hetzner_cloud.')).toBe(true);});
  it('registers catalog without credentials or network access',()=>{const server=new McpServer({name:'test',version:'1'});expect(()=>registerTools(server,new HetznerClient())).not.toThrow();});
});
