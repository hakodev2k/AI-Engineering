#!/usr/bin/env python3
import json,subprocess,tempfile,os,hashlib
from datetime import datetime,timezone,timedelta
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POL=os.path.join(ROOT,'config','time-policy.json')
EVAL=os.path.join(ROOT,'scripts','evaluate-time-decision.py')
GATE=os.path.join(ROOT,'scripts','evaluate-final-gate.py')

def run(cmd):
 p=subprocess.run(cmd,text=True,capture_output=True);return p.returncode,json.loads(p.stdout)
def decision(risk='low',trust='asserted',age=1,executor='agent-a',approval=False):
 now=datetime.now(timezone.utc);obs=now-timedelta(seconds=age)
 return {'decision_id':'d1','decision_type':'cache-ttl-check','risk':risk,'timezone':'UTC','condition':{'kind':'before','at':(now+timedelta(minutes=5)).isoformat().replace('+00:00','Z'),'start':None,'end':None,'issued_at':None,'ttl_seconds':None},'time_observation':{'observation_id':'o1','source_id':'test-clock','source_type':'system','trust_level':trust,'observed_at_utc':obs.isoformat().replace('+00:00','Z'),'monotonic_ns':1,'timezone':'UTC','clock_skew_ms':0,'reference_source':'test-reference' if trust=='verified' else None,'reference_observed_at_utc':obs.isoformat().replace('+00:00','Z') if trust=='verified' else None,'notes':'test'},'executor_id':executor,'status':'pending','evaluation':None,'approval_required':approval}
with tempfile.TemporaryDirectory() as td:
 # fresh low risk -> verified
 d=decision();dp=os.path.join(td,'d.json');ep=os.path.join(td,'e.json');json.dump(d,open(dp,'w'))
 rc,e=run(['python',EVAL,dp,'--policy',POL]);assert rc==0 and e['status']=='evaluated' and e['condition_satisfied'];json.dump(e,open(ep,'w'))
 rc,g=run(['python',GATE,dp,ep,'--policy',POL]);assert rc==0 and g['status']=='verified'
 # stale -> revalidation-required
 d=decision(age=1000);json.dump(d,open(dp,'w'));rc,e=run(['python',EVAL,dp,'--policy',POL]);assert rc==3 and e['status']=='revalidation-required'
 # high risk asserted -> insufficient trust
 d=decision(risk='high',trust='asserted');json.dump(d,open(dp,'w'));rc,e=run(['python',EVAL,dp,'--policy',POL]);assert rc==3 and 'insufficient-trust' in e['reasons']
 # high risk verified + self review -> blocked
 d=decision(risk='high',trust='verified');json.dump(d,open(dp,'w'));rc,e=run(['python',EVAL,dp,'--policy',POL]);assert rc==0;json.dump(e,open(ep,'w'))
 fp=hashlib.sha256(json.dumps(d,sort_keys=True,separators=(',',':')).encode()).hexdigest();review={'reviewer_id':'agent-a','decision_fingerprint':fp,'status':'approved','findings':[],'human_approval_confirmed':False};rp=os.path.join(td,'r.json');json.dump(review,open(rp,'w'))
 rc,g=run(['python',GATE,dp,ep,'--policy',POL,'--review',rp]);assert rc==4 and 'self-review-not-independent' in g['reasons']
print('smoke-test: PASS')
