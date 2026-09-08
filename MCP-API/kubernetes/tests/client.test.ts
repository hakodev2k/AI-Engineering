import { describe, expect, it, vi } from 'vitest';
import { KubernetesClient, KubernetesError } from '../src/client.js';

const fakeCfg:any={kubeconfig:undefined,context:undefined,defaultNamespace:'default',timeoutMs:30,maxRetries:2,allowWrite:false,allowHighRisk:false,allowDestructive:false};

describe('reliability',()=>{
  it('does not retry permission failures',async()=>{ const c=new KubernetesClient(fakeCfg); const op=vi.fn().mockRejectedValue({statusCode:403,body:{message:'forbidden'}}); await expect(c.call(op)).rejects.toMatchObject({code:'PERMISSION_DENIED'}); expect(op).toHaveBeenCalledTimes(1); });
  it('retries bounded transient failures',async()=>{ const c=new KubernetesClient(fakeCfg); const op=vi.fn().mockRejectedValueOnce({statusCode:503,message:'busy'}).mockResolvedValue('ok'); await expect(c.call(op)).resolves.toBe('ok'); expect(op).toHaveBeenCalledTimes(2); });
  it('does not retry mutations when disabled',async()=>{ const c=new KubernetesClient(fakeCfg); const op=vi.fn().mockRejectedValue({statusCode:503}); await expect(c.call(op,{retry:false})).rejects.toBeInstanceOf(KubernetesError); expect(op).toHaveBeenCalledTimes(1); });
});
