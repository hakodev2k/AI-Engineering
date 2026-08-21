#!/usr/bin/env python3
import argparse, hashlib, json, subprocess, sys

def run(*args):
    p=subprocess.run(args,text=True,capture_output=True)
    if p.returncode!=0: raise RuntimeError(p.stderr.strip() or 'git command failed')
    return p.stdout

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--base',required=True); ap.add_argument('--output',required=True); a=ap.parse_args()
    try:
        run('git','rev-parse','--verify',a.base)
        out=run('git','diff','--name-status','--no-renames',a.base,'--')
        rows=[]
        for line in out.splitlines():
            if not line.strip(): continue
            status,path=line.split('\t',1)
            rows.append({'status':status,'path':path})
        canonical='\n'.join(f"{r['status']}\t{r['path']}" for r in rows)
        fp=hashlib.sha256(canonical.encode()).hexdigest()
        doc={'base_ref':a.base,'changes':rows,'change_fingerprint':fp}
        with open(a.output,'w',encoding='utf-8') as f: json.dump(doc,f,indent=2)
        print(json.dumps({'status':'ok','count':len(rows),'change_fingerprint':fp}))
        return 0
    except Exception as e:
        print(json.dumps({'status':'error','error':str(e)})); return 2
if __name__=='__main__': sys.exit(main())