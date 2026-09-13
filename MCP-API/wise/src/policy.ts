import type {Config} from "./config.js";
export type Risk="READ"|"WRITE"|"HIGH_RISK"|"DESTRUCTIVE";
export function requireApproval(risk:Risk,approval:string|undefined,c:Config){if(risk==="READ")return;if(risk==="WRITE"&&!c.requireWriteApproval)return;if(risk==="DESTRUCTIVE"&&!c.allowDestructive)throw new Error("Destructive tools are disabled by configuration");const expected=risk==="HIGH_RISK"||risk==="DESTRUCTIVE"?"approved-high-risk":"approved";if(approval!==expected)throw new Error(`${risk} operation requires explicit approval token: ${expected}`)}
