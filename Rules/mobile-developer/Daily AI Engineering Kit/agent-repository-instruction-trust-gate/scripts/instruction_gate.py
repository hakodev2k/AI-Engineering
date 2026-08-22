#!/usr/bin/env python3
import argparse, fnmatch, json, os, re, sys
from pathlib import Path
try: import yaml
except ImportError: print('PyYAML is required: pip install pyyaml',file=sys.stderr); sys.exit(2)
def load_policy(path):
    with open(path,encoding='utf-8') as f: p=yaml.safe_load(f)
    for k in ['trusted_instruction_paths','untrusted_patterns','suspicious_instruction_patterns','max_file_bytes']:
        if k not in p: raise ValueError('missing policy key: '+k)
    return p
def matches(path,patterns): return any(fnmatch.fnmatch(path,p) for p in patterns)
def scan(root,p):
    trusted=set(p['trusted_instruction_paths']); regexes=[re.compile(x) for x in p['suspicious_instruction_patterns']]; findings=[]; scanned=0
    for base,dirs,files in os.walk(root):
        dirs[:]=[d for d in dirs if d!='.git']
        for name in files:
            fp=Path(base)/name; rel=fp.relative_to(root).as_posix()
            try:
                if fp.stat().st_size>int(p['max_file_bytes']): continue
                text=fp.read_text(encoding='utf-8',errors='replace')
            except OSError: continue
            candidate=rel in trusted or matches(rel,p['untrusted_patterns']) or fp.suffix.lower() in {'.md','.txt','.json','.yaml','.yml','.xml','.html','.js','.ts','.py','.cs','.sh','.ps1'}
            if not candidate: continue
            scanned+=1
            for i,line in enumerate(text.splitlines(),1):
                for rx in regexes:
                    if rx.search(line): findings.append({'path':rel,'line':i,'trusted_source':rel in trusted,'pattern':rx.pattern,'excerpt':line[:240]})
    return scanned,findings
def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--root',default='.'); ap.add_argument('--policy',required=True); ap.add_argument('--output',default='instruction-gate-report.json'); a=ap.parse_args()
    try: p=load_policy(a.policy); scanned,findings=scan(Path(a.root).resolve(),p)
    except Exception as e: print('gate error: '+str(e),file=sys.stderr); return 2
    blocking=[f for f in findings if not f['trusted_source']]; status='blocked' if blocking and p.get('fail_on_suspicious_untrusted_content',True) else 'pass'
    report={'status':status,'files_scanned':scanned,'findings':findings,'blocking_findings':len(blocking)}; Path(a.output).write_text(json.dumps(report,indent=2),encoding='utf-8'); print(json.dumps(report,indent=2)); return 1 if status=='blocked' else 0
if __name__=='__main__': sys.exit(main())
