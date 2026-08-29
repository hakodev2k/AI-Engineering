const id={type:'string',minLength:1,maxLength:256,pattern:'^[A-Za-z0-9._/-]+$'}; const approval={type:'string',pattern:'^[a-f0-9]{64}$',minLength:64,maxLength:64};
const obj=(required,properties)=>({type:'object',additionalProperties:false,required,properties});
export const TOOLS=[
{name:'convex.project.list',description:'List projects for a team with cursor pagination. READ.',inputSchema:obj(['teamId'],{teamId:id,limit:{type:'integer',minimum:1,maximum:100},cursor:{type:'string',maxLength:2048}})},
{name:'convex.project.get',description:'Get a project by team ID/slug and project slug. READ.',inputSchema:obj(['team','projectSlug'],{team:id,projectSlug:id})},
{name:'convex.deployment.list',description:'List deployments in a project. READ.',inputSchema:obj(['projectId'],{projectId:id})},
{name:'convex.deployment.get',description:'Get one deployment in a project by id, reference, or deployment type. READ.',inputSchema:obj(['projectId'],{projectId:id,deploymentId:id,deploymentRef:{type:'string',minLength:1,maxLength:256},deploymentType:{type:'string',enum:['prod','dev']}})},
{name:'convex.deployment.team_list',description:'List deployments across a team with bounded pagination. READ.',inputSchema:obj(['teamId'],{teamId:id,limit:{type:'integer',minimum:1,maximum:100},cursor:{type:'string',maxLength:2048}})},
{name:'convex.deployment.region_list',description:'List deployment regions available to a team. READ.',inputSchema:obj(['teamId'],{teamId:id})},
{name:'convex.deployment.class_list',description:'List deployment classes available to a team. READ.',inputSchema:obj(['teamId'],{teamId:id})},
{name:'convex.team.member_list',description:'List members of a team. READ.',inputSchema:obj(['teamId'],{teamId:id})},
{name:'convex.deployment.custom_domain_list',description:'List custom domains configured on a deployment. READ.',inputSchema:obj(['deploymentName'],{deploymentName:id})},
{name:'convex.project.delete',description:'Delete a project and every deployment in it. DESTRUCTIVE; disabled by default and requires explicit payload-bound approval.',inputSchema:obj(['projectId','approval_token'],{projectId:id,approval_token:approval})},
{name:'convex.deployment.delete',description:'Delete a deployment including all data and files. DESTRUCTIVE; disabled by default and requires explicit payload-bound approval.',inputSchema:obj(['deploymentName','approval_token'],{deploymentName:id,approval_token:approval})}
];
export function withoutApproval(args={}){ const {approval_token:_a,...rest}=args; return rest; }
