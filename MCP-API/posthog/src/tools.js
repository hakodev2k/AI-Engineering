const id={type:'integer',minimum:1};
const approval={type:'string',pattern:'^[a-f0-9]{64}$'};
const page={limit:{type:'integer',minimum:1,maximum:100,default:20},offset:{type:'integer',minimum:0,maximum:1000000,default:0}};
export const TOOLS=[
 {name:'posthog.project.get',description:'Get the configured PostHog project. READ.',inputSchema:{type:'object',additionalProperties:false,properties:{}}},
 {name:'posthog.dashboard.list',description:'List dashboards. READ.',inputSchema:{type:'object',additionalProperties:false,properties:page}},
 {name:'posthog.dashboard.get',description:'Get a dashboard by ID. READ.',inputSchema:{type:'object',additionalProperties:false,required:['id'],properties:{id}}},
 {name:'posthog.insight.list',description:'List/search saved insights. READ.',inputSchema:{type:'object',additionalProperties:false,properties:{...page,search:{type:'string',maxLength:500}}}},
 {name:'posthog.insight.get',description:'Get a saved insight by ID. READ.',inputSchema:{type:'object',additionalProperties:false,required:['id'],properties:{id}}},
 {name:'posthog.feature_flag.list',description:'List/search feature flags. READ.',inputSchema:{type:'object',additionalProperties:false,properties:{...page,search:{type:'string',maxLength:500}}}},
 {name:'posthog.feature_flag.get',description:'Get a feature flag by ID. READ.',inputSchema:{type:'object',additionalProperties:false,required:['id'],properties:{id}}},
 {name:'posthog.feature_flag.create',description:'Create a feature flag. WRITE; approval required.',inputSchema:{type:'object',additionalProperties:false,required:['key','name','approval_token'],properties:{key:{type:'string',minLength:1,maxLength:400,pattern:'^[A-Za-z0-9._:-]+$'},name:{type:'string',minLength:1,maxLength:400},active:{type:'boolean',default:true},filters:{type:'object',maxProperties:50,additionalProperties:true},tags:{type:'array',maxItems:50,items:{type:'string',maxLength:100}},approval_token:approval}}},
 {name:'posthog.feature_flag.update',description:'Update feature flag state/configuration. HIGH_RISK; approval required.',inputSchema:{type:'object',additionalProperties:false,required:['id','changes','approval_token'],properties:{id,changes:{type:'object',minProperties:1,maxProperties:20,properties:{name:{type:'string',minLength:1,maxLength:400},active:{type:'boolean'},filters:{type:'object',maxProperties:50,additionalProperties:true},tags:{type:'array',maxItems:50,items:{type:'string',maxLength:100}}},additionalProperties:false},approval_token:approval}}},
 {name:'posthog.feature_flag.delete',description:'Delete a feature flag. DESTRUCTIVE; disabled by default and approval required.',inputSchema:{type:'object',additionalProperties:false,required:['id','approval_token'],properties:{id,approval_token:approval}}},
 {name:'posthog.person.list',description:'List/search persons. READ; analytics rate limits apply.',inputSchema:{type:'object',additionalProperties:false,properties:{...page,search:{type:'string',maxLength:500}}}},
 {name:'posthog.person.get',description:'Get a person by UUID/ID. READ.',inputSchema:{type:'object',additionalProperties:false,required:['id'],properties:{id:{type:'string',minLength:1,maxLength:200}}}}
];
export const stripApproval = (a={}) => { const {approval_token,...rest}=a; return rest; };
