#!/usr/bin/env python3
import argparse, json, re, sys
from pathlib import Path

SYSTEMISH = re.compile(r"<(system-reminder|task-notification|tool_result|tool_use)\b|SYSTEM\s+(DIRECTIVE|OVERRIDE)|ignore\s+(all\s+)?previous", re.I)
SECRETISH = re.compile(r"\b(\.env|secret|credential|token|private[_ -]?key)\b.*\b(read|print|echo|upload|post|send|exfiltrat)", re.I | re.S)
CLAIMISH = re.compile(r"\b(found|confirmed|verified|the file|repository|command output|logs? show|according to the docs?|issue #[0-9]+)\b", re.I)

def load_events(path):
    events=[]
    for n,line in enumerate(Path(path).read_text(encoding='utf-8').splitlines(),1):
        if not line.strip(): continue
        try: events.append(json.loads(line))
        except json.JSONDecodeError as e: raise ValueError(f"line {n}: {e}")
    return events

def event_type(obj):
    t=str(obj.get('type',''))
    msg=obj.get('message')
    if isinstance(msg,dict): t += ' ' + str(msg.get('type',''))
    return t.lower()

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('transcript')
    ap.add_argument('--result', required=True)
    a=ap.parse_args()
    try:
        events=load_events(a.transcript)
        result=Path(a.result).read_text(encoding='utf-8')
    except (OSError,ValueError) as e:
        print(json.dumps({'status':'invalid','error':str(e)})); return 3
    uses=results=0
    for e in events:
        raw=json.dumps(e,ensure_ascii=False)
        typ=event_type(e)
        uses += int('tool_use' in typ or 'tool_use' in raw)
        results += int('tool_result' in typ or 'tool_result' in raw)
    findings=[]
    if SYSTEMISH.search(result): findings.append('system_or_orchestration_impersonation')
    if SECRETISH.search(result): findings.append('credential_steering')
    if uses == 0 and CLAIMISH.search(result): findings.append('external_claim_without_tool_use')
    if uses > 0 and results == 0: findings.append('tool_use_without_result_evidence')
    status='quarantine' if findings else 'verified_low_risk'
    print(json.dumps({'status':status,'tool_uses':uses,'tool_results':results,'findings':findings},indent=2))
    return 2 if findings else 0

if __name__=='__main__': sys.exit(main())
