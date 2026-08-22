#!/usr/bin/env python3
import argparse, json, random, time
from dataclasses import dataclass, asdict
from pathlib import Path
try:
    import yaml
except ImportError:
    raise SystemExit('PyYAML is required: pip install pyyaml')

@dataclass
class Decision:
    action: str
    reason: str
    retry_delay_seconds: float = 0.0
    circuit_state: str = 'closed'
    attempt: int = 1
    approval_required: bool = False

class CircuitBreaker:
    def __init__(self, policy):
        self.p=policy; self.failures=[]; self.state='closed'; self.opened_at=None; self.half_open_used=0
    def _trim(self):
        n=int(self.p.get('failure_rate_window',10)); self.failures=self.failures[-n:]
    def before_call(self):
        if self.state=='open':
            if time.time()-self.opened_at >= float(self.p.get('open_seconds',30)):
                self.state='half-open'; self.half_open_used=0
            else:
                return False
        if self.state=='half-open':
            limit=int(self.p.get('half_open_probe_limit',1))
            if self.half_open_used>=limit: return False
            self.half_open_used+=1
        return True
    def record(self, success):
        if success:
            self.failures.append(0)
            if self.state=='half-open': self.state='closed'; self.opened_at=None; self.half_open_used=0
        else:
            self.failures.append(1)
            consecutive=sum(1 for x in reversed(self.failures) if x==1)
            self._trim()
            rate=sum(self.failures)/len(self.failures) if self.failures else 0
            if consecutive>=int(self.p.get('consecutive_failures_to_open',3)) or (len(self.failures)>=int(self.p.get('failure_rate_window',10)) and rate>=float(self.p.get('failure_rate_threshold',0.6))):
                self.state='open'; self.opened_at=time.time(); self.half_open_used=0
    def snapshot(self):
        return {'state':self.state,'failures':self.failures,'opened_at':self.opened_at}

def classify_error(status, kind, policy):
    if status is not None:
        if status in policy.get('retryable_status_codes',[]): return 'retryable'
        if status in policy.get('non_retryable_status_codes',[]): return 'non-retryable'
    if kind and kind in policy.get('retryable_error_kinds',[]): return 'retryable'
    return 'non-retryable'

def decide(policy, attempt, idempotent, status=None, kind=None, retry_after=None, circuit_state='closed'):
    if circuit_state=='open': return Decision('stop','circuit-open',circuit_state='open',attempt=attempt)
    cls=classify_error(status,kind,policy)
    if cls!='retryable': return Decision('stop','non-retryable-failure',circuit_state=circuit_state,attempt=attempt)
    if policy.get('require_idempotency_for_retries',True) and not idempotent:
        return Decision('approval','retry-requires-idempotency-or-human-approval',circuit_state=circuit_state,attempt=attempt,approval_required=True)
    if attempt>=int(policy.get('max_attempts_per_call',2)):
        return Decision('stop','attempt-budget-exhausted',circuit_state=circuit_state,attempt=attempt)
    if retry_after is not None:
        delay=min(float(retry_after),float(policy.get('max_retry_after_seconds',60)))
    else:
        base=float(policy.get('base_backoff_seconds',1))*(2**max(0,attempt-1)); delay=min(base,float(policy.get('max_backoff_seconds',8)))
        jitter=float(policy.get('jitter_ratio',0.2)); delay=delay*(1+random.uniform(-jitter,jitter))
    return Decision('retry','retryable-failure',max(0,round(delay,3)),circuit_state,attempt)

def main():
    ap=argparse.ArgumentParser(description='Deterministic retry/circuit-breaker decision gate; never calls an external service.')
    ap.add_argument('--policy',required=True); ap.add_argument('--attempt',type=int,required=True); ap.add_argument('--idempotent',choices=['true','false'],required=True)
    ap.add_argument('--status',type=int); ap.add_argument('--error-kind'); ap.add_argument('--retry-after',type=float); ap.add_argument('--circuit-state',choices=['closed','open','half-open'],default='closed'); ap.add_argument('--output')
    a=ap.parse_args(); policy=yaml.safe_load(Path(a.policy).read_text(encoding='utf-8')) or {}
    d=decide(policy,a.attempt,a.idempotent=='true',a.status,a.error_kind,a.retry_after,a.circuit_state)
    text=json.dumps(asdict(d),indent=2)
    if a.output: Path(a.output).write_text(text+'\n',encoding='utf-8')
    print(text)
    return 0 if d.action=='retry' else 4 if d.action=='approval' else 2
if __name__=='__main__': raise SystemExit(main())
