import type {KintoneConfig} from './auth.js';
export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export function authorize(config:KintoneConfig,risk:Risk,approved=false):void{
  if(risk==='READ') return;
  if(risk==='DESTRUCTIVE'&&!config.enableDestructive) throw new Error('Destructive operations are disabled');
  if((risk==='HIGH_RISK'||risk==='DESTRUCTIVE'||config.requireWriteApproval)&&!approved) throw new Error(`Human approval required for ${risk} operation`);
}
export const toolPolicy={
 'kintone.app.get':'READ','kintone.fields.get':'READ','kintone.record.get':'READ','kintone.records.list':'READ','kintone.comments.list':'READ','kintone.permissions.evaluate':'READ',
 'kintone.record.create':'WRITE','kintone.record.update':'WRITE','kintone.comment.add':'HIGH_RISK','kintone.status.update':'WRITE','kintone.records.delete':'DESTRUCTIVE'
} as const satisfies Record<string,Risk>;
