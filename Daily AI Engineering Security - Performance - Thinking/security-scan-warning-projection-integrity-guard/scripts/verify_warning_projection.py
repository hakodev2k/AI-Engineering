#!/usr/bin/env python3
"""Verify warning preservation across canonical scan results and projections.

Canonical JSON shape:
  {"warnings":[{"code":"TARGET_DRIFT","target":"repo-a","message":"...","level":"warning"}]}

Projection JSON shape (generic):
  {"warnings":[...]}
SARIF is also accepted; warning notifications are read from
runs[].invocations[].toolExecutionNotifications[].

Exit codes: 0 verified, 2 invalid input, 3 integrity failure.
"""
from __future__ import annotations
import argparse, hashlib, json, re, sys
from pathlib import Path


def load(path: Path):
    try:
        value=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value,dict): raise ValueError(f"{path} must contain a JSON object")
    return value


def clean(s: str) -> str:
    s=re.sub(r"\s+"," ",s.strip())
    s=re.sub(r"\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z\b","<time>",s)
    return s


def warning_key(w: dict) -> str:
    if not isinstance(w,dict): raise ValueError("warning entries must be objects")
    code=str(w.get("code") or w.get("ruleId") or w.get("id") or "warning")
    target=str(w.get("target") or w.get("repository") or w.get("uri") or "")
    msg=w.get("message","")
    if isinstance(msg,dict): msg=msg.get("text","")
    msg=clean(str(msg))
    if not msg: raise ValueError("warning message must be non-empty")
    raw="\x1f".join((clean(code),clean(target),msg)).encode()
    return hashlib.sha256(raw).hexdigest()[:24]


def canonical_warnings(doc: dict):
    rows=doc.get("warnings",[])
    if not isinstance(rows,list): raise ValueError("canonical warnings must be an array")
    return rows


def projected_warnings(doc: dict):
    if isinstance(doc.get("warnings"),list): return doc["warnings"]
    rows=[]
    runs=doc.get("runs")
    if isinstance(runs,list):
        for run in runs:
            if not isinstance(run,dict): continue
            for inv in run.get("invocations",[]) if isinstance(run.get("invocations",[]),list) else []:
                if not isinstance(inv,dict): continue
                notes=inv.get("toolExecutionNotifications",[])
                if not isinstance(notes,list): continue
                for n in notes:
                    if isinstance(n,dict) and str(n.get("level","warning")) in {"warning","error","note"}:
                        rows.append(n)
    return rows


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("canonical",type=Path)
    p.add_argument("projections",type=Path,nargs="+")
    args=p.parse_args()
    try:
        base=canonical_warnings(load(args.canonical))
        expected={warning_key(w) for w in base}
        reports=[]; failed=False
        for path in args.projections:
            rows=projected_warnings(load(path)); actual={warning_key(w) for w in rows}
            missing=sorted(expected-actual); orphan=sorted(actual-expected)
            ratio=1.0 if not expected else (len(expected & actual)/len(expected))
            reports.append({"projection":str(path),"expected":len(expected),"observed":len(actual),"preservation_ratio":round(ratio,4),"missing":missing,"orphan":orphan})
            failed = failed or bool(missing)
        print(json.dumps({"verified":not failed,"canonical_warning_count":len(expected),"projections":reports},indent=2))
        return 3 if failed else 0
    except (ValueError,TypeError) as exc:
        print(json.dumps({"verified":False,"error":str(exc)}),file=sys.stderr)
        return 2

if __name__=="__main__": raise SystemExit(main())
