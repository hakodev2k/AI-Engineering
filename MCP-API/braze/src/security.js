export const Risk=Object.freeze({READ:'READ',WRITE:'WRITE',HIGH_RISK:'HIGH_RISK',DESTRUCTIVE:'DESTRUCTIVE'});
export function requireApproval(risk,approved){if(risk!==Risk.READ&&!approved)throw Object.assign(new Error('Explicit human approval required'),{code:'APPROVAL_REQUIRED'});}
export function cleanId(v,name='id'){if(typeof v!=='string'||!/^[A-Za-z0-9_-]{1,256}$/.test(v))throw new Error(`Invalid ${name}`);return v;}
export function boundedLimit(v=100,max=100){const n=Number(v);if(!Number.isInteger(n)||n<1||n>max)throw new Error(`limit must be 1..${max}`);return n;}
export function safeObject(v,name='object'){if(!v||typeof v!=='object'||Array.isArray(v))throw new Error(`${name} must be an object`);return v;}
