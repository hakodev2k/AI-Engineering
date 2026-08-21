#!/usr/bin/env python3
import argparse,json,sys
from datetime import datetime

def dt(v):
    if not isinstance(v,str) or not (v.endswith('Z') or '+' in v[10:]): raise ValueError('timestamp must be timezone-aware')
    return datetime.fromisoformat(v.replace('Z','+00:00'))
p=argparse.ArgumentParser();p.add_argument('observation');p.add_argument('--max-skew-ms',type=float,default=2000);a=p.parse_args()
try:
 d=json.load(open(a.observation,encoding='utf-8'))
 for k in ['observation_id','source_id','source_type','trust_level','observed_at_utc','monotonic_ns','timezone','clock_skew_ms']:
  if k not in d: raise ValueError('missing '+k)
 dt(d['observed_at_utc'])
 if d['trust_level'] not in ['unverified','asserted','verified']: raise ValueError('invalid trust_level')
 if d['clock_skew_ms']<0: raise ValueError('negative clock skew')
 if d['clock_skew_ms']>a.max_skew_ms: raise ValueError('clock skew exceeds policy')
 if d['trust_level']=='verified' and not d.get('reference_source'): raise ValueError('verified observation lacks reference_source')
 print(json.dumps({'status':'valid','observation_id':d['observation_id']}));sys.exit(0)
except Exception as e:
 print(json.dumps({'status':'invalid','error':str(e)}));sys.exit(2)
