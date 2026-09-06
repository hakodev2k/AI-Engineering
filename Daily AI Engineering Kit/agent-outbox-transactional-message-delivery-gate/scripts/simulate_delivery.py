#!/usr/bin/env python3
"""In-memory crash-window model for transactional outbox invariants."""
from __future__ import annotations
import argparse, json
from pathlib import Path

class Model:
    def __init__(self):
        self.business=set(); self.outbox={}; self.sent=[]; self.claimed=set(); self.consumer=set()
    def commit(self,key,event):
        self.business.add(key); self.outbox[event]={'delivered':False,'attempts':0}
    def claim(self,event):
        if event in self.claimed or self.outbox[event]['delivered']: return False
        self.claimed.add(event); return True
    def send(self,event,ok=True):
        self.outbox[event]['attempts']+=1
        if ok: self.sent.append(event)
        return ok
    def mark(self,event):
        self.outbox[event]['delivered']=True; self.claimed.discard(event)
    def release(self,event): self.claimed.discard(event)
    def consume(self,event):
        if event in self.consumer: return False
        self.consumer.add(event); return True

def run(name):
    m=Model(); ok=True; detail=''
    if name=='commit_atomicity':
        m.commit('order-1','evt-1'); ok='order-1' in m.business and 'evt-1' in m.outbox
    elif name=='crash_before_send':
        m.commit('order-1','evt-1'); m.claim('evt-1'); m.release('evt-1'); ok=not m.outbox['evt-1']['delivered'] and m.claim('evt-1')
    elif name=='send_failure_retry':
        m.commit('order-1','evt-1'); m.claim('evt-1'); m.send('evt-1',False); m.release('evt-1'); ok=m.claim('evt-1') and m.send('evt-1',True)
    elif name=='crash_after_send_before_mark':
        m.commit('order-1','evt-1'); m.claim('evt-1'); m.send('evt-1',True); m.release('evt-1'); m.claim('evt-1'); m.send('evt-1',True); ok=len(m.sent)==2 and m.consume('evt-1') and not m.consume('evt-1')
    elif name=='concurrent_claim':
        m.commit('order-1','evt-1'); first=m.claim('evt-1'); second=m.claim('evt-1'); ok=first and not second
    else: raise ValueError(name)
    return {'name':name,'status':'pass' if ok else 'fail','detail':detail}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--scenario',default='all'); ap.add_argument('--out',required=True); a=ap.parse_args()
    names=['commit_atomicity','crash_before_send','send_failure_retry','crash_after_send_before_mark','concurrent_claim'] if a.scenario=='all' else [a.scenario]
    scenarios=[run(n) for n in names]; out={'status':'pass' if all(x['status']=='pass' for x in scenarios) else 'fail','scenarios':scenarios}
    p=Path(a.out); p.parent.mkdir(parents=True,exist_ok=True); p.write_text(json.dumps(out,indent=2,sort_keys=True)+'\n',encoding='utf-8')
    return 0 if out['status']=='pass' else 2
if __name__=='__main__': raise SystemExit(main())
