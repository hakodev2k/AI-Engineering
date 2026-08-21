#!/usr/bin/env python3
"""Gate branch-controlled AI review context before security review.

Input JSON:
{
  "changed_paths": ["src/a.cs", ".github/copilot-instructions.md"],
  "approved_head_instruction_changes": false,
  "independent_security_evidence": ["codeql:pass", "tests:pass"]
}
Exit: 0 allow, 2 invalid, 3 review required/block.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

def load(path: Path):
    try: v=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc: raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(v,dict): raise ValueError(f"{path} must contain an object")
    return v

def matches(path: str, patterns: list[str]) -> bool:
    p=path.lstrip("./")
    for pattern in patterns:
        q=pattern.lstrip("./")
        if q.endswith("/") and p.startswith(q): return True
        if p == q: return True
    return False

def analyze(data, policy):
    paths=data.get("changed_paths",[]); evidence=data.get("independent_security_evidence",[])
    if not isinstance(paths,list) or not all(isinstance(x,str) and x for x in paths): raise ValueError("changed_paths must be non-empty strings")
    if not isinstance(evidence,list) or not all(isinstance(x,str) and x for x in evidence): raise ValueError("independent_security_evidence must be strings")
    approved=data.get("approved_head_instruction_changes",False)
    if not isinstance(approved,bool): raise ValueError("approved_head_instruction_changes must be boolean")
    pats=policy.get("trusted_instruction_patterns",[])
    if not isinstance(pats,list) or not all(isinstance(x,str) for x in pats): raise ValueError("trusted_instruction_patterns must be strings")
    changed_ctx=sorted([p for p in paths if matches(p,pats)])
    findings=[]
    if changed_ctx and policy.get("require_explicit_approval_for_head_instruction_changes",True) and not approved:
        findings.append("head-branch reviewer-context changes require explicit approval")
    if policy.get("require_independent_security_evidence",True) and not evidence:
        findings.append("independent security evidence missing")
    return {
        "decision":"allow" if not findings else "review_required",
        "changed_review_context_paths":changed_ctx,
        "first_pass_metadata_quarantine":bool(policy.get("quarantine_pr_metadata_on_first_security_pass",True)),
        "independent_security_evidence":evidence,
        "findings":findings
    }

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("input",type=Path); ap.add_argument("--policy",type=Path,required=True); a=ap.parse_args()
    try: result=analyze(load(a.input),load(a.policy))
    except (ValueError,TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return 2
    print(json.dumps(result,indent=2)); return 0 if result["decision"]=="allow" else 3
if __name__=="__main__": raise SystemExit(main())
