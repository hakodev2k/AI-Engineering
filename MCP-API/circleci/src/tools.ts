import {CircleCIClient} from './client.js';import {projectSlug,requireApproval,uuid} from './security.js';
export const toolSpecs=[
 ['circleci.pipeline.list','READ'],['circleci.pipeline.get','READ'],['circleci.pipeline.trigger','WRITE'],['circleci.workflow.get','READ'],['circleci.workflow.jobs.list','READ'],['circleci.workflow.rerun','WRITE'],['circleci.workflow.cancel','HIGH_RISK'],['circleci.workflow.job.approve','WRITE'],['circleci.project.get','READ'],['circleci.project.checkout_key.list','READ']
] as const;
export class Tools{constructor(private c:CircleCIClient){}
 pipelineList(a:any){const s=projectSlug(a.projectSlug);const q=new URLSearchParams();if(a.branch)q.set('branch',a.branch);if(a.pageToken)q.set('page-token',a.pageToken);return this.c.request(`project/${s}/pipeline?${q}`)}
 pipelineGet(a:any){return this.c.request(`pipeline/${uuid(a.id)}`)}
 pipelineTrigger(a:any){requireApproval('WRITE',a.approved===true);const s=projectSlug(a.projectSlug);return this.c.request(`project/${s}/pipeline`,{method:'POST',body:JSON.stringify({branch:a.branch,tag:a.tag,parameters:a.parameters})},false)}
 workflowGet(a:any){return this.c.request(`workflow/${uuid(a.id)}`)}
 workflowJobs(a:any){return this.c.request(`workflow/${uuid(a.id)}/job${a.pageToken?`?page-token=${encodeURIComponent(a.pageToken)}`:''}`)}
 workflowRerun(a:any){requireApproval('WRITE',a.approved===true);return this.c.request(`workflow/${uuid(a.id)}/rerun`,{method:'POST',body:JSON.stringify({from_failed:a.fromFailed??true,sparse_tree:a.sparseTree??false})},false)}
 workflowCancel(a:any){requireApproval('HIGH_RISK',a.approved===true);return this.c.request(`workflow/${uuid(a.id)}/cancel`,{method:'POST'},false)}
 workflowApprove(a:any){requireApproval('WRITE',a.approved===true);return this.c.request(`workflow/${uuid(a.workflowId)}/approve/${uuid(a.approvalRequestId)}`,{method:'POST'},false)}
 projectGet(a:any){return this.c.request(`project/${projectSlug(a.projectSlug)}`)}
 checkoutKeys(a:any){return this.c.request(`project/${projectSlug(a.projectSlug)}/checkout-key`)} }
