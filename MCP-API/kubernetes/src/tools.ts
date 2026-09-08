import { z } from 'zod';
import { KubernetesClient } from './client.js';
import { Policy, type Risk } from './policy.js';
import { config, containerSchema, labelSelectorSchema, nameSchema, namespaceSchema, replicasSchema, tailLinesSchema } from './config.js';

export type ToolDef = { name: string; description: string; risk: Risk; schema: z.ZodTypeAny; run: (input: any) => Promise<unknown> };
const client = new KubernetesClient();
const policy = new Policy(config);
const ns = z.object({ namespace: namespaceSchema });
const resource = ns.extend({ name: nameSchema });
const approval = { approved: z.boolean().optional() };

function meta(x: any) { return { name: x.metadata?.name, namespace: x.metadata?.namespace, labels: x.metadata?.labels, creationTimestamp: x.metadata?.creationTimestamp }; }

export const tools: ToolDef[] = [
  { name:'kubernetes.namespace.list', description:'List namespaces visible to the configured identity.', risk:'READ', schema:z.object({}), run: async()=> (await client.call(()=>client.core.listNamespace())).items.map(meta) },
  { name:'kubernetes.pod.list', description:'List pods in one namespace with an optional label selector.', risk:'READ', schema:ns.extend({ labelSelector:labelSelectorSchema }), run: async(i)=> (await client.call(()=>client.core.listNamespacedPod({namespace:i.namespace,labelSelector:i.labelSelector}))).items.map((p:any)=>({...meta(p),phase:p.status?.phase,nodeName:p.spec?.nodeName,containers:p.spec?.containers?.map((c:any)=>c.name)})) },
  { name:'kubernetes.pod.get', description:'Read pod metadata, spec and status.', risk:'READ', schema:resource, run: async(i)=> client.call(()=>client.core.readNamespacedPod({namespace:i.namespace,name:i.name})) },
  { name:'kubernetes.pod.logs', description:'Read bounded pod logs.', risk:'READ', schema:resource.extend({container:containerSchema,tailLines:tailLinesSchema,previous:z.boolean().default(false)}), run: async(i)=> ({text:await client.call(()=>client.core.readNamespacedPodLog({namespace:i.namespace,name:i.name,container:i.container,tailLines:i.tailLines,previous:i.previous}))}) },
  { name:'kubernetes.deployment.list', description:'List deployments in a namespace.', risk:'READ', schema:ns.extend({labelSelector:labelSelectorSchema}), run: async(i)=> (await client.call(()=>client.apps.listNamespacedDeployment({namespace:i.namespace,labelSelector:i.labelSelector}))).items.map((d:any)=>({...meta(d),replicas:d.spec?.replicas,readyReplicas:d.status?.readyReplicas,availableReplicas:d.status?.availableReplicas})) },
  { name:'kubernetes.deployment.get', description:'Read deployment metadata, spec and status.', risk:'READ', schema:resource, run: async(i)=> client.call(()=>client.apps.readNamespacedDeployment({namespace:i.namespace,name:i.name})) },
  { name:'kubernetes.service.list', description:'List Services in a namespace.', risk:'READ', schema:ns, run: async(i)=> (await client.call(()=>client.core.listNamespacedService({namespace:i.namespace}))).items.map((s:any)=>({...meta(s),type:s.spec?.type,clusterIP:s.spec?.clusterIP,ports:s.spec?.ports})) },
  { name:'kubernetes.event.list', description:'List recent Kubernetes Events in a namespace.', risk:'READ', schema:ns.extend({fieldSelector:z.string().max(1024).optional()}), run: async(i)=> (await client.call(()=>client.core.listNamespacedEvent({namespace:i.namespace,fieldSelector:i.fieldSelector}))).items.map((e:any)=>({...meta(e),type:e.type,reason:e.reason,message:e.message,count:e.count,lastTimestamp:e.lastTimestamp})) },
  { name:'kubernetes.deployment.scale', description:'Scale a deployment. Scaling to zero can cause an outage.', risk:'HIGH_RISK', schema:resource.extend({replicas:replicasSchema,...approval}), run: async(i)=>{policy.assert('HIGH_RISK',i); return client.call(()=>client.apps.patchNamespacedDeploymentScale({namespace:i.namespace,name:i.name,body:{spec:{replicas:i.replicas}}}),{retry:false})} },
  { name:'kubernetes.deployment.restart', description:'Trigger a rolling restart by updating the pod-template annotation.', risk:'HIGH_RISK', schema:resource.extend(approval), run: async(i)=>{policy.assert('HIGH_RISK',i); const stamp=new Date().toISOString(); return client.call(()=>client.apps.patchNamespacedDeployment({namespace:i.namespace,name:i.name,body:{spec:{template:{metadata:{annotations:{'kubectl.kubernetes.io/restartedAt':stamp}}}}}}),{retry:false})} },
  { name:'kubernetes.pod.delete', description:'Delete one pod; its controller may recreate it. Disabled by default.', risk:'DESTRUCTIVE', schema:resource.extend(approval), run: async(i)=>{policy.assert('DESTRUCTIVE',i); return client.call(()=>client.core.deleteNamespacedPod({namespace:i.namespace,name:i.name}),{retry:false})} },
];

export function getTool(name:string){ return tools.find(t=>t.name===name); }
