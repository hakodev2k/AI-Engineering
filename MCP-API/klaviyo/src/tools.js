const ID={type:'string',minLength:1,maxLength:200}; const CURSOR={type:'string',minLength:1,maxLength:2000};
const FILTER={type:'string',minLength:1,maxLength:4000}; const SORT={type:'string',minLength:1,maxLength:200};
const APPROVAL={type:'string',pattern:'^[a-f0-9]{64}$'};
const listSchema={type:'object',additionalProperties:false,properties:{cursor:CURSOR,pageSize:{type:'integer',minimum:1,maximum:100},filter:FILTER,sort:SORT}};
const getSchema={type:'object',additionalProperties:false,required:['id'],properties:{id:ID}};
export const TOOL_DEFINITIONS=[
  ['klaviyo.profile.list','List Klaviyo profiles with bounded pagination. Risk: READ.',listSchema],
  ['klaviyo.profile.get','Get one Klaviyo profile. Risk: READ.',getSchema],
  ['klaviyo.list.list','List Klaviyo lists. Risk: READ.',listSchema],
  ['klaviyo.list.get','Get one Klaviyo list. Risk: READ.',getSchema],
  ['klaviyo.segment.list','List Klaviyo segments. Risk: READ.',listSchema],
  ['klaviyo.segment.get','Get one Klaviyo segment. Risk: READ.',getSchema],
  ['klaviyo.metric.list','List Klaviyo metrics. Risk: READ.',listSchema],
  ['klaviyo.metric.get','Get one Klaviyo metric. Risk: READ.',getSchema],
  ['klaviyo.event.list','List Klaviyo events. Risk: READ.',listSchema],
  ['klaviyo.campaign.list','List Klaviyo campaigns. Risk: READ.',listSchema],
  ['klaviyo.campaign.get','Get one Klaviyo campaign. Risk: READ.',getSchema],
  ['klaviyo.event.create','Create a server-side Klaviyo event. Risk: WRITE. Explicit approval required.',{type:'object',additionalProperties:false,required:['metricName','profile','approval_token'],properties:{metricName:{type:'string',minLength:1,maxLength:200},profile:{type:'object',additionalProperties:false,minProperties:1,properties:{email:{type:'string',format:'email',maxLength:320},phone_number:{type:'string',minLength:3,maxLength:50},external_id:{type:'string',minLength:1,maxLength:200},anonymous_id:{type:'string',minLength:1,maxLength:200}}},properties:{type:'object',maxProperties:300,additionalProperties:true},time:{type:'string',format:'date-time'},value:{type:'number'},uniqueId:{type:'string',minLength:1,maxLength:200},approval_token:APPROVAL}}]
].map(([name,description,inputSchema])=>({name,description,inputSchema}));
export function stripApproval(args={}){const {approval_token:_x,...rest}=args; return rest;}
