#!/usr/bin/env python3
"""Verify expected hook authorization decisions from unit or runtime evidence."""
from __future__ import annotations
import argparse, json, os, subprocess, sys
from pathlib import Path

VALID = {"allow", "deny", "ask", "defer"}


def load_cases(path: Path):
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list) or not data:
        raise ValueError("cases must be a non-empty JSON array")
    seen=set(); out=[]
    for i,c in enumerate(data):
        if not isinstance(c,dict): raise ValueError(f"case {i} is not an object")
        cid=c.get("id"); expected=c.get("expected")
        if not isinstance(cid,str) or not cid or cid in seen: raise ValueError(f"invalid/duplicate case id at index {i}")
        if expected not in VALID: raise ValueError(f"case {cid}: expected must be one of {sorted(VALID)}")
        if not isinstance(c.get("input"),dict): raise ValueError(f"case {cid}: input must be object")
        seen.add(cid); out.append(c)
    return out


def decision_from_output(returncode: int, stdout: str):
    if returncode == 2:
        return "deny"
    if returncode != 0:
        raise RuntimeError(f"hook exited {returncode}")
    if not stdout.strip():
        return "defer"
    obj=json.loads(stdout)
    if not isinstance(obj,dict): raise ValueError("hook stdout JSON must be object")
    candidates=[
        obj.get("permissionDecision"), obj.get("behavior"), obj.get("decision"),
        (obj.get("hookSpecificOutput") or {}).get("permissionDecision") if isinstance(obj.get("hookSpecificOutput"),dict) else None,
    ]
    for value in candidates:
        if value in VALID: return value
    return "defer"


def safe_env():
    keep=("PATH","HOME","USERPROFILE","TMPDIR","TMP","TEMP","SystemRoot","WINDIR","LANG","LC_ALL")
    return {k:os.environ[k] for k in keep if k in os.environ}


def run_hook(path: Path, payload: dict, timeout: float):
    if not path.exists() or not path.is_file(): raise ValueError(f"hook not found: {path}")
    cmd=[str(path.resolve())]
    if path.suffix.lower()==".py": cmd=[sys.executable,str(path.resolve())]
    p=subprocess.run(cmd,input=json.dumps(payload),text=True,capture_output=True,timeout=timeout,env=safe_env(),shell=False)
    return decision_from_output(p.returncode,p.stdout)


def load_observations(path: Path):
    result={}
    with path.open("r",encoding="utf-8") as f:
        for n,line in enumerate(f,1):
            if not line.strip(): continue
            obj=json.loads(line); cid=obj.get("id"); actual=obj.get("actual")
            if not isinstance(cid,str) or actual not in VALID: raise ValueError(f"observation line {n}: invalid id/actual")
            if cid in result: raise ValueError(f"duplicate observation id: {cid}")
            result[cid]=actual
    return result


def compare(cases, actuals):
    rows=[]; failed=False
    for c in cases:
        actual=actuals.get(c["id"])
        ok=actual==c["expected"]
        if not ok: failed=True
        rows.append({"id":c["id"],"expected":c["expected"],"actual":actual,"ok":ok})
    return rows,failed


def main(argv=None):
    p=argparse.ArgumentParser()
    p.add_argument("--cases",type=Path,required=True)
    mode=p.add_mutually_exclusive_group(required=True)
    mode.add_argument("--hook",type=Path)
    mode.add_argument("--observed-jsonl",type=Path)
    p.add_argument("--timeout",type=float,default=5.0)
    a=p.parse_args(argv)
    if a.timeout<=0:
        print(json.dumps({"error":"timeout must be > 0"}),file=sys.stderr); return 21
    try:
        cases=load_cases(a.cases)
        if a.hook:
            actuals={c["id"]:run_hook(a.hook,c["input"],a.timeout) for c in cases}
        else:
            actuals=load_observations(a.observed_jsonl)
            unknown=set(actuals)-{c["id"] for c in cases}
            if unknown: raise ValueError(f"unknown observation ids: {sorted(unknown)}")
        rows,failed=compare(cases,actuals)
        print(json.dumps({"passed":not failed,"cases":rows},sort_keys=True))
        return 20 if failed else 0
    except subprocess.TimeoutExpired:
        print(json.dumps({"error":"hook timeout"}),file=sys.stderr); return 21
    except Exception as exc:
        print(json.dumps({"error":str(exc)}),file=sys.stderr); return 21

if __name__=="__main__": raise SystemExit(main())
