import {z} from 'zod';
export const orgList=z.object({limit:z.number().int().min(1).max(100).default(50)}).strict();
export const projectList=orgList;
export const userList=z.object({orgId:z.string().min(1).max(200),startIndex:z.number().int().min(1).default(1),count:z.number().int().min(1).max(100).default(50),filter:z.string().max(1000).optional()}).strict();
export const userGet=z.object({orgId:z.string().min(1).max(200),userId:z.string().min(1).max(200)}).strict();
export const userCreate=z.object({orgId:z.string().min(1).max(200),userName:z.string().min(1).max(200),givenName:z.string().min(1).max(200),familyName:z.string().min(1).max(200),email:z.string().email(),displayName:z.string().max(300).optional(),active:z.boolean().default(true),approved:z.literal(true)}).strict();
export const userPatch=z.object({orgId:z.string().min(1).max(200),userId:z.string().min(1).max(200),displayName:z.string().max(300).optional(),givenName:z.string().min(1).max(200).optional(),familyName:z.string().min(1).max(200).optional(),approved:z.literal(true)}).strict().refine(v=>v.displayName||v.givenName||v.familyName,{message:'At least one editable field required'});
export const userState=z.object({orgId:z.string().min(1).max(200),userId:z.string().min(1).max(200),approved:z.literal(true)}).strict();