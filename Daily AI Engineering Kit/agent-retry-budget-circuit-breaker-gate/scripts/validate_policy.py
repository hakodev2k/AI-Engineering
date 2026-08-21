#!/usr/bin/env python3
import json, sys
from pathlib import Path
p=Path(sys.argv[1] if len(sys.argv)>1 else 'config/policy.json')
try: d=json.loads(p.read_text(encoding='utf-8'))
except Exception as e: print(f'invalid policy: {e}',file=sys.stderr); sys.exit(2)
errors=[]
if not 1 <= d.get('max_attempts',0) <= 10: errors.append('max_attempts must be 1..10')
if d.get('base_delay_ms',-1)<0 or d.get('max_delay_ms',-1)<d.get('base_delay_ms',0): errors.append('invalid delay bounds')
if not 0 <= d.get('jitter_ratio',-1) <= 1: errors.append('jitter_ratio must be 0..1')
cb=d.get('circuit_breaker',{})
if cb.get('failure_threshold',0)<1 or cb.get('open_seconds',0)<1: errors.append('invalid circuit breaker')
if errors:
 print('\n'.join(errors),file=sys.stderr); sys.exit(3)
print('policy valid')
