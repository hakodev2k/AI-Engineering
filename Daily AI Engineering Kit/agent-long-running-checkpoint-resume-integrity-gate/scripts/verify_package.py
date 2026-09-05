#!/usr/bin/env python3
import json,subprocess,sys
from pathlib import Path
R=Path(__file__).resolve().parents[1]
REQ=['README.md','config/resume-policy.json','schemas/checkpoint.schema.json','schemas/resume-report.schema.json','scripts/capture_resume_state.py','scripts/resume_integrity_gate.py','scripts/verify_package.py','skills/create-safe-checkpoint.md','skills/validate-resume-context.md','rules/checkpoint-resume-safety.md','subagents/checkpoint-inspector.md','subagents/resume-planner.md','subagents/verification-agent.md','workflows/checkpoint-resume.md','hooks/pre-checkpoint.md','hooks/pre-resume.md','examples/checkpoint-valid.json','examples/current-state-drifted.json','tests/test_resume_integrity_gate.py']
def main():
    missing=[p for p in REQ if not (R/p).is_file()]
    if missing:print('missing:\n'+'\n'.join(missing),file=sys.stderr);return 1
    for p in ['config/resume-policy.json','schemas/checkpoint.schema.json','schemas/resume-report.schema.json','examples/checkpoint-valid.json','examples/current-state-drifted.json']:json.loads((R/p).read_text())
    t=subprocess.run([sys.executable,'-m','unittest','discover','-s','tests','-p','test_*.py'],cwd=R)
    if t.returncode:return t.returncode
    out=R/'.resume-report.json';g=subprocess.run([sys.executable,str(R/'scripts/resume_integrity_gate.py'),'--checkpoint',str(R/'examples/checkpoint-valid.json'),'--current',str(R/'examples/current-state-drifted.json'),'--policy',str(R/'config/resume-policy.json'),'--output',str(out),'--now','2026-09-05T10:00:00Z'],cwd=R)
    if g.returncode!=1:return 1
    report=json.loads(out.read_text());out.unlink(missing_ok=True)
    if report['blocking']<1:return 1
    print('Package verification passed.');return 0
if __name__=='__main__':raise SystemExit(main())
