import test from 'node:test';
import assert from 'node:assert/strict';

test('server registers against a scoped upstream client without connecting live',async()=>{
 process.env.NODE_ENV='test';
 const {createServer}=await import('../src/server.js');
 const fake={call:async()=>({content:[{type:'text',text:'ok'}]}),close:async()=>{}};
 const server=createServer(fake as any);
 assert.ok(server);
 await server.close();
});
