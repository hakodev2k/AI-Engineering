import { z } from "zod";
import type { Risk } from "./policy.js";

const id = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
const approvalToken = z.string().min(8).max(512);
const page = z.number().int().min(1).max(100000).optional();
const perPage = z.number().int().min(1).max(1000).optional();
const httpsUrl = z.string().url().refine(v => new URL(v).protocol === "https:", "HTTPS URL required");
const eventType = z.enum(["response_completed","response_updated","response_disqualified","response_created","response_deleted","response_overquota","collector_created","collector_updated","collector_deleted","survey_created","survey_updated","survey_deleted","app_installed","app_uninstalled"]);

type JsonSchema = Record<string, unknown>;
export type ToolDef = { name:string; description:string; risk:Risk; schema:z.ZodTypeAny; inputSchema:JsonSchema; permission:string; approval:boolean };

function obj(properties: JsonSchema, required: string[] = []): JsonSchema {
  return { type:"object", properties, required, additionalProperties:false };
}
const stringId = { type:"string", minLength:1, maxLength:128, pattern:"^[A-Za-z0-9_-]+$" };
const approval = { type:"string", minLength:8, maxLength:512 };
const pagination = { page:{type:"integer",minimum:1}, perPage:{type:"integer",minimum:1,maximum:1000} };

export const TOOLS: ToolDef[] = [
  { name:"surveymonkey.user.get", description:"Get the authenticated SurveyMonkey user profile.", risk:"READ", permission:"users_read", approval:false, schema:z.object({}).strict(), inputSchema:obj({}) },
  { name:"surveymonkey.survey.list", description:"Search and list surveys with bounded pagination.", risk:"READ", permission:"surveys_read", approval:false, schema:z.object({query:z.string().max(200).optional(),page,perPage}).strict(), inputSchema:obj({query:{type:"string",maxLength:200},...pagination}) },
  { name:"surveymonkey.survey.get", description:"Get survey metadata by ID.", risk:"READ", permission:"surveys_read", approval:false, schema:z.object({surveyId:id}).strict(), inputSchema:obj({surveyId:stringId},["surveyId"]) },
  { name:"surveymonkey.survey.details.get", description:"Get expanded survey pages and questions.", risk:"READ", permission:"surveys_read", approval:false, schema:z.object({surveyId:id}).strict(), inputSchema:obj({surveyId:stringId},["surveyId"]) },
  { name:"surveymonkey.survey.create", description:"Create a new survey.", risk:"WRITE", permission:"surveys_write", approval:true, schema:z.object({title:z.string().min(1).max(250),language:z.string().min(2).max(20).optional(),approvalToken}).strict(), inputSchema:obj({title:{type:"string",minLength:1,maxLength:250},language:{type:"string",minLength:2,maxLength:20},approvalToken:approval},["title","approvalToken"]) },
  { name:"surveymonkey.survey.update", description:"Update survey title, nickname, or language.", risk:"WRITE", permission:"surveys_write", approval:true, schema:z.object({surveyId:id,title:z.string().min(1).max(250).optional(),nickname:z.string().max(250).optional(),language:z.string().min(2).max(20).optional(),approvalToken}).refine(v=>v.title!==undefined||v.nickname!==undefined||v.language!==undefined,"At least one update field is required").strict(), inputSchema:obj({surveyId:stringId,title:{type:"string",minLength:1,maxLength:250},nickname:{type:"string",maxLength:250},language:{type:"string",minLength:2,maxLength:20},approvalToken:approval},["surveyId","approvalToken"]) },
  { name:"surveymonkey.page.list", description:"List pages in a survey.", risk:"READ", permission:"surveys_read", approval:false, schema:z.object({surveyId:id,page,perPage}).strict(), inputSchema:obj({surveyId:stringId,...pagination},["surveyId"]) },
  { name:"surveymonkey.question.list", description:"List questions on a survey page.", risk:"READ", permission:"surveys_read", approval:false, schema:z.object({surveyId:id,pageId:id,page,perPage}).strict(), inputSchema:obj({surveyId:stringId,pageId:stringId,...pagination},["surveyId","pageId"]) },
  { name:"surveymonkey.collector.list", description:"List collectors for a survey.", risk:"READ", permission:"collectors_read", approval:false, schema:z.object({surveyId:id,page,perPage}).strict(), inputSchema:obj({surveyId:stringId,...pagination},["surveyId"]) },
  { name:"surveymonkey.collector.create_link", description:"Create a shareable weblink collector; this publishes an externally usable survey URL.", risk:"HIGH_RISK", permission:"collectors_write", approval:true, schema:z.object({surveyId:id,name:z.string().min(1).max(250).optional(),approvalToken}).strict(), inputSchema:obj({surveyId:stringId,name:{type:"string",minLength:1,maxLength:250},approvalToken:approval},["surveyId","approvalToken"]) },
  { name:"surveymonkey.response.list", description:"List survey responses with full answer data using the bulk response endpoint.", risk:"READ", permission:"responses_read_detail", approval:false, schema:z.object({surveyId:id,page,perPage:perPage.refine(v=>v===undefined||v<=100,"perPage capped at 100 for agent use")}).strict(), inputSchema:obj({surveyId:stringId,page:{type:"integer",minimum:1},perPage:{type:"integer",minimum:1,maximum:100}},["surveyId"]) },
  { name:"surveymonkey.response.get", description:"Get one survey response including answers.", risk:"READ", permission:"responses_read_detail", approval:false, schema:z.object({surveyId:id,responseId:id}).strict(), inputSchema:obj({surveyId:stringId,responseId:stringId},["surveyId","responseId"]) },
  { name:"surveymonkey.response.summary", description:"Get statistical rollups and answer counts for a survey.", risk:"READ", permission:"responses_read_detail", approval:false, schema:z.object({surveyId:id}).strict(), inputSchema:obj({surveyId:stringId},["surveyId"]) },
  { name:"surveymonkey.webhook.list", description:"List configured SurveyMonkey webhooks.", risk:"READ", permission:"webhooks_read", approval:false, schema:z.object({page,perPage,eventType:eventType.optional()}).strict(), inputSchema:obj({...pagination,eventType:{type:"string",enum:eventType.options}}) },
  { name:"surveymonkey.webhook.create", description:"Create an HTTPS webhook subscription to deliver SurveyMonkey events externally.", risk:"HIGH_RISK", permission:"webhooks_write", approval:true, schema:z.object({name:z.string().min(1).max(250),subscriptionUrl:httpsUrl,eventType,objectType:z.enum(["survey","collector","app"]).optional(),objectIds:z.array(id).max(100).optional(),approvalToken}).strict(), inputSchema:obj({name:{type:"string",minLength:1,maxLength:250},subscriptionUrl:{type:"string",format:"uri",pattern:"^https://"},eventType:{type:"string",enum:eventType.options},objectType:{type:"string",enum:["survey","collector","app"]},objectIds:{type:"array",items:stringId,maxItems:100},approvalToken:approval},["name","subscriptionUrl","eventType","approvalToken"]) }
];

export const TOOL_MAP = new Map(TOOLS.map(tool => [tool.name, tool]));
