import {VimeoClient,pageQuery} from './client.js'; import {id,requireApproval,text} from './security.js';
export function createTools(client:VimeoClient){return {
  async accountGet(){return client.request('/me');},
  async videoList(a:{page?:number;perPage?:number;query?:string}){const q=pageQuery(a.page??1,a.perPage??25)+(a.query?`&query=${encodeURIComponent(text(a.query,'query',200))}`:'');return client.request(`/me/videos?${q}`);},
  async videoGet(a:{videoId:string}){return client.request(`/videos/${id(a.videoId,'videoId')}`);},
  async videoUpdate(a:{videoId:string;name?:string;description?:string}){requireApproval('vimeo.video.update','WRITE');if(a.name===undefined&&a.description===undefined)throw new Error('name or description is required');const body:any={};if(a.name!==undefined)body.name=text(a.name,'name',128);if(a.description!==undefined)body.description=a.description.slice(0,5000);return client.request(`/videos/${id(a.videoId,'videoId')}`,'PATCH',body);},
  async commentList(a:{videoId:string;page?:number;perPage?:number}){return client.request(`/videos/${id(a.videoId,'videoId')}/comments?${pageQuery(a.page??1,a.perPage??25)}`);},
  async commentCreate(a:{videoId:string;text:string}){requireApproval('vimeo.comment.create','HIGH_RISK');return client.request(`/videos/${id(a.videoId,'videoId')}/comments`,'POST',{text:text(a.text,'text',2000)});},
  async folderList(a:{page?:number;perPage?:number}){return client.request(`/me/projects?${pageQuery(a.page??1,a.perPage??25)}`);},
  async folderVideoList(a:{folderId:string;page?:number;perPage?:number}){return client.request(`/me/projects/${id(a.folderId,'folderId')}/videos?${pageQuery(a.page??1,a.perPage??25)}`);}
};}
