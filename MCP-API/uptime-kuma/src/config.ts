import { z } from 'zod';

const schema=z.object({
  url:z.string().url(), username:z.string().optional(), password:z.string().optional(), token:z.string().optional(),
  timeoutMs:z.number().int().min(1000).max(60000), allowWrite:z.boolean(), allowDestructive:z.boolean()
}).superRefine((v,ctx)=>{if(!v.token && !(v.username&&v.password)) ctx.addIssue({code:'custom',message:'Set UPTIME_KUMA_TOKEN or username/password'});});
export type Config=z.infer<typeof schema>;
export function loadConfig(env=process.env):Config{return schema.parse({url:env.UPTIME_KUMA_URL,username:env.UPTIME_KUMA_USERNAME,password:env.UPTIME_KUMA_PASSWORD,token:env.UPTIME_KUMA_TOKEN,timeoutMs:Number(env.UPTIME_KUMA_TIMEOUT_MS??15000),allowWrite:env.UPTIME_KUMA_ALLOW_WRITE==='true',allowDestructive:env.UPTIME_KUMA_ALLOW_DESTRUCTIVE==='true'});}
