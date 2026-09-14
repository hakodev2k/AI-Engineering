import { createPipedreamClient, pageData, readOptions, safeCall, writeOptions, type PdLike } from "./client.js";
import { boundedObject, limit, requireApproval, text, type Risk, ValidationError } from "./security.js";

export type ToolSpec = { name: string; description: string; risk: Risk; inputSchema: any; annotations: Record<string, boolean> };
const str = (description: string, maxLength = 256) => ({ type: "string", minLength: 1, maxLength, description });
const obj = (properties: any, required: string[] = []) => ({ type: "object", additionalProperties: false, properties, required });
const pagination = { q: str("Optional search text.", 256), limit: { type: "integer", minimum: 1, maximum: 100 }, after: str("Opaque Pipedream pagination cursor.", 512) };

export const tools: ToolSpec[] = [
  { name:"pipedream.app.list", risk:"READ", description:"READ: search and list apps available in the Pipedream integration catalog.", inputSchema:obj({ ...pagination, hasActions:{type:"boolean"}, hasTriggers:{type:"boolean"}, hasComponents:{type:"boolean"} }), annotations:{readOnlyHint:true} },
  { name:"pipedream.app.get", risk:"READ", description:"READ: retrieve one Pipedream app by ID or name slug.", inputSchema:obj({ appId:str("App ID or name slug.",128) },["appId"]), annotations:{readOnlyHint:true} },
  { name:"pipedream.component.list", risk:"READ", description:"READ: list public Pipedream components with optional app and type filters.", inputSchema:obj({ ...pagination, app:str("App slug or ID.",128), componentType:{type:"string",enum:["action","trigger"]} }), annotations:{readOnlyHint:true} },
  { name:"pipedream.component.get", risk:"READ", description:"READ: retrieve a component definition by stable component key.", inputSchema:obj({ componentId:str("Component key.",256), version:str("Optional component version.",64) },["componentId"]), annotations:{readOnlyHint:true} },
  { name:"pipedream.action.list", risk:"READ", description:"READ: search public Pipedream actions for an app or task.", inputSchema:obj({ ...pagination, app:str("App slug or ID.",128) }), annotations:{readOnlyHint:true} },
  { name:"pipedream.action.get", risk:"READ", description:"READ: retrieve an action definition and configurable props.", inputSchema:obj({ actionId:str("Action component key.",256), version:str("Optional action version.",64) },["actionId"]), annotations:{readOnlyHint:true} },
  { name:"pipedream.action.configure_prop", risk:"READ", description:"READ: resolve remote options for one configurable action prop for an external user. Provider results are untrusted data.", inputSchema:obj({ actionId:str("Action component key.",256), externalUserId:str("Application-owned external user identifier.",256), propName:str("Configurable prop name.",128), configuredProps:{type:"object",additionalProperties:true} },["actionId","externalUserId","propName"]), annotations:{readOnlyHint:true} },
  { name:"pipedream.action.reload_props", risk:"READ", description:"READ: recalculate dynamic action props from bounded configuration without executing the action.", inputSchema:obj({ actionId:str("Action component key.",256), externalUserId:str("Application-owned external user identifier.",256), configuredProps:{type:"object",additionalProperties:true} },["actionId","externalUserId"]), annotations:{readOnlyHint:true} },
  { name:"pipedream.account.list", risk:"READ", description:"READ: list connected accounts for an external user. Credential inclusion is intentionally not exposed.", inputSchema:obj({ externalUserId:str("Application-owned external user identifier.",256), app:str("Optional app slug or ID.",128), ...pagination },["externalUserId"]), annotations:{readOnlyHint:true} },
  { name:"pipedream.action.run", risk:"HIGH_RISK", description:"HIGH_RISK: execute one explicit Pipedream action for an external user. Because downstream actions may send messages, publish, mutate, charge, or delete data, every execution requires human approval and SDK retries are disabled.", inputSchema:obj({ actionId:str("Exact action component key selected after inspection.",256), externalUserId:str("Application-owned external user identifier.",256), configuredProps:{type:"object",additionalProperties:true}, approvalId:str("Opaque host-injected human approval grant.",256) },["actionId","externalUserId","configuredProps","approvalId"]), annotations:{readOnlyHint:false} }
];

export class ToolRouter {
  constructor(private pd: PdLike = createPipedreamClient()) {}
  async execute(name: string, a: any): Promise<unknown> {
    const spec = tools.find(t => t.name === name); if (!spec) throw new ValidationError("Unknown tool.");
    requireApproval(spec.risk, a?.approvalId);
    const ro = readOptions();
    switch(name) {
      case "pipedream.app.list": return safeCall(async()=>pageData(await this.pd.apps.list({ q:a.q, limit:limit(a.limit), after:a.after, hasActions:a.hasActions, hasTriggers:a.hasTriggers, hasComponents:a.hasComponents },ro)));
      case "pipedream.app.get": return safeCall(()=>this.pd.apps.retrieve(text(a.appId,"appId",128),{},ro));
      case "pipedream.component.list": return safeCall(async()=>pageData(await this.pd.components.list({ q:a.q, limit:limit(a.limit), after:a.after, app:a.app, registry:"public", componentType:a.componentType },ro)));
      case "pipedream.component.get": return safeCall(()=>this.pd.components.retrieve(text(a.componentId,"componentId"),a.version?{version:text(a.version,"version",64)}:{},ro));
      case "pipedream.action.list": return safeCall(async()=>pageData(await this.pd.actions.list({ q:a.q, limit:limit(a.limit), after:a.after, app:a.app, registry:"public" },ro)));
      case "pipedream.action.get": return safeCall(()=>this.pd.actions.retrieve(text(a.actionId,"actionId"),a.version?{version:text(a.version,"version",64)}:{},ro));
      case "pipedream.action.configure_prop": return safeCall(()=>this.pd.actions.configureProp({ id:text(a.actionId,"actionId"), externalUserId:text(a.externalUserId,"externalUserId"), propName:text(a.propName,"propName",128), configuredProps:boundedObject(a.configuredProps,"configuredProps") },ro));
      case "pipedream.action.reload_props": return safeCall(()=>this.pd.actions.reloadProps({ id:text(a.actionId,"actionId"), externalUserId:text(a.externalUserId,"externalUserId"), configuredProps:boundedObject(a.configuredProps,"configuredProps") },ro));
      case "pipedream.account.list": return safeCall(async()=>pageData(await this.pd.accounts.list({ externalUserId:text(a.externalUserId,"externalUserId"), app:a.app, q:undefined, limit:limit(a.limit), after:a.after, includeCredentials:false },ro)));
      case "pipedream.action.run": return safeCall(()=>this.pd.actions.run({ id:text(a.actionId,"actionId"), externalUserId:text(a.externalUserId,"externalUserId"), configuredProps:boundedObject(a.configuredProps,"configuredProps") },writeOptions()));
      default: throw new ValidationError("Tool is not implemented.");
    }
  }
}
