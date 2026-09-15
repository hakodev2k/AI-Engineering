import { z } from 'zod';
export const topicSchema = z.string().min(1).max(64).regex(/^[A-Za-z0-9_-]+$/,'topic may contain only letters, digits, underscore and hyphen');
export const prioritySchema = z.enum(['min','low','default','high','max']).optional();
export const tagsSchema = z.array(z.string().min(1).max(64).regex(/^[A-Za-z0-9_+-]+$/)).max(20).optional();
export function requireApproval(required:boolean, approved:boolean|undefined) { if (required && approved !== true) throw new Error('APPROVAL_REQUIRED: explicit human approval is required'); }
export function validateClickUrl(value:string|undefined, allowExternal:boolean) {
  if (!value) return;
  const u = new URL(value);
  if (!['https:','http:'].includes(u.protocol)) throw new Error('click URL must use HTTP(S)');
  if (!allowExternal) throw new Error('EXTERNAL_ACTION_DISABLED: enable NTFY_ALLOW_EXTERNAL_ACTION_URLS to use click URLs');
}
