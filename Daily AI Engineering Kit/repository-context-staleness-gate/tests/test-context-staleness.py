#!/usr/bin/env python3
import hashlib, json, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
VALIDATE=ROOT/'scripts'/'validate-context-manifest.py'
CHECK=ROOT/'scripts'/'check-context-staleness.py'
GATE=ROOT/'scripts'/'evaluate-context-gate.py'

def run(args, expect=0):
    p=subprocess.run([sys.executable,*map(str,args)],capture_output=True,text=True)
    if p.returncode!=expect:
        raise AssertionError(f"expected {expect}, got {p.returncode}: {p.stdout} {p.stderr}")
    return p

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def main():
    with tempfile.TemporaryDirectory() as td:
        repo=Path(td)/'repo'; repo.mkdir()
        subprocess.run(['git','init',str(repo)],check=True,capture_output=True)
        subprocess.run(['git','-C',str(repo),'config','user.email','test@example.com'],check=True)
        subprocess.run(['git','-C',str(repo),'config','user.name','Test'],check=True)
        src=repo/'src'; src.mkdir(); f=src/'service.txt'; f.write_text('v1\n')
        subprocess.run(['git','-C',str(repo),'add','.'],check=True)
        subprocess.run(['git','-C',str(repo),'commit','-m','baseline'],check=True,capture_output=True)
        rev=subprocess.check_output(['git','-C',str(repo),'rev-parse','HEAD'],text=True).strip()
        manifest=Path(td)/'manifest.json'
        manifest.write_text(json.dumps({'repository':'test/repo','revision':rev,'scope':['src'],'artifacts':[{'id':'summary','type':'summary','sources':[{'path':'src/service.txt','sha256':sha(f)}]}]},indent=2))
        report=Path(td)/'report.json'; review=Path(td)/'review.json'; gate=Path(td)/'gate.json'
        run([VALIDATE,manifest])
        run([CHECK,manifest,repo,report])
        review.write_text(json.dumps({'reviewer_id':'reviewer','curator_id':'curator','status':'verified','manifest_sha256':sha(manifest)}))
        run([GATE,manifest,report,review,gate])
        assert json.loads(gate.read_text())['status']=='verified'
        f.write_text('v2\n')
        run([CHECK,manifest,repo,report],expect=1)
        run([GATE,manifest,report,review,gate],expect=1)
        assert json.loads(gate.read_text())['status']=='blocked'
    print('smoke tests passed')

if __name__=='__main__': main()
