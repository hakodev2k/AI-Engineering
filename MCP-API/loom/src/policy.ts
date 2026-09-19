export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export type ToolPolicy={risk:Risk;approval:boolean;upstream:string[]};
export const policies:Record<string,ToolPolicy>={
 'loom.recording.search':{risk:'READ',approval:false,upstream:['search','searchAtlassian','loom_search_recordings']},
 'loom.recording.get':{risk:'READ',approval:false,upstream:['loom_get_recording','getLoomRecording']},
 'loom.transcript.get':{risk:'READ',approval:false,upstream:['loom_get_transcript','getLoomTranscript']},
 'loom.comment.list':{risk:'READ',approval:false,upstream:['loom_list_comments','getLoomComments']},
 'loom.ai_brief.get':{risk:'READ',approval:false,upstream:['loom_get_ai_brief','getLoomAiBrief']},
 'loom.action_item.list':{risk:'READ',approval:false,upstream:['loom_get_action_items','getLoomActionItems']},
 'loom.recording.update':{risk:'WRITE',approval:true,upstream:['loom_update_recording','updateLoomRecording']},
 'loom.recording.move':{risk:'WRITE',approval:true,upstream:['loom_move_recording','moveLoomRecording']},
 'loom.comment.create':{risk:'WRITE',approval:true,upstream:['loom_create_comment','createLoomComment']}
};
export function authorize(name:string,approved:boolean){const p=policies[name];if(!p)throw new Error('Tool is not allowlisted');if(p.approval&&!approved)throw new Error('Human approval required');return p;}
