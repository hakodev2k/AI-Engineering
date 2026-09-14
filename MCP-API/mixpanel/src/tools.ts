import { MixpanelClient } from "./client.js";
import { assertAllowedEvent, assertDateRange, assertIdentifier, assertPositiveInt, redact, ValidationError } from "./security.js";

type Spec={name:string;description:string;inputSchema:any;annotations:any};
const obj=(properties:any,required:string[]=[])=>({type:"object",additionalProperties:false,properties,required});
const str=(d:string)=>({type:"string",description:d});
const date=str("Date in YYYY-MM-DD format.");

export const tools:Spec[]=[
{name:"mixpanel.events.export",description:"READ: export raw events for a bounded date range (maximum 7 days per call).",inputSchema:obj({fromDate:date,toDate:date,event:str("Optional exact event name."),limit:{type:"integer",minimum:1,maximum:10000}},["fromDate","toDate"]),annotations:{readOnlyHint:true}},
{name:"mixpanel.profiles.query",description:"READ: query user profiles using Mixpanel Engage query parameters with bounded page size.",inputSchema:obj({where:str("Optional Mixpanel profile expression."),pageSize:{type:"integer",minimum:1,maximum:1000}}),annotations:{readOnlyHint:true}},
{name:"mixpanel.funnels.list",description:"READ: list saved funnels visible to the configured service account.",inputSchema:obj({}),annotations:{readOnlyHint:true}},
{name:"mixpanel.funnel.query",description:"READ: query a saved funnel over a bounded date range.",inputSchema:obj({funnelId:{type:"integer",minimum:1},fromDate:date,toDate:date,unit:{type:"string",enum:["day","week","month"]}},["funnelId","fromDate","toDate"]),annotations:{readOnlyHint:true}},
{name:"mixpanel.retention.query",description:"READ: query retention for a born event and optional return event over a bounded date range.",inputSchema:obj({fromDate:date,toDate:date,bornEvent:str("Exact born event name."),returnEvent:str("Optional exact return event name."),retentionType:{type:"string",enum:["birth","compounded"]}},["fromDate","toDate","bornEvent"]),annotations:{readOnlyHint:true}},
{name:"mixpanel.cohorts.list",description:"READ: list cohorts available to the project.",inputSchema:obj({}),annotations:{readOnlyHint:true}},
{name:"mixpanel.event.names",description:"READ: list event names observed in a bounded time window.",inputSchema:obj({type:{type:"string",enum:["general","unique","average"]},limit:{type:"integer",minimum:1,maximum:1000}}),annotations:{readOnlyHint:true}},
{name:"mixpanel.event.properties.top",description:"READ: list top properties for an event.",inputSchema:obj({event:str("Exact event name."),limit:{type:"integer",minimum:1,maximum:1000}},["event"]),annotations:{readOnlyHint:true}},
{name:"mixpanel.segmentation.query",description:"READ: segment an event by date and optionally by one property over a bounded range.",inputSchema:obj({event:str("Exact event name."),fromDate:date,toDate:date,on:str("Optional Mixpanel property expression."),unit:{type:"string",enum:["hour","day","week","month"]}},["event","fromDate","toDate"]),annotations:{readOnlyHint:true}},
{name:"mixpanel.revenue.query",description:"READ: query revenue over a bounded date range.",inputSchema:obj({fromDate:date,toDate:date,unit:{type:"string",enum:["day","week","month"]}},["fromDate","toDate"]),annotations:{readOnlyHint:true}}
];

export class ToolRouter{
  constructor(private client=new MixpanelClient()){}
  async execute(name:string,a:any):Promise<any>{
    let result:any;
    switch(name){
      case "mixpanel.events.export":{const r=assertDateRange(a.fromDate,a.toDate,7);const q=new URLSearchParams({from_date:r.from,to_date:r.to});if(a.event){const e=assertIdentifier(a.event,"event");assertAllowedEvent(e);q.set("event",JSON.stringify([e]));}if(a.limit)q.set("limit",String(assertPositiveInt(a.limit,"limit",10000)));result=await this.client.export(q);break;}
      case "mixpanel.profiles.query":{const q=new URLSearchParams();if(a.where)q.set("where",String(a.where));q.set("page_size",String(a.pageSize?assertPositiveInt(a.pageSize,"pageSize",1000):100));result=await this.client.query("/api/2.0/engage",q);break;}
      case "mixpanel.funnels.list":result=await this.client.query("/api/2.0/funnels/list",new URLSearchParams());break;
      case "mixpanel.funnel.query":{const r=assertDateRange(a.fromDate,a.toDate,90);const q=new URLSearchParams({funnel_id:String(assertPositiveInt(a.funnelId,"funnelId",2147483647)),from_date:r.from,to_date:r.to});if(a.unit)q.set("unit",a.unit);result=await this.client.query("/api/2.0/funnels",q);break;}
      case "mixpanel.retention.query":{const r=assertDateRange(a.fromDate,a.toDate,90);const born=assertIdentifier(a.bornEvent,"bornEvent");assertAllowedEvent(born);const q=new URLSearchParams({from_date:r.from,to_date:r.to,born_event:born,retention_type:a.retentionType||"birth"});if(a.returnEvent){const ev=assertIdentifier(a.returnEvent,"returnEvent");assertAllowedEvent(ev);q.set("event",ev);}result=await this.client.query("/api/2.0/retention",q);break;}
      case "mixpanel.cohorts.list":result=await this.client.query("/api/2.0/cohorts/list",new URLSearchParams());break;
      case "mixpanel.event.names":{const q=new URLSearchParams({type:a.type||"general",limit:String(a.limit?assertPositiveInt(a.limit,"limit",1000):100)});result=await this.client.query("/api/2.0/events/names",q);break;}
      case "mixpanel.event.properties.top":{const ev=assertIdentifier(a.event,"event");assertAllowedEvent(ev);const q=new URLSearchParams({event:ev,limit:String(a.limit?assertPositiveInt(a.limit,"limit",1000):100)});result=await this.client.query("/api/2.0/events/properties/top",q);break;}
      case "mixpanel.segmentation.query":{const r=assertDateRange(a.fromDate,a.toDate,90);const ev=assertIdentifier(a.event,"event");assertAllowedEvent(ev);const q=new URLSearchParams({event:ev,from_date:r.from,to_date:r.to,unit:a.unit||"day"});if(a.on)q.set("on",String(a.on));result=await this.client.query("/api/2.0/segmentation",q);break;}
      case "mixpanel.revenue.query":{const r=assertDateRange(a.fromDate,a.toDate,90);const q=new URLSearchParams({from_date:r.from,to_date:r.to,unit:a.unit||"day"});result=await this.client.query("/api/2.0/revenue",q);break;}
      default:throw new ValidationError("Unknown tool.");
    }
    return {data:redact(result),untrustedProviderData:true};
  }
}
