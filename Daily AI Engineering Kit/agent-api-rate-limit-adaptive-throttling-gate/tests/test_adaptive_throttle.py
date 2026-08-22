import importlib.util
import sys
from pathlib import Path

MODULE=Path(__file__).parents[1]/'scripts'/'adaptive_throttle.py'
spec=importlib.util.spec_from_file_location('adaptive_throttle',MODULE)
m=importlib.util.module_from_spec(spec)
sys.modules[spec.name]=m
spec.loader.exec_module(m)

def test_success_without_retry():
    code,events=m.simulate([200]); assert code==0; assert events[-1]['action']=='success'

def test_429_reduces_concurrency_and_recovers():
    code,events=m.simulate([429,200]); assert code==0; assert events[0]['concurrency_after']<events[0]['concurrency_before']

def test_non_retryable_stops():
    code,events=m.simulate([401,200]); assert code==2; assert len(events)==1

def test_retry_delay_is_bounded():
    p=m.Policy(max_delay_ms=1000,jitter_ratio=0); gate=m.AdaptiveThrottle(p); assert gate.delay_seconds(10)==1

def test_retry_after_is_capped():
    p=m.Policy(max_delay_ms=1000,jitter_ratio=0); gate=m.AdaptiveThrottle(p); assert gate.delay_seconds(1,10)==1

def test_concurrency_never_drops_below_minimum():
    p=m.Policy(min_concurrency=1,decrease_factor=0.5); gate=m.AdaptiveThrottle(p,concurrency=1); gate.on_throttle(); assert gate.concurrency==1
