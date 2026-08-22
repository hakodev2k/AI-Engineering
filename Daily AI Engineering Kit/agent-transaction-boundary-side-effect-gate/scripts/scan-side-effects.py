#!/usr/bin/env python3
import argparse, json, pathlib, re, subprocess, sys
TX = re.compile(r'BeginTransaction|TransactionScope|SaveChanges|CommitAsync|Commit\(')
FX = re.compile(r'HttpClient|SendAsync|\.Publish\(|SendEmail|BlobClient|QueueClient|File\.Write|\.DeleteAsync|ExecuteSql')

def changed_files(base):
    p=subprocess.run(['git','diff','--name-only',base,'--'],capture_output=True,text=True)
    if p.returncode: raise RuntimeError(p.stderr.strip() or 'git diff failed')
    return [pathlib.Path(x) for x in p.stdout.splitlines() if x.endswith(('.cs','.fs','.vb','.ts','.js','.py','.java'))]

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--base',default='HEAD~1'); ap.add_argument('--output',default='.ai/transaction-side-effects.json'); a=ap.parse_args()
    findings=[]
    try: files=changed_files(a.base)
    except Exception as e: print(e,file=sys.stderr); return 2
    for f in files:
        if not f.exists(): continue
        text=f.read_text(errors='replace'); lines=text.splitlines()
        tx=[i+1 for i,x in enumerate(lines) if TX.search(x)]; fx=[i+1 for i,x in enumerate(lines) if FX.search(x)]
        if tx and fx:
            for n in fx:
                nearest=min(tx,key=lambda x:abs(x-n))
                if abs(nearest-n)<=120:
                    findings.append({'file':str(f),'side_effect_line':n,'transaction_line':nearest,'severity':'review','evidence':lines[n-1].strip()[:240]})
    out=pathlib.Path(a.output); out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(json.dumps({'status':'findings' if findings else 'clear','findings':findings},indent=2)+'\n')
    print(out)
    return 1 if findings else 0
if __name__=='__main__': sys.exit(main())
