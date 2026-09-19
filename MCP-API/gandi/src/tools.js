import {z} from 'zod'; import {Risk,authorize} from './policy.js';
const domain=z.string().min(1).max(253).regex(/^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[A-Za-z]{2,63}$/);
const name=z.string().min(1).max(253).regex(/^(@|\*|[A-Za-z0-9_.-]+)$/); const type=z.enum(['A','AAAA','ALIAS','CAA','CDS','CNAME','DNAME','DS','HTTPS','KEY','LOC','MX','NAPTR','NS','OPENPGPKEY','PTR','RP','SOA','SPF','SRV','SSHFP','SVCB','TLSA','TXT','WKS']);
const page={page:z.number().int().min(1).default(1),per_page:z.number().int().min(1).max(100).default(50)};
const specs=[
 ['gandi.domain.list',Risk.READ,z.object({...page,fqdn:z.string().max(253).optional()}),a=>['GET','/domain/domains',{query:a}]],
 ['gandi.domain.get',Risk.READ,z.object({domain}),a=>['GET',`/domain/domains/${encodeURIComponent(a.domain)}`]],
 ['gandi.domain.livedns_status',Risk.READ,z.object({domain}),a=>['GET',`/domain/domains/${encodeURIComponent(a.domain)}/livedns`]],
 ['gandi.domain.dnssec_status',Risk.READ,z.object({domain}),a=>['GET',`/domain/domains/${encodeURIComponent(a.domain)}/livedns/dnssec`]],
 ['gandi.dns.record.list',Risk.READ,z.object({domain,...page}),a=>['GET',`/livedns/domains/${encodeURIComponent(a.domain)}/records`,{query:{page:a.page,per_page:a.per_page}}]],
 ['gandi.dns.record.get',Risk.READ,z.object({domain,name,type}),a=>['GET',`/livedns/domains/${encodeURIComponent(a.domain)}/records/${encodeURIComponent(a.name)}/${a.type}`]],
 ['gandi.dns.record.create',Risk.WRITE,z.object({domain,name,type,ttl:z.number().int().min(300).max(2592000),values:z.array(z.string().min(1).max(4096)).min(1).max(100),approved:z.literal(true)}),a=>['POST',`/livedns/domains/${encodeURIComponent(a.domain)}/records`,{body:{rrset_name:a.name,rrset_type:a.type,rrset_ttl:a.ttl,rrset_values:a.values}}]],
 ['gandi.dns.record.replace',Risk.WRITE,z.object({domain,name,type,ttl:z.number().int().min(300).max(2592000),values:z.array(z.string().min(1).max(4096)).min(1).max(100),approved:z.literal(true)}),a=>['PUT',`/livedns/domains/${encodeURIComponent(a.domain)}/records/${encodeURIComponent(a.name)}/${a.type}`,{body:{rrset_ttl:a.ttl,rrset_values:a.values}}]],
 ['gandi.dns.record.delete',Risk.DESTRUCTIVE,z.object({domain,name,type,approved:z.literal(true)}),a=>['DELETE',`/livedns/domains/${encodeURIComponent(a.domain)}/records/${encodeURIComponent(a.name)}/${a.type}`,{retry:false}]],
 ['gandi.dns.snapshot.list',Risk.READ,z.object({domain,...page}),a=>['GET',`/livedns/domains/${encodeURIComponent(a.domain)}/snapshots`,{query:{page:a.page,per_page:a.per_page,sort_by:'-date_created'}}]],
 ['gandi.dns.snapshot.get',Risk.READ,z.object({domain,id:z.string().uuid()}),a=>['GET',`/livedns/domains/${encodeURIComponent(a.domain)}/snapshots/${a.id}`]],
];
export function toolSpecs(){return specs}
export async function execute(spec,raw,client,config){const a=spec[2].parse(raw);authorize(config,spec[1],a.approved===true);const [m,p,o]=spec[3](a);return client.request(m,p,o)}
