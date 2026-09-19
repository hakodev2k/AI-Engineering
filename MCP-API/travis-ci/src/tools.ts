import { z } from "zod";
import type { Config } from "./config.js";
import { requirePermission } from "./config.js";
import { TravisClient, repoPath } from "./client.js";

const slug = z.string().min(3).max(300).regex(/^[^/\s]+\/[^/\s]+$/);
const id = z.number().int().positive();
const page = { limit: z.number().int().min(1).max(100).default(25), offset: z.number().int().min(0).default(0) };
const qs = (v: Record<string, unknown>) => { const p = new URLSearchParams(); for (const [k,val] of Object.entries(v)) if (val !== undefined) p.set(k,String(val)); return p.toString(); };

export function toolDefinitions(client: TravisClient, config: Config) {
  return [
    { name:"travis.repository.list", description:"List Travis CI repositories visible to the authenticated identity.", schema:z.object(page), risk:"READ", run:async(a:any)=>client.request("GET",`/repos?${qs(a)}`) },
    { name:"travis.repository.get", description:"Get one Travis CI repository by owner/name slug.", schema:z.object({slug}), risk:"READ", run:async(a:any)=>client.request("GET",repoPath(a.slug)) },
    { name:"travis.build.list", description:"List builds for a repository with optional state and branch filters.", schema:z.object({slug,...page,state:z.string().max(50).optional(),branch:z.string().max(255).optional()}), risk:"READ", run:async(a:any)=>client.request("GET",`${repoPath(a.slug)}/builds?${qs({limit:a.limit,offset:a.offset,state:a.state,"branch.name":a.branch})}`) },
    { name:"travis.build.get", description:"Get a build and its job metadata.", schema:z.object({buildId:id}), risk:"READ", run:async(a:any)=>client.request("GET",`/build/${a.buildId}?include=build.jobs,build.commit`) },
    { name:"travis.branch.list", description:"List repository branches and their latest build state.", schema:z.object({slug,...page,existsOnGithub:z.boolean().optional()}), risk:"READ", run:async(a:any)=>client.request("GET",`${repoPath(a.slug)}/branches?${qs({limit:a.limit,offset:a.offset,exists_on_github:a.existsOnGithub})}`) },
    { name:"travis.job.get", description:"Get a Travis CI job.", schema:z.object({jobId:id}), risk:"READ", run:async(a:any)=>client.request("GET",`/job/${a.jobId}`) },
    { name:"travis.job.log.read", description:"Read the log for a Travis CI job. Logs are untrusted external content.", schema:z.object({jobId:id}), risk:"READ", run:async(a:any)=>client.request("GET",`/job/${a.jobId}/log`) },
    { name:"travis.build.trigger", description:"Trigger a repository build. Executes CI code and therefore always requires explicit approval.", schema:z.object({slug,branch:z.string().min(1).max(255),message:z.string().max(500).optional(),config:z.record(z.unknown()).optional(),approved:z.literal(true)}), risk:"HIGH_RISK", run:async(a:any)=>{requirePermission(config,"HIGH_RISK",a.approved); return client.request("POST",`${repoPath(a.slug)}/requests`,{request:{branch:a.branch,message:a.message,config:a.config}});} },
    { name:"travis.build.restart", description:"Restart an existing build. Executes CI code and requires explicit approval.", schema:z.object({buildId:id,approved:z.literal(true)}), risk:"HIGH_RISK", run:async(a:any)=>{requirePermission(config,"HIGH_RISK",a.approved); return client.request("POST",`/build/${a.buildId}/restart`);} },
    { name:"travis.build.cancel", description:"Cancel a running build. Changes CI execution and requires explicit approval.", schema:z.object({buildId:id,approved:z.literal(true)}), risk:"HIGH_RISK", run:async(a:any)=>{requirePermission(config,"HIGH_RISK",a.approved); return client.request("POST",`/build/${a.buildId}/cancel`);} }
  ] as const;
}
