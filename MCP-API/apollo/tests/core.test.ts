import {describe,it,expect,vi,afterEach} from 'vitest';
import {ApolloClient,ApolloError,tools} from '../src/core.js';
afterEach(()=>{vi.unstubAllGlobals();delete process.env.APOLLO_APPROVE_WRITES});
describe('Apollo connector',()=>{
 it('registers useful scoped tools',()=>{expect(tools.length).toBeGreaterThanOrEqual(8);expect(tools.every(t=>t.name.startsWith('apollo.'))).toBe(true)});
 it('validates search input',()=>{expect(()=>tools[0].schema.parse({query:''})).toThrow()});
 it('denies unapproved writes',async()=>{await expect(new ApolloClient('x').call(tools.find(t=>t.name==='apollo.contact.create')!,{firstName:'A'})).rejects.toMatchObject({status:403})});
 it('requires explicit approval for outreach',async()=>{await expect(new ApolloClient('x').call(tools.find(t=>t.name==='apollo.sequence.enroll')!,{sequenceId:'s',contactIds:['c'],emailAccountId:'e'})).rejects.toBeTruthy()});
 it('maps provider errors',async()=>{process.env.APOLLO_APPROVE_WRITES='true';vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({message:'Unauthorized'}),{status:401,headers:{'content-type':'application/json'}})));await expect(new ApolloClient('bad').call(tools[0],{query:'dev'})).rejects.toBeInstanceOf(ApolloError)});
 it('returns read data',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({people:[{id:'1'}]}),{status:200})));const r=await new ApolloClient('x').call(tools[0],{query:'dev'});expect((r.data as any).people[0].id).toBe('1')});
 it('retries throttling boundedly',async()=>{const f=vi.fn().mockResolvedValueOnce(new Response('{}',{status:429,headers:{'retry-after':'0'}})).mockResolvedValue(new Response('{}',{status:200}));vi.stubGlobal('fetch',f);await new ApolloClient('x',undefined,1000,1).call(tools[0],{query:'dev'});expect(f).toHaveBeenCalledTimes(2)});
});
