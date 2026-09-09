import {describe,expect,it,vi} from 'vitest';
import {registerTools} from '../src/tools.js';

describe('tool registration and enforcement',()=>{
  it('registers the documented stable tool set and denies unapproved writes',async()=>{
    const tools=new Map<string,any>();
    const server={registerTool:(name:string,def:any,handler:any)=>tools.set(name,{def,handler})};
    const api={request:vi.fn(async()=>({ok:true}))};
    registerTools(server as any,api as any,{requireWriteApproval:true,destructiveEnabled:false});
    expect(tools.size).toBe(17);expect(tools.has('bitly.link.get')).toBe(true);expect(tools.has('bitly.link.delete')).toBe(true);
    const read=await tools.get('bitly.user.get').handler({});expect(read.isError).not.toBe(true);expect(api.request).toHaveBeenCalledWith('GET','/user');
    const denied=await tools.get('bitly.link.create').handler({long_url:'https://example.com'});expect(denied.isError).toBe(true);expect(api.request).toHaveBeenCalledTimes(1);
  });
  it('requires strong confirmation for deletion',async()=>{
    const tools=new Map<string,any>();const server={registerTool:(n:string,d:any,h:any)=>tools.set(n,{d,h})};const api={request:vi.fn(async()=>({}))};
    registerTools(server as any,api as any,{requireWriteApproval:true,destructiveEnabled:true});
    const result=await tools.get('bitly.link.delete').h({bitlink_id:'bit.ly/a',confirm_bitlink_id:'bit.ly/b',approved:true});expect(result.isError).toBe(true);expect(api.request).not.toHaveBeenCalled();
  });
});
