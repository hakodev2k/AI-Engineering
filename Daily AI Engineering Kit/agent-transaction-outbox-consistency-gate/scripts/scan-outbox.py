#!/usr/bin/env python3
import argparse, json, pathlib, re, sys

RULES = [
    ("publish-before-commit", "high", re.compile(r"(?:Publish|Send|Produce)Async\s*\(", re.I), "Broker publish found; verify it cannot occur before the business transaction commits."),
    ("outbox-write", "info", re.compile(r"(?:Outbox|IntegrationEvent|DomainEvent).*(?:Add|Insert|Enqueue)", re.I), "Potential outbox persistence found."),
    ("processed-before-publish", "critical", re.compile(r"(?:ProcessedAt|Status)\s*=.*(?:processed|DateTime|UtcNow)", re.I), "Processed marker found; verify it is written only after broker acknowledgement."),
    ("unbounded-retry", "high", re.compile(r"while\s*\(\s*true\s*\)|for\s*\(\s*;;\s*\)", re.I), "Potential unbounded retry loop."),
    ("generated-message-id", "medium", re.compile(r"Guid\.NewGuid\(\).*Publish|Publish.*Guid\.NewGuid\(\)", re.I), "Message id may change across retries; prefer stable outbox id."),
]
EXTS = {'.cs','.fs','.vb','.java','.kt','.ts','.js','.py','.go','.sql'}

def main():
    p=argparse.ArgumentParser(); p.add_argument('root', nargs='?', default='.'); p.add_argument('--output', default='outbox-evidence.json'); a=p.parse_args()
    root=pathlib.Path(a.root).resolve()
    if not root.exists() or not root.is_dir(): print('root must be a directory', file=sys.stderr); return 2
    findings=[]; saw_outbox=False
    for f in root.rglob('*'):
        if not f.is_file() or f.suffix.lower() not in EXTS or any(x in f.parts for x in ('.git','node_modules','bin','obj')): continue
        try: text=f.read_text(encoding='utf-8', errors='ignore')
        except OSError: continue
        for lineno,line in enumerate(text.splitlines(),1):
            for rid,severity,rx,msg in RULES:
                if rx.search(line):
                    if rid=='outbox-write': saw_outbox=True; continue
                    findings.append({'id':f'{rid}:{f.relative_to(root)}:{lineno}','severity':severity,'finding':msg,'evidence':[f'{f.relative_to(root)}:{lineno}: {line.strip()[:240]}'],'affected_component':str(f.relative_to(root)),'recommended_action':'Trace transaction, publisher acknowledgement, retry, and idempotency behavior before accepting the change.','confidence':0.65})
    if not saw_outbox:
        findings.append({'id':'no-outbox-evidence','severity':'medium','finding':'No obvious outbox persistence pattern was detected.','evidence':['Static scan found no recognizable outbox insertion pattern.'],'affected_component':'repository','recommended_action':'Confirm whether the integration intentionally uses another atomic delivery mechanism or add an outbox write inside the business transaction.','confidence':0.55})
    result={'status':'blocked' if any(x['severity'] in ('high','critical') for x in findings) else 'pending','findings':findings,'verification':{'atomicity':False,'publisher_safety':False,'consumer_idempotency':False,'retry_bounds':not any(x['id'].startswith('unbounded-retry') for x in findings),'notes':['Static scan is evidence collection, not proof of correctness.']}}
    pathlib.Path(a.output).write_text(json.dumps(result,indent=2),encoding='utf-8'); print(f'wrote {a.output} with {len(findings)} finding(s)')
    return 1 if result['status']=='blocked' else 0
if __name__=='__main__': raise SystemExit(main())
