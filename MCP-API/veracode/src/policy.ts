export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export function requireApproval(risk:Risk,a:{approved?:boolean}){if(risk!=='READ'&&process.env.VERACODE_WRITE_APPROVAL_REQUIRED!=='false'&&!a.approved)throw new Error(`APPROVAL_REQUIRED:${risk}`)}
