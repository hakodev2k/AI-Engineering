import test from 'node:test';
import assert from 'node:assert/strict';
import { CodaApiError, CodaClient } from '../src/client.js';
const config={apiToken:'sekret',apiBaseUrl:'https://coda.io/apis/v1',timeoutMs:50,maxRetries:1};

test('adds bearer auth and pagination without leaking credentials', async () => {
  let seen;
  const client=new CodaClient(config,async (url,init)=>{seen={url:String(url),init}; return new Response(JSON.stringify({items:[],nextPageToken:'n'}),{status:200,headers:{'content-type':'application/json'}});});
  const out=await client.request('GET','/docs',{query:{limit:10,pageToken:'p'}});
  assert.match(seen.url,/limit=10/); assert.match(seen.url,/pageToken=p/);
  assert.equal(seen.init.headers.Authorization,'Bearer sekret');
  assert.equal(out.meta.source,'untrusted_provider_data');
  assert.equal(JSON.stringify(out).includes('sekret'),false);
});

test('retries read throttling but does not retry writes', async () => {
  let calls=0;
  const client=new CodaClient(config,async ()=>{calls++; if(calls===1)return new Response('{"message":"slow"}',{status:429,headers:{'retry-after':'0'}}); return new Response('{}',{status:200});});
  await client.request('GET','/whoami'); assert.equal(calls,2);
  calls=0;
  const writer=new CodaClient(config,async ()=>{calls++; return new Response('{"message":"slow"}',{status:429});});
  await assert.rejects(()=>writer.request('POST','/docs',{body:{title:'x'}}),CodaApiError); assert.equal(calls,1);
});

test('maps timeout safely', async () => {
  const client=new CodaClient({...config,maxRetries:0,timeoutMs:10},async (_u,init)=>new Promise((_resolve,reject)=>init.signal.addEventListener('abort',()=>reject(Object.assign(new Error('aborted'),{name:'AbortError'})))));
  await assert.rejects(()=>client.request('GET','/whoami'),/timed out/);
});
