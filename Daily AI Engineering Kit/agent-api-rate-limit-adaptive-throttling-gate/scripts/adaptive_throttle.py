#!/usr/bin/env python3
import argparse, json, random, sys, time
from dataclasses import dataclass
from typing import Optional

@dataclass
class Policy:
    max_attempts:int=4; base_delay_ms:int=500; max_delay_ms:int=30000; jitter_ratio:float=0.25
    min_concurrency:int=1; max_concurrency:int=16; decrease_factor:float=0.5; increase_step:int=1; success_window:int=20
    max_total_wait_seconds:int=90

class AdaptiveThrottle:
    def __init__(self, p:Policy, concurrency:int=4):
        self.p=p; self.concurrency=max(p.min_concurrency,min(concurrency,p.max_concurrency)); self.successes=0
    def on_success(self):
        self.successes += 1
        if self.successes >= self.p.success_window:
            self.concurrency=min(self.p.max_concurrency,self.concurrency+self.p.increase_step); self.successes=0
    def on_throttle(self):
        self.concurrency=max(self.p.min_concurrency,int(max(1,self.concurrency*self.p.decrease_factor))); self.successes=0
    def delay_seconds(self, attempt:int, retry_after:Optional[float]=None)->float:
        if retry_after is not None and retry_after >= 0: base=min(retry_after,self.p.max_delay_ms/1000)
        else: base=min((self.p.base_delay_ms*(2**max(0,attempt-1)))/1000,self.p.max_delay_ms/1000)
        jitter=base*self.p.jitter_ratio
        return max(0,base+random.uniform(-jitter,jitter))

def classify(status:int):
    if status in (429,503): return 'retry'
    if status in (400,401,403,404,409,422): return 'stop'
    if 500 <= status <= 599: return 'retry'
    return 'success' if 200 <= status <= 399 else 'stop'

def simulate(statuses, retry_after=None):
    p=Policy(); gate=AdaptiveThrottle(p); waited=0.0; events=[]
    for attempt,status in enumerate(statuses,1):
        action=classify(status)
        item={'attempt':attempt,'status':status,'action':action,'concurrency_before':gate.concurrency}
        if action=='success': gate.on_success(); item['concurrency_after']=gate.concurrency; events.append(item); return 0,events
        if action=='stop' or attempt>=p.max_attempts: item['concurrency_after']=gate.concurrency; events.append(item); return 2,events
        gate.on_throttle(); delay=gate.delay_seconds(attempt,retry_after if status==429 else None)
        if waited+delay>p.max_total_wait_seconds: item.update({'action':'budget-exhausted','delay_seconds':delay,'concurrency_after':gate.concurrency}); events.append(item); return 3,events
        waited+=delay; item.update({'delay_seconds':round(delay,3),'waited_seconds':round(waited,3),'concurrency_after':gate.concurrency}); events.append(item)
    return 2,events

def main():
    ap=argparse.ArgumentParser(description='Deterministic adaptive throttling decision helper')
    ap.add_argument('--statuses',required=True,help='Comma-separated HTTP statuses, e.g. 429,429,200')
    ap.add_argument('--retry-after',type=float)
    ap.add_argument('--sleep',action='store_true',help='Actually sleep for planned delays')
    args=ap.parse_args()
    try: statuses=[int(x.strip()) for x in args.statuses.split(',') if x.strip()]
    except ValueError: print('invalid status list',file=sys.stderr); return 64
    code,events=simulate(statuses,args.retry_after)
    print(json.dumps({'status':'pass' if code==0 else 'blocked','events':events},indent=2))
    if args.sleep:
        for e in events:
            if 'delay_seconds' in e: time.sleep(e['delay_seconds'])
    return code

if __name__=='__main__': raise SystemExit(main())
