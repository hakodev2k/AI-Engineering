#!/usr/bin/env python3
import argparse, json, random, subprocess, sys, time
from pathlib import Path

def load_policy(path):
    with open(path, encoding='utf-8') as f: return json.load(f)

def main():
    p=argparse.ArgumentParser(description='Run a command with a bounded retry budget.')
    p.add_argument('--policy', default='config/policy.json')
    p.add_argument('--evidence', default='.ai-retry-evidence.json')
    p.add_argument('command', nargs=argparse.REMAINDER)
    a=p.parse_args()
    if not a.command: p.error('command is required')
    policy=load_policy(a.policy); attempts=[]
    maximum=int(policy['max_attempts']); base=int(policy['base_delay_ms']); cap=int(policy['max_delay_ms']); jitter=float(policy['jitter_ratio'])
    for n in range(1, maximum+1):
        started=time.time(); proc=subprocess.run(a.command, text=True, capture_output=True)
        attempts.append({'attempt':n,'exit_code':proc.returncode,'duration_ms':round((time.time()-started)*1000),'stdout_tail':proc.stdout[-4000:],'stderr_tail':proc.stderr[-4000:]})
        Path(a.evidence).write_text(json.dumps({'command':a.command,'attempts':attempts},indent=2),encoding='utf-8')
        if proc.returncode==0: return 0
        if n==maximum: break
        delay=min(cap,base*(2**(n-1))); delay*=1+random.uniform(-jitter,jitter); time.sleep(max(0,delay)/1000)
    print(f'command failed after {maximum} attempts; evidence: {a.evidence}',file=sys.stderr); return 20
if __name__=='__main__': sys.exit(main())
