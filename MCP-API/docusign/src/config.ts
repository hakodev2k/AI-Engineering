import { z } from "zod";
const E=z.object({
 DOCUSIGN_ACCESS_TOKEN:z.string().min(1),DOCUSIGN_ACCOUNT_ID:z.string().min(1),DOCUSIGN_BASE_URL:z.string().url(),
 DOCUSIGN_OAUTH_BASE_URL:z.string().url().default("https://account-d.docusign.com"),
 DOCUSIGN_TIMEOUT_MS:z.coerce.number().int().min(1000).max(120000).default(15000),
 DOCUSIGN_MAX_RETRIES:z.coerce.number().int().min(0).max(5).default(2),
 DOCUSIGN_REQUIRE_WRITE_APPROVAL:z.enum(["true","false"]).default("true"),
 DOCUSIGN_ALLOW_DESTRUCTIVE:z.enum(["true","false"]).default("false"),
 DOCUSIGN_APPROVED_ACTIONS:z.string().default("")
});
function official(v:string,kind:"api"|"oauth"){const u=new URL(v);if(u.protocol!=="https:")throw new Error("Docusign URL must use HTTPS");
 const ok=kind==="api"?(u.hostname==="docusign.net"||u.hostname.endsWith(".docusign.net")):(u.hostname==="docusign.com"||u.hostname.endsWith(".docusign.com"));
 if(!ok)throw new Error("URL must use an official Docusign host");return u.toString().replace(/\/$/,"");}
export function loadConfig(env:NodeJS.ProcessEnv=process.env){const v=E.parse(env);return{
 accessToken:v.DOCUSIGN_ACCESS_TOKEN,accountId:v.DOCUSIGN_ACCOUNT_ID,baseUrl:official(v.DOCUSIGN_BASE_URL,"api"),
 oauthBaseUrl:official(v.DOCUSIGN_OAUTH_BASE_URL,"oauth"),timeoutMs:v.DOCUSIGN_TIMEOUT_MS,maxRetries:v.DOCUSIGN_MAX_RETRIES,
 requireWriteApproval:v.DOCUSIGN_REQUIRE_WRITE_APPROVAL==="true",allowDestructive:v.DOCUSIGN_ALLOW_DESTRUCTIVE==="true",
 approvedActions:new Set(v.DOCUSIGN_APPROVED_ACTIONS.split(";").map(x=>x.trim()).filter(Boolean))
};}
export type Config=ReturnType<typeof loadConfig>;
