import { z } from "zod";
import type { MailjetClient } from "./client.js";
import type { Config } from "./config.js";
import { enforce, type Risk } from "./policy.js";

const id=z.union([z.string().regex(/^\d+$/),z.number().int().positive()]).transform(String);
const page=z.object({limit:z.number().int().min(1).max(1000).default(100),offset:z.number().int().min(0).default(0)});
const approval=z.object({approved:z.boolean().optional()});
export type ToolDef={name:string;description:string;risk:Risk;schema:z.ZodTypeAny;run:(x:any)=>Promise<unknown>};

export function buildTools(client:MailjetClient,cfg:Config):ToolDef[]{
 const tool=(name:string,description:string,risk:Risk,schema:z.ZodTypeAny,fn:(x:any)=>Promise<unknown>):ToolDef=>({name,description,risk,schema,run:async(x)=>{const v=schema.parse(x);enforce(risk,v.approved,cfg);return fn(v);}});
 return [
  tool("mailjet.contact.list","List contacts with bounded pagination.","READ",page, x=>client.request("GET","/v3/REST/contact",{query:{Limit:x.limit,Offset:x.offset}})),
  tool("mailjet.contact.get","Get a contact by numeric ID.","READ",z.object({id}),x=>client.request("GET",`/v3/REST/contact/${x.id}`)),
  tool("mailjet.contact.create","Create a contact.","WRITE",z.object({email:z.string().email(),name:z.string().max(255).optional()}).merge(approval),x=>client.request("POST","/v3/REST/contact",{body:{Email:x.email,Name:x.name},retryable:false})),
  tool("mailjet.contact.update","Update contact metadata.","WRITE",z.object({id,name:z.string().max(255)}).merge(approval),x=>client.request("PUT",`/v3/REST/contact/${x.id}`,{body:{Name:x.name},retryable:false})),
  tool("mailjet.contactlist.list","List contact lists.","READ",page,x=>client.request("GET","/v3/REST/contactslist",{query:{Limit:x.limit,Offset:x.offset}})),
  tool("mailjet.contactlist.get","Get a contact list.","READ",z.object({id}),x=>client.request("GET",`/v3/REST/contactslist/${x.id}`)),
  tool("mailjet.contactlist.create","Create a contact list.","WRITE",z.object({name:z.string().min(1).max(255)}).merge(approval),x=>client.request("POST","/v3/REST/contactslist",{body:{Name:x.name},retryable:false})),
  tool("mailjet.contactlist.add_contact","Subscribe/add a contact to a list.","WRITE",z.object({listId:id,email:z.string().email()}).merge(approval),x=>client.request("POST",`/v3/REST/contactslist/${x.listId}/managecontact`,{body:{Email:x.email,Action:"addforce"},retryable:false})),
  tool("mailjet.contactlist.remove_contact","Unsubscribe/remove a contact from a list.","HIGH_RISK",z.object({listId:id,email:z.string().email()}).merge(approval),x=>client.request("POST",`/v3/REST/contactslist/${x.listId}/managecontact`,{body:{Email:x.email,Action:"remove"},retryable:false})),
  tool("mailjet.message.list","List message metadata.","READ",page,x=>client.request("GET","/v3/REST/message",{query:{Limit:x.limit,Offset:x.offset}})),
  tool("mailjet.message.get","Get message metadata.","READ",z.object({id}),x=>client.request("GET",`/v3/REST/message/${x.id}`)),
  tool("mailjet.sender.list","List configured senders.","READ",page,x=>client.request("GET","/v3/REST/sender",{query:{Limit:x.limit,Offset:x.offset}})),
  tool("mailjet.template.list","List templates.","READ",page,x=>client.request("GET","/v3/REST/template",{query:{Limit:x.limit,Offset:x.offset}})),
  tool("mailjet.template.get","Get template metadata.","READ",z.object({id}),x=>client.request("GET",`/v3/REST/template/${x.id}`)),
  tool("mailjet.campaign.list","List campaigns.","READ",page,x=>client.request("GET","/v3/REST/campaign",{query:{Limit:x.limit,Offset:x.offset}})),
  tool("mailjet.campaign.get","Get campaign metadata.","READ",z.object({id}),x=>client.request("GET",`/v3/REST/campaign/${x.id}`)),
  tool("mailjet.email.send","Send an external transactional email through Send API v3.1.","HIGH_RISK",z.object({fromEmail:z.string().email(),fromName:z.string().max(255).optional(),to:z.array(z.object({email:z.string().email(),name:z.string().max(255).optional()})).min(1).max(50),subject:z.string().min(1).max(998),text:z.string().max(500000).optional(),html:z.string().max(1000000).optional(),customId:z.string().max(255).optional()}).refine(v=>v.text||v.html,{message:"text or html is required"}).and(approval),x=>client.request("POST","/v3.1/send",{body:{Messages:[{From:{Email:x.fromEmail,Name:x.fromName},To:x.to.map((r:any)=>({Email:r.email,Name:r.name})),Subject:x.subject,TextPart:x.text,HTMLPart:x.html,CustomID:x.customId}]},retryable:false}))
 ];
}
