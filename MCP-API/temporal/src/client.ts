import {Client,Connection} from '@temporalio/client';import {cfg} from './policy.js';
let cached:Client|undefined;
export async function temporal(){if(cached)return cached;const c=cfg();if(!Number.isFinite(c.timeout)||c.timeout<1000||c.timeout>120000)throw new Error('TEMPORAL_TIMEOUT_MS must be 1000..120000');const connection=await Connection.connect({address:c.address,tls:c.tls?true:undefined,apiKey:c.apiKey});cached=new Client({connection,namespace:c.namespace});return cached;}
export async function withTimeout<T>(p:Promise<T>){const ms=cfg().timeout;return Promise.race([p,new Promise<T>((_,r)=>setTimeout(()=>r(new Error(`Temporal operation timed out after ${ms}ms`)),ms))]);}
