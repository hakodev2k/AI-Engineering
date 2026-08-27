import crypto from "node:crypto";
import path from "node:path";

function intEnv(env,name,fallback,min,max){
  const raw=env[name];
  if(raw===undefined||raw==="") return fallback;
  const v=Number(raw);
  if(!Number.isInteger(v)||v<min||v>max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return v;
}
function boolEnv(env,name,fallback=false){
  const raw=env[name];
  if(raw===undefined||raw==="") return fallback;
  if(raw==="true") return true;
  if(raw==="false") return false;
  throw new Error(`${name} must be true or false`);
}
export function loadConfig(env=process.env,cwd=process.cwd()){
  const token=env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN;
  const spaceId=env.CONTENTFUL_SPACE_ID;
  if(!token) throw new Error("CONTENTFUL_MANAGEMENT_ACCESS_TOKEN is required");
  if(!spaceId) throw new Error("CONTENTFUL_SPACE_ID is required");
  const environmentId=env.CONTENTFUL_ENVIRONMENT_ID||"master";
  const host=env.CONTENTFUL_HOST||"api.contentful.com";
  if(!/^[A-Za-z0-9.-]+$/.test(host)||host.includes("..")) throw new Error("CONTENTFUL_HOST must be a hostname only");
  if(!/^[A-Za-z0-9._-]{1,128}$/.test(spaceId)) throw new Error("CONTENTFUL_SPACE_ID is invalid");
  if(!/^[A-Za-z0-9._-]{1,128}$/.test(environmentId)) throw new Error("CONTENTFUL_ENVIRONMENT_ID is invalid");
  const protectedEnvironments=(env.CONTENTFUL_PROTECTED_ENVIRONMENTS??"master").split(",").map(v=>v.trim()).filter(Boolean);
  const upstreamCommand=path.join(cwd,"node_modules",".bin",process.platform==="win32"?"contentful-mcp-server.cmd":"contentful-mcp-server");
  return Object.freeze({
    token,spaceId,environmentId,host,protectedEnvironments,
    approvalSecret:env.CONTENTFUL_APPROVAL_SECRET||"",
    destructiveEnabled:boolEnv(env,"CONTENTFUL_ENABLE_DESTRUCTIVE",false),
    timeoutMs:intEnv(env,"CONTENTFUL_TIMEOUT_MS",15000,1000,120000),
    readRetries:intEnv(env,"CONTENTFUL_READ_RETRIES",2,0,4),
    upstreamCommand
  });
}
export function approvalDigest(secret,tool,payload){
  return crypto.createHmac("sha256",secret).update(`${tool}\n${stable(payload)}`).digest("hex");
}
function stable(value){
  if(value===null||typeof value!=="object") return JSON.stringify(value);
  if(Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map(k=>`${JSON.stringify(k)}:${stable(value[k])}`).join(",")}}`;
}
