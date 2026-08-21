#!/usr/bin/env python3
import argparse,json,sys
from datetime import datetime,timezone,timedelta
TRUST={'unverified':0,'asserted':1,'verified':2}
def parse(v):
 if not isinstance(v,str) or not (v.endswith('Z') or '+' in v[10:]): raise ValueError('timezone-aware timestamp required')
 return datetime.fromisoformat(v.replace('Z','+00:00')).astimezone(timezone.utc)
p=argparse.ArgumentParser();p.add_argument('decision');p.add_argument('--policy',required=True);p.add_argument('--now-utc');a=p.parse_args()
try:
 d=json.load(open(a.decision,encoding='utf-8'));policy=json.load(open(a.policy,encoding='utf-8'))
 obs=d['time_observation'];risk=d['risk'];now=parse(a.now_utc) if a.now_utc else datetime.now(timezone.utc);observed=parse(obs['observed_at_utc'])
 age=max(0,(now-observed).total_seconds());max_age=policy['max_observation_age_seconds'][risk];required=policy['required_trust_by_risk'][risk]
 reasons=[]
 if age>max_age: reasons.append('observation-expired')
 if obs.get('clock_skew_ms',10**9)>policy['max_clock_skew_ms']: reasons.append('clock-skew-exceeded')
 if TRUST.get(obs.get('trust_level','unverified'),0)<TRUST[required]: reasons.append('insufficient-trust')
 c=d['condition'];kind=c['kind'];satisfied=False
 if kind=='before': satisfied=now<parse(c['at'])
 elif kind=='after': satisfied=now>=parse(c['at'])
 elif kind=='between': satisfied=parse(c['start'])<=now<parse(c['end'])
 elif kind in ('ttl-valid','ttl-expired'):
  expiry=parse(c['issued_at'])+timedelta(seconds=int(c['ttl_seconds']));satisfied=(now<expiry) if kind=='ttl-valid' else (now>=expiry)
 else: reasons.append('unsupported-condition')
 if reasons:
  status='revalidation-required' if set(reasons)<= {'observation-expired','insufficient-trust','clock-skew-exceeded'} else 'blocked'
 else: status='evaluated'
 result={'status':status,'condition_satisfied':satisfied,'evaluated_at_utc':now.isoformat().replace('+00:00','Z'),'observation_age_seconds':age,'reasons':reasons,'observation_id':obs.get('observation_id'),'decision_id':d.get('decision_id')}
 print(json.dumps(result,indent=2));sys.exit(0 if status=='evaluated' else 3)
except Exception as e:
 print(json.dumps({'status':'blocked','reasons':['validation-error'],'error':str(e)}));sys.exit(2)
