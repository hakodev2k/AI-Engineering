export type Risk='READ'|'WRITE'|'DESTRUCTIVE';
export function authorize(risk:Risk, approved=false, env=process.env){
 if(risk==='READ') return;
 if(risk==='WRITE' && env.ALGOLIA_ALLOW_WRITE==='true' && approved) return;
 if(risk==='DESTRUCTIVE' && env.ALGOLIA_ALLOW_DESTRUCTIVE==='true' && approved) return;
 throw new Error(`Permission denied: ${risk} requires explicit approval and enabled policy`);
}
export function safeIndex(v:string){if(!/^[A-Za-z0-9_-]{1,128}$/.test(v)) throw new Error('Invalid index name'); return v;}
export function safeObjectId(v:string){if(!v||v.length>256||/[\r\n]/.test(v)) throw new Error('Invalid objectID'); return v;}
