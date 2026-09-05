export type Risk="READ"|"WRITE"|"HIGH_RISK"|"DESTRUCTIVE";
export function fingerprint(tool:string,a:Record<string,unknown>){
 if(tool==="docusign.envelope.send"||tool==="docusign.envelope.void")return `${tool}:${String(a.envelopeId??"")}`;
 if(tool.includes("create")&&tool.startsWith("docusign.envelope."))return `${tool}:${String(a.emailSubject??"")}`;
 return tool;
}
export function assertAllowed(risk:Risk,tool:string,a:Record<string,unknown>,c:{requireWriteApproval:boolean;allowDestructive:boolean;approvedActions:Set<string>}){
 if(risk==="READ")return;
 const fp=fingerprint(tool,a);
 if(risk==="DESTRUCTIVE"&&!c.allowDestructive)throw new Error("Destructive Docusign operations are disabled.");
 if(risk==="HIGH_RISK"||risk==="DESTRUCTIVE"||c.requireWriteApproval)if(!c.approvedActions.has(fp))throw new Error(`Human approval required: add exact fingerprint to DOCUSIGN_APPROVED_ACTIONS: ${fp}`);
}
