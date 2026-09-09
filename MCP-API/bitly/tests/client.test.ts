import {describe,expect,it,vi} from 'vitest';
import {BitlyClient,BitlyError,bitlinkPath} from '../src/client.js';
const cfg={token:'secret',baseUrl:'https://api-ssl.bitly.com/v4',timeoutMs:1000,maxRetries:1,requireWriteApproval:true,destructiveEnabled:false};

describe('BitlyClient',()=>{
  it('adds bearer auth, query pagination, and returns JSON',async()=>{
    const f=vi.fn(async(input:RequestInfo|URL,init?:RequestInit)=>{expect(String(input)).toContain('search_after=cursor');expect((init?.headers as Record<string,string>).Authorization).toBe('Bearer secret');return new Response(JSON.stringify({ok:true}),{status:200,headers:{'content-type':'application/json'}})}) as unknown as typeof fetch;
    await expect(new BitlyClient(cfg,f).request('GET','/groups/g/bitlinks',undefined,{search_after:'cursor',size:10})).resolves.toEqual({ok:true});
  });
  it('does not retry mutating failures',async()=>{
    const f=vi.fn(async()=>new Response(JSON.stringify({message:'bad'}),{status:503})) as unknown as typeof fetch;
    await expect(new BitlyClient(cfg,f).request('POST','/shorten',{long_url:'https://example.com'})).rejects.toBeInstanceOf(BitlyError);expect(f).toHaveBeenCalledTimes(1);
  });
  it('retries bounded GET failures',async()=>{
    const f=vi.fn().mockResolvedValueOnce(new Response('',{status:503})).mockResolvedValueOnce(new Response(JSON.stringify({ok:true}),{status:200})) as unknown as typeof fetch;
    await expect(new BitlyClient(cfg,f).request('GET','/user')).resolves.toEqual({ok:true});expect(f).toHaveBeenCalledTimes(2);
  });
  it('validates bitlink path',()=>{expect(bitlinkPath('bit.ly/abc_123')).toBe('/bitlinks/bit.ly/abc_123');expect(()=>bitlinkPath('../bad')).toThrow()});
});
