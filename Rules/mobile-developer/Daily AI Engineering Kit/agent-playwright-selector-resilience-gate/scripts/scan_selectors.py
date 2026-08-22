#!/usr/bin/env python3
import argparse, fnmatch, json, re, sys
from pathlib import Path
try:
    import yaml
except ImportError:
    print(json.dumps({'status':'error','error':'PyYAML required'})); sys.exit(3)

def main():
    p=argparse.ArgumentParser(description='Static resilience gate for Playwright selectors.')
    p.add_argument('--root',default='.'); p.add_argument('--policy',required=True); p.add_argument('--output')
    a=p.parse_args(); root=Path(a.root)
    try: policy=yaml.safe_load(Path(a.policy).read_text(encoding='utf-8')) or {}
    except Exception as e: print(json.dumps({'status':'error','error':str(e)})); return 3
    findings=[]; files=[]; seen=set(); excludes=policy.get('exclude_globs',[])
    for glob in policy.get('scan_globs',[]):
        for f in root.glob(glob):
            if not f.is_file() or f in seen: continue
            rel=f.relative_to(root).as_posix()
            if any(fnmatch.fnmatch(rel,pat) for pat in excludes): continue
            seen.add(f); files.append(f)
    for f in files:
        text=f.read_text(encoding='utf-8',errors='replace'); warnings=0
        for line_no,line in enumerate(text.splitlines(),1):
            for pat in policy.get('block_patterns',[]):
                if pat in line: findings.append({'severity':'block','file':str(f),'line':line_no,'pattern':pat,'evidence':line.strip()[:240]})
            for pat in policy.get('warn_patterns',[]):
                if pat in line: warnings+=1; findings.append({'severity':'warn','file':str(f),'line':line_no,'pattern':pat,'evidence':line.strip()[:240]})
        if warnings>int(policy.get('max_warnings_per_file',5)):
            findings.append({'severity':'block','file':str(f),'line':0,'pattern':'warning-threshold','evidence':warnings})
        if policy.get('require_assertion_after_action',True):
            action_lines=[]; assertion_lines=[]
            for i,line in enumerate(text.splitlines(),1):
                if re.search(r'\.(click|fill|press|check|uncheck|selectOption|setInputFiles)\s*\(',line): action_lines.append(i)
                if re.search(r'\bexpect\s*\(',line): assertion_lines.append(i)
            for al in action_lines:
                if not any(al < x <= al+12 for x in assertion_lines):
                    findings.append({'severity':'warn','file':str(f),'line':al,'pattern':'action-without-nearby-assertion','evidence':'No expect() within next 12 lines'})
    blocked=any(x['severity']=='block' for x in findings)
    status='blocked' if blocked else ('warnings' if findings else 'passed')
    result={'status':status,'scanned_files':len(files),'findings':findings}
    text=json.dumps(result,indent=2)
    if a.output: Path(a.output).write_text(text+'\n',encoding='utf-8')
    print(text)
    return 2 if blocked else 1 if findings else 0
if __name__=='__main__': sys.exit(main())
