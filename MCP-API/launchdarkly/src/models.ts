export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class LaunchDarklyError extends Error{constructor(message:string,public status?:number,public retryAfterMs?:number){super(message)}}
export type Page<T=unknown>={items:T[];totalCount?:number;links?:unknown};
