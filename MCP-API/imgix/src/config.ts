import { z } from "zod";
const bool=(v:string|undefined,d=false)=>v===undefined?d:v==="true";
export type Config={apiKey:string;allowWrite:boolean;allowHighRisk:boolean;approvalSecret?:string;timeoutMs:number;maxReadRetries:number};
export function loadConfig(env=process.env):Config{
 const apiKey=z.string().min(8).parse(env.IMGIX_API_KEY);
 const timeoutMs=z.coerce.number().int().min(1000).max(120000).parse(env.IMGIX_TIMEOUT_MS??"15000");
 const maxReadRetries=z.coerce.number().int().min(0).max(5).parse(env.IMGIX_MAX_READ_RETRIES??"2");
 return {apiKey,allowWrite:bool(env.IMGIX_ALLOW_WRITE),allowHighRisk:bool(env.IMGIX_ALLOW_HIGH_RISK),approvalSecret:env.IMGIX_APPROVAL_SECRET,timeoutMs,maxReadRetries};
}