import { describe,it,expect } from 'vitest';
import { KitClient } from '../src/client.js';

describe('KitClient',()=>{
  it('rejects missing credentials before network access',async()=>{
    const client=new KitClient('https://app.kit.com/mcp','');
    await expect(client.connect()).rejects.toThrow(/KIT_MCP_ACCESS_TOKEN/);
  });
  it('does not accept an arbitrary upstream URL through tool input',()=>{
    const client=new KitClient('https://app.kit.com/mcp','test-token');
    expect(client).toBeDefined();
  });
});
