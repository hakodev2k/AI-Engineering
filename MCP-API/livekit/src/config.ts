import { z } from "zod";
const ConfigSchema = z.object({
  url: z.string().url().refine(v => v.startsWith("https://") || v.startsWith("http://localhost"), "LIVEKIT_URL must be HTTPS (localhost allowed for development)"),
  apiKey: z.string().min(1), apiSecret: z.string().min(1), timeoutMs: z.number().int().min(1000).max(120000),
  approvalSecret: z.string().min(16).optional(), requireWriteApproval: z.boolean(), enableDestructive: z.boolean()
});
const envBool=(n:string,d:boolean)=>process.env[n]==null?d:/^(1|true|yes|on)$/i.test(process.env[n]!);
export type Config=z.infer<typeof ConfigSchema>;
export function loadConfig():Config{return ConfigSchema.parse({url:process.env.LIVEKIT_URL,apiKey:process.env.LIVEKIT_API_KEY,apiSecret:process.env.LIVEKIT_API_SECRET,timeoutMs:Number(process.env.LIVEKIT_TIMEOUT_MS||30000),approvalSecret:process.env.LIVEKIT_APPROVAL_SECRET||undefined,requireWriteApproval:envBool("LIVEKIT_REQUIRE_WRITE_APPROVAL",true),enableDestructive:envBool("LIVEKIT_ENABLE_DESTRUCTIVE",false)});}
