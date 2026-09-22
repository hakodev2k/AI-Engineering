export type Config={url:string;headers:Record<string,string>;timeoutMs:number};
export function loadConfig(env:NodeJS.ProcessEnv=process.env):Config{
 const raw=env.OPENSEARCH_URL?.trim(); if(!raw) throw new Error('OPENSEARCH_URL is required');
 const url=new URL(raw); if(!['http:','https:'].includes(url.protocol)) throw new Error('OPENSEARCH_URL must use http or https');
 const headers:Record<string,string>={};
 if(env.OPENSEARCH_BEARER_TOKEN) headers.Authorization=`Bearer ${env.OPENSEARCH_BEARER_TOKEN}`;
 else if(env.OPENSEARCH_USERNAME||env.OPENSEARCH_PASSWORD){if(!env.OPENSEARCH_USERNAME||!env.OPENSEARCH_PASSWORD) throw new Error('Both OPENSEARCH_USERNAME and OPENSEARCH_PASSWORD are required for Basic auth'); headers.Authorization=`Basic ${Buffer.from(`${env.OPENSEARCH_USERNAME}:${env.OPENSEARCH_PASSWORD}`).toString('base64')}`;}
 const timeoutMs=Number(env.OPENSEARCH_TIMEOUT_MS??30000); if(!Number.isFinite(timeoutMs)||timeoutMs<1000||timeoutMs>120000) throw new Error('OPENSEARCH_TIMEOUT_MS must be between 1000 and 120000');
 return {url:url.toString().replace(/\/$/,''),headers,timeoutMs};
}
