import { z } from "zod";
const Env=z.object({
 COCKROACHDB_CLOUD_API_KEY:z.string().min(1),
 COCKROACHDB_CLUSTER_ID:z.string().min(1).max(200),
 COCKROACHDB_READ_ONLY:z.enum(["true","false"]).default("true"),
 COCKROACHDB_ALLOW_WRITE:z.enum(["true","false"]).default("false"),
 COCKROACHDB_APPROVAL_MODE:z.enum(["required","disabled"]).default("required"),
 COCKROACHDB_TOOL_TIMEOUT_MS:z.coerce.number().int().min(1000).max(120000).default(30000)
});
export type Config={apiKey:string;clusterId:string;readOnly:boolean;allowWrite:boolean;approvalMode:"required"|"disabled";timeoutMs:number};
export function loadConfig(env:NodeJS.ProcessEnv=process.env):Config{const x=Env.parse(env);return{apiKey:x.COCKROACHDB_CLOUD_API_KEY,clusterId:x.COCKROACHDB_CLUSTER_ID,readOnly:x.COCKROACHDB_READ_ONLY==="true",allowWrite:x.COCKROACHDB_ALLOW_WRITE==="true",approvalMode:x.COCKROACHDB_APPROVAL_MODE,timeoutMs:x.COCKROACHDB_TOOL_TIMEOUT_MS}}
