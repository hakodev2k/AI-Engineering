#!/usr/bin/env python3
import argparse, json, subprocess, sys

def load(p):
    with open(p,'r',encoding='utf-8') as f: return json.load(f)

def git_changed():
    r=subprocess.run(['git','diff','--name-only','HEAD'],capture_output=True,text=True)
    if r.returncode!=0: raise RuntimeError(r.stderr.strip() or 'git diff failed')
    return [x.strip().replace('\\','/') for x in r.stdout.splitlines() if x.strip()]

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--manifest',required=True); ap.add_argument('--output',required=True); a=ap.parse_args()
    m=load(a.manifest); index={i['path'].replace('\\','/'):i for i in m.get('items',[])}
    changed=git_changed(); findings=[]
    for path in changed:
        item=index.get(path)
        if not item:
            findings.append({'path':path,'status':'unclassified','blocking':True}); continue
        cls=item.get('classification')
        if cls in ('generated','derived'):
            source=item.get('source_path','').replace('\\','/')
            if source not in changed:
                findings.append({'path':path,'status':'generated-changed-without-source','source_path':source,'blocking':True})
            else:
                findings.append({'path':path,'status':'regenerated-with-source','source_path':source,'blocking':False})
        elif cls in ('vendor','unknown'):
            approved=bool(item.get('exception',{}).get('approved'))
            findings.append({'path':path,'status':'protected-exception' if approved else 'protected-direct-edit','blocking':not approved})
        else:
            findings.append({'path':path,'status':'source-change','blocking':False})
    report={'status':'blocked' if any(f['blocking'] for f in findings) else 'clean','changed_paths':changed,'findings':findings}
    with open(a.output,'w',encoding='utf-8') as f: json.dump(report,f,indent=2)
    print(json.dumps(report))
    return 2 if report['status']=='blocked' else 0

if __name__=='__main__': raise SystemExit(main())
