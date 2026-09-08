import { describe,expect,it } from 'vitest';
import { createServerInput,deleteServerInput,listInput,powerInput } from '../src/schemas.js';

describe('schemas',()=>{
  it('bounds pagination',()=>{expect(()=>listInput.parse({page:1,per_page:51})).toThrow();expect(listInput.parse({})).toEqual({page:1,per_page:50});});
  it('requires explicit approval for server creation',()=>{expect(()=>createServerInput.parse({name:'agent-1',server_type:'cx22',image:'ubuntu-24.04'})).toThrow();});
  it('rejects ambiguous placement',()=>{expect(()=>createServerInput.parse({name:'agent-1',server_type:'cx22',image:'ubuntu-24.04',location:'fsn1',datacenter:'fsn1-dc14',approval:true})).toThrow();});
  it('restricts power actions',()=>{expect(()=>powerInput.parse({server_id:1,action:'reset',approval:true})).toThrow();});
  it('requires exact destructive confirmation',()=>{expect(deleteServerInput.parse({server_id:42,approval:true,confirm:'DELETE SERVER 42'}).server_id).toBe(42);expect(()=>deleteServerInput.parse({server_id:42,approval:true,confirm:'DELETE SERVER 41'})).toThrow();});
});
