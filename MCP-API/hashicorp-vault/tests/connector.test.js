import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig,approvalDigest } from "../src/config.js";
import { POLICY,authorize } from "../src/policy.js";
import { TOOLS } from "../src/tools.js";
import { TokenProvider,VaultRestClient } from "../src/vault-core.js";

test("tool registry and policy sync",()=>{const names=TOOLS.map(t=>t.name).sort();assert.equal(names.length,17);assert.deepEqual(names,Object.keys(POLICY).sort());});
test("config requires https and one auth mode",()=>{assert.throws(()=>loadConfig({VAULT_ADDR:"http://x",VAULT_TOKEN:"t"}),/HTTPS/);assert.throws(()=>loadConfig({VAULT_ADDR:"https://x"}),/Configure VAULT_TOKEN/);assert.throws(()=>loadConfig({VAULT_ADDR:"https://x",VAULT_TOKEN:"t",VAULT_APPROLE_ROLE_ID:"r",VAULT_APPROLE_SECRET_ID:"s"}),/only one/);});
test("payload-bound approval and destructive gate",()=>{const c={approvalSecret:"approve",destructiveEnabled:false},p={mount:"secret",path:"app",key:"X",value:"Y"},tok=approvalDigest(c.approvalSecret,"vault.secret.write",p);assert.doesNotThrow(()=>authorize(c,"vault.secret.write",p,tok));assert.throws(()=>authorize(c,"vault.secret.write",{...p,path:"other"},tok),/Invalid approval/);assert.throws(()=>authorize(c,"vault.secret.delete",{mount:"secret",path:"app"},"0".repeat(64)),/disabled/);});
test("static token does not call login",async()=>{const p=new TokenProvider({staticToken:"abc"},async()=>{throw new Error("unexpected")});assert.equal(await p.getToken(),"abc");});
test("AppRole login caches token",async()=>{let calls=0;const fetch=async(_u,i)=>{calls++;const b=JSON.parse(i.body);assert.equal(b.role_id,"r");return new Response(JSON.stringify({auth:{client_token:"vt",lease_duration:300}}),{status:200});};const p=new TokenProvider({staticToken:"",roleId:"r",secretId:"s",approleMount:"approle",vaultAddr:"https://x",namespace:"",timeoutMs:1000},fetch);assert.equal(await p.getToken(),"vt");assert.equal(await p.getToken(),"vt");assert.equal(calls,1);});
test("REST capabilities uses token/namespace and no retry on 403",async()=>{let calls=0;const fetch=async(_u,i)=>{calls++;assert.equal(i.headers["X-Vault-Token"],"t");assert.equal(i.headers["X-Vault-Namespace"],"admin");return new Response(JSON.stringify({errors:["permission denied"]}),{status:403});};const c=new VaultRestClient({vaultAddr:"https://x",namespace:"admin",timeoutMs:1000,maxRetries:3},{getToken:async()=>"t"},fetch);await assert.rejects(c.capabilities(["secret/data/a"]),/permission denied/);assert.equal(calls,1);});
