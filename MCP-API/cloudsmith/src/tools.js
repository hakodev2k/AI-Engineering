const slug = { type:"string", minLength:1, maxLength:200, pattern:"^[-A-Za-z0-9_]+$" };
const ident = { type:"string", minLength:1, maxLength:500 };
const approval = { type:"string", minLength:64, maxLength:64, pattern:"^[a-f0-9]{64}$" };
const page = { type:"integer", minimum:1, maximum:1000000 };
const pageSize = { type:"integer", minimum:1, maximum:100, default:20 };
const pkgScope = { owner:slug, repo:slug, identifier:ident };

export const TOOL_DEFINITIONS = [
 {name:"cloudsmith.namespace.list",description:"List Cloudsmith namespaces available to the credential. Risk: READ.",inputSchema:{type:"object",additionalProperties:false,properties:{page,pageSize}}},
 {name:"cloudsmith.repository.list",description:"List repositories in a namespace. Risk: READ.",inputSchema:{type:"object",additionalProperties:false,required:["owner"],properties:{owner:slug,page,pageSize,query:{type:"string",maxLength:500},sort:{type:"string",maxLength:100}}}},
 {name:"cloudsmith.package.list",description:"Search/list packages in a repository. Risk: READ.",inputSchema:{type:"object",additionalProperties:false,required:["owner","repo"],properties:{owner:slug,repo:slug,page,pageSize,query:{type:"string",maxLength:1000},sort:{type:"string",maxLength:100},includeConnectedRepositories:{type:"boolean",default:false}}}},
 {name:"cloudsmith.package.get",description:"Get one package and security/status metadata. Risk: READ.",inputSchema:{type:"object",additionalProperties:false,required:["owner","repo","identifier"],properties:{...pkgScope,includeConnectedRepositories:{type:"boolean",default:false}}}},
 {name:"cloudsmith.package.dependencies",description:"Get stored dependencies; transitive dependencies are included where supported. Risk: READ.",inputSchema:{type:"object",additionalProperties:false,required:["owner","repo","identifier"],properties:{...pkgScope,includeConnectedRepositories:{type:"boolean",default:false}}}},
 {name:"cloudsmith.package.vulnerabilities",description:"List vulnerability scan results for a package. Risk: READ.",inputSchema:{type:"object",additionalProperties:false,required:["owner","repo","identifier"],properties:{...pkgScope,page,pageSize}}},
 {name:"cloudsmith.package.metrics",description:"Get package usage metrics for a repository. Risk: READ.",inputSchema:{type:"object",additionalProperties:false,required:["owner","repo"],properties:{owner:slug,repo:slug,page,pageSize,start:{type:"string",format:"date-time"},finish:{type:"string",format:"date-time"},packages:{type:"array",maxItems:100,items:ident}}}},
 {name:"cloudsmith.package.copy",description:"Copy a package to another repository in the same workspace. Risk: WRITE. Explicit approval required.",inputSchema:{type:"object",additionalProperties:false,required:["owner","repo","identifier","destination","approval_token"],properties:{...pkgScope,destination:slug,republish:{type:"boolean",default:false},approval_token:approval}}},
 {name:"cloudsmith.package.move",description:"Move a package to another repository. Risk: HIGH_RISK. Explicit approval required.",inputSchema:{type:"object",additionalProperties:false,required:["owner","repo","identifier","destination","approval_token"],properties:{...pkgScope,destination:slug,approval_token:approval}}},
 {name:"cloudsmith.package.quarantine",description:"Quarantine a package and block downloads. Risk: HIGH_RISK. Explicit approval required.",inputSchema:{type:"object",additionalProperties:false,required:["owner","repo","identifier","approval_token"],properties:{...pkgScope,approval_token:approval}}},
 {name:"cloudsmith.package.release",description:"Release a package from quarantine and restore downloads. Risk: HIGH_RISK. Explicit approval required.",inputSchema:{type:"object",additionalProperties:false,required:["owner","repo","identifier","approval_token"],properties:{...pkgScope,approval_token:approval}}},
 {name:"cloudsmith.package.delete",description:"Permanently delete a package. Risk: DESTRUCTIVE. Disabled by default and explicit approval required.",inputSchema:{type:"object",additionalProperties:false,required:["owner","repo","identifier","approval_token"],properties:{...pkgScope,approval_token:approval}}}
];

export function stripApproval(args={}) { const { approval_token:_token, ...payload } = args; return payload; }
