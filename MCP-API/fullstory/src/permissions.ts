export type Risk="READ"|"WRITE"|"HIGH_RISK"|"DESTRUCTIVE";
export class ApprovalRequiredError extends Error{constructor(tool:string){super(`Explicit human approval required for ${tool}`);this.name="ApprovalRequiredError"}}
export function assertWriteAllowed(tool:string,allowWrites:boolean,requireApproval:boolean,approved:boolean){if(!allowWrites)throw new Error(`Write tools are disabled for ${tool}`);if(requireApproval&&!approved)throw new ApprovalRequiredError(tool)}
