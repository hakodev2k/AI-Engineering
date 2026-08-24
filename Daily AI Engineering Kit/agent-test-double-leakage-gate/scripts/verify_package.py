#!/usr/bin/env python3
import json,subprocess,sys,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REQ=['README.md','config/leakage-policy.json','schemas/leakage-report.schema.json','scripts/scan_test_double_leakage.py','scripts/verify_package.py','skills/detect-test-double-leakage.md','skills/remediate-test-double-leakage.md','rules/test-double-boundaries.md','subagents/leakage-investigator.md','subagents/verification-agent.md','workflows/leakage-prevention.md','hooks/pre-merge-scan.md','hooks/final-verification.md','tests/test_scan_test_double_leakage.py']
def run(cmd,cwd,expected):
 r=subprocess.run(cmd,cwd=cwd,text=True,capture_output=True,check=False)
 if r.returncode not in expected: raise RuntimeError(f"exit {r.returncode}: {' '.join(cmd)}\n{r.stdout}\n{r.stderr}")
 return r
def main():
 missing=[x for x in REQ if not (ROOT/x).is_file()]
 if missing: print('missing: '+', '.join(missing),file=sys.stderr); return 1
 for x in ['config/leakage-policy.json','schemas/leakage-report.schema.json']: json.loads((ROOT/x).read_text(encoding='utf-8'))
 run([sys.executable,'-m','unittest','discover','-s','tests','-p','test_*.py'],ROOT,{0})
 scanner=ROOT/'scripts/scan_test_double_leakage.py'; policy=ROOT/'config/leakage-policy.json'
 with tempfile.TemporaryDirectory() as t:
  repo=Path(t); (repo/'src').mkdir(); f=repo/'src/service.py'; f.write_text("client = RealClient()\n",encoding='utf-8')
  if json.loads(run([sys.executable,str(scanner),'--root',str(repo),'--policy',str(policy)],ROOT,{0}).stdout)['status']!='clean': raise RuntimeError('clean scenario failed')
  f.write_text("client = FakeClient()\n",encoding='utf-8')
  if json.loads(run([sys.executable,str(scanner),'--root',str(repo),'--policy',str(policy)],ROOT,{2}).stdout)['blocking_findings']<1: raise RuntimeError('blocked scenario failed')
 print('Package verification passed.'); return 0
if __name__=='__main__': raise SystemExit(main())