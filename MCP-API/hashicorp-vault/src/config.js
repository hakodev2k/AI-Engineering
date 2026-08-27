import crypto from "node:crypto";

function intEnv(env, name, fallback, min, max) {
  const raw = env[name];
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}
function boolEnv(env, name, fallback=false) {
  const raw=env[name]; if(raw===undefined||raw==="") return fallback;
  if(raw==="true") return true; if(raw==="false") return false;
  throw new Error(`${name} must be true or false`);
}
export function loadConfig(env=process.env) {
  if(!env.VAULT_ADDR) throw new Error("VAULT_ADDR is required");
  const u=new URL(env.VAULT_ADDR);
  if(u.protocol!=="https:") throw new Error("VAULT_ADDR must use HTTPS");
  if(u.username||u.password||u.search||u.hash||(u.pathname!=="/"&&u.pathname!=="")) throw new Error("VAULT_ADDR must be an HTTPS origin without credentials/path/query/fragment");
  const token=env.VAULT_TOKEN||"", roleId=env.VAULT_APPROLE_ROLE_ID||"", secretId=env.VAULT_APPROLE_SECRET_ID||"";
  if(!token && !(roleId&&secretId)) throw new Error("Configure VAULT_TOKEN or AppRole credentials");
  if(token && (roleId||secretId)) throw new Error("Configure only one Vault auth mode");
  const approleMount=env.VAULT_APPROLE_MOUNT||"approle";
  if(!/^[A-Za-z0-9._-]+$/.test(approleMount)) throw new Error("VAULT_APPROLE_MOUNT is invalid");
  return Object.freeze({vaultAddr:u.origin,namespace:env.VAULT_NAMESPACE||"",staticToken:token,roleId,secretId,approleMount,mcpCommand:env.VAULT_MCP_COMMAND||"vault-mcp-server",mcpArgs:(env.VAULT_MCP_ARGS||"stdio").trim().split(/\s+/).filter(Boolean),timeoutMs:intEnv(env,"VAULT_TIMEOUT_MS",10000,1000,120000),maxRetries:intEnv(env,"VAULT_MAX_RETRIES",3,0,5),approvalSecret:env.VAULT_APPROVAL_SECRET||"",destructiveEnabled:boolEnv(env,"VAULT_ENABLE_DESTRUCTIVE",false)});
}
export function approvalDigest(secret,tool,payload){return crypto.createHmac("sha256",secret).update(`${tool}\n${stable(payload)}`).digest("hex");}
function stable(v){if(v===null||typeof v!=="object")return JSON.stringify(v);if(Array.isArray(v))return `[${v.map(stable).join(",")}]`;return `{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}`;}
