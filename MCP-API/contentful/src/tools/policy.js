import crypto from "node:crypto";
import { approvalDigest } from "../auth/config.js";
import { CATALOG } from "./catalog.js";

export function authorize(config,tool,payload,approvalToken){
  const meta=CATALOG[tool];
  if(!meta) throw new Error(`Unknown tool: ${tool}`);
  if(meta.risk!=="READ"&&config.protectedEnvironments.includes(config.environmentId)) throw new Error(`Environment '${config.environmentId}' is protected from connector write operations`);
  if(meta.risk==="DESTRUCTIVE"&&!config.destructiveEnabled) throw new Error(`${tool} is disabled; set CONTENTFUL_ENABLE_DESTRUCTIVE=true to enable destructive operations`);
  if(meta.risk==="READ") return;
  if(!config.approvalSecret) throw new Error(`${tool} requires CONTENTFUL_APPROVAL_SECRET`);
  if(!approvalToken) throw new Error(`${tool} requires explicit approval_token`);
  const expected=approvalDigest(config.approvalSecret,tool,payload);
  const a=Buffer.from(approvalToken),b=Buffer.from(expected);
  if(a.length!==b.length||!crypto.timingSafeEqual(a,b)) throw new Error(`Invalid approval_token for ${tool}`);
}
