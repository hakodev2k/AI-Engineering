import { z } from 'zod';
import { authorize, type Risk } from './auth.js';
import { DenoDeployClient } from './client.js';

export interface ToolDef { name:string; description:string; risk:Risk; schema:Record<string,z.ZodTypeAny>; execute:(c:DenoDeployClient,a:any)=>Promise<unknown> }
const id = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
const slug = z.string().min(1).max(63).regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/);
const approved = z.boolean().optional();

export const tools: ToolDef[] = [
 {name:'deno-deploy.app.list',description:'List Deploy apps in the token-scoped organization.',risk:'READ',schema:{},execute:async c=>c.run(async()=>{const p=await c.sdk.apps.list();return p.items;})},
 {name:'deno-deploy.app.get',description:'Get one Deploy app by slug or UUID.',risk:'READ',schema:{app:id},execute:async(c,a)=>c.run(()=>c.sdk.apps.get(a.app))},
 {name:'deno-deploy.app.create',description:'Create a Deploy app.',risk:'WRITE',schema:{slug:slug.optional(),approved},execute:async(c,a)=>{authorize('WRITE',a);return c.run(()=>c.sdk.apps.create(a.slug?{slug:a.slug}:{}),false)}},
 {name:'deno-deploy.app.update',description:'Rename a Deploy app; existing default URLs may stop working.',risk:'HIGH_RISK',schema:{app:id,slug,approved},execute:async(c,a)=>{authorize('HIGH_RISK',a);return c.run(()=>c.sdk.apps.update(a.app,{slug:a.slug}),false)}},
 {name:'deno-deploy.app.delete',description:'Delete an app and its revisions/routes.',risk:'DESTRUCTIVE',schema:{app:id,approved},execute:async(c,a)=>{authorize('DESTRUCTIVE',a);return c.run(()=>c.sdk.apps.delete(a.app),false)}},
 {name:'deno-deploy.volume.list',description:'List/search persistent volumes.',risk:'READ',schema:{search:z.string().max(100).optional()},execute:async(c,a)=>c.run(async()=>{const p=await c.sdk.volumes.list(a.search?{search:a.search}:{});return p.items;})},
 {name:'deno-deploy.volume.get',description:'Get a volume by slug or UUID.',risk:'READ',schema:{volume:id},execute:async(c,a)=>c.run(()=>c.sdk.volumes.get(a.volume))},
 {name:'deno-deploy.volume.create',description:'Create persistent block storage in ord.',risk:'WRITE',schema:{slug,capacity:z.string().regex(/^\d+(?:KB|MB|GB|KiB|MiB|GiB)$/),from:id.optional(),approved},execute:async(c,a)=>{authorize('WRITE',a);return c.run(()=>c.sdk.volumes.create({slug:a.slug,region:'ord',capacity:a.capacity,...(a.from?{from:a.from}:{})}),false)}},
 {name:'deno-deploy.volume.delete',description:'Delete a volume; data becomes unavailable immediately and storage removal follows the provider grace process.',risk:'DESTRUCTIVE',schema:{volume:id,approved},execute:async(c,a)=>{authorize('DESTRUCTIVE',a);return c.run(()=>c.sdk.volumes.delete(a.volume),false)}},
 {name:'deno-deploy.volume.snapshot',description:'Create a read-only snapshot from a volume.',risk:'WRITE',schema:{volume:id,slug,approved},execute:async(c,a)=>{authorize('WRITE',a);return c.run(()=>c.sdk.volumes.snapshot(a.volume,{slug:a.slug}),false)}},
 {name:'deno-deploy.snapshot.list',description:'List snapshots.',risk:'READ',schema:{},execute:async c=>c.run(async()=>{const p=await c.sdk.snapshots.list();return p.items;})},
 {name:'deno-deploy.snapshot.delete',description:'Delete a snapshot.',risk:'DESTRUCTIVE',schema:{snapshot:id,approved},execute:async(c,a)=>{authorize('DESTRUCTIVE',a);return c.run(()=>c.sdk.snapshots.delete(a.snapshot),false)}}
];
