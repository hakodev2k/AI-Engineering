#!/usr/bin/env python3
import argparse, hashlib, json, re, sys
from pathlib import Path
try:
    import yaml
except ImportError:
    print('PyYAML is required: python -m pip install pyyaml', file=sys.stderr); sys.exit(1)

def main():
    p=argparse.ArgumentParser(description='Classify and scan agent context without executing it.')
    p.add_argument('--input', required=True); p.add_argument('--source', required=True)
    p.add_argument('--origin', required=True); p.add_argument('--policy', required=True); p.add_argument('--output', required=True)
    a=p.parse_args()
    try:
        policy=yaml.safe_load(Path(a.policy).read_text(encoding='utf-8'))
        raw=Path(a.input).read_bytes(); limit=int(policy['decision']['max_input_bytes'])
        if len(raw)>limit: raise ValueError(f'input exceeds {limit} bytes')
        text=raw.decode('utf-8', errors='replace'); digest=hashlib.sha256(raw).hexdigest()
        trusted=set(policy.get('instruction_capable_sources', []))
        instruction=a.source in trusted
        if a.source=='repository' and a.origin in set(policy.get('trusted_repository_paths', [])): instruction=True
        findings=[]; maxf=int(policy['decision'].get('max_findings',100))
        for rule in policy.get('patterns',[]):
            rx=re.compile(rule['regex'])
            for m in rx.finditer(text):
                line=text.count('\n',0,m.start())+1
                excerpt=text[m.start():min(len(text),m.end()+80)].replace('\n',' ')[:240]
                findings.append({'id':rule['id'],'severity':rule['severity'],'line':line,'excerpt':excerpt})
                if len(findings)>=maxf: break
            if len(findings)>=maxf: break
        sev={f['severity'] for f in findings}; deny=set(policy['decision']['deny_severities']); review=set(policy['decision']['review_severities'])
        if sev & deny: status='deny'
        elif sev & review: status='review'
        else: status='allow'
        record={'version':1,'source':a.source,'origin':a.origin,'sha256':digest,'trust':'instruction-capable' if instruction else 'data-only','instruction_capable':instruction,'status':status,'findings':findings,'approval':None,'notes':[]}
        out=Path(a.output); out.parent.mkdir(parents=True,exist_ok=True); out.write_text(json.dumps(record,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
        print(json.dumps({'status':status,'sha256':digest,'findings':len(findings)}))
        return {'allow':0,'review':2,'deny':3}[status]
    except (OSError,KeyError,TypeError,ValueError,yaml.YAMLError) as e:
        print(f'context gate error: {e}',file=sys.stderr); return 1
if __name__=='__main__': sys.exit(main())