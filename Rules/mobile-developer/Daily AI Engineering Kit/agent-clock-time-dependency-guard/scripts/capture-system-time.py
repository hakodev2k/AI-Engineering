#!/usr/bin/env python3
import argparse, json, time, uuid
from datetime import datetime, timezone

p=argparse.ArgumentParser(description='Capture a UTC time observation without network access.')
p.add_argument('--source-id', default='local-system-clock')
p.add_argument('--trust-level', choices=['unverified','asserted','verified'], default='asserted')
p.add_argument('--clock-skew-ms', type=float, default=0.0)
p.add_argument('--reference-source')
p.add_argument('--timezone', default='UTC')
p.add_argument('--output')
a=p.parse_args()
if a.clock_skew_ms < 0:
    raise SystemExit('clock-skew-ms must be >= 0')
if a.trust_level == 'verified' and not a.reference_source:
    raise SystemExit('verified trust requires --reference-source')
now=datetime.now(timezone.utc)
obj={
 'observation_id':str(uuid.uuid4()),'source_id':a.source_id,'source_type':'system',
 'trust_level':a.trust_level,'observed_at_utc':now.isoformat().replace('+00:00','Z'),
 'monotonic_ns':time.monotonic_ns(),'timezone':a.timezone,'clock_skew_ms':a.clock_skew_ms,
 'reference_source':a.reference_source,'reference_observed_at_utc':now.isoformat().replace('+00:00','Z') if a.reference_source else None,
 'notes':'Local system clock capture; verified trust is caller-asserted only when an external reference was actually checked.'
}
text=json.dumps(obj,indent=2,sort_keys=True)
if a.output:
    with open(a.output,'w',encoding='utf-8') as f:f.write(text+'\n')
else: print(text)
