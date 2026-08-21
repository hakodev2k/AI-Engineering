#!/usr/bin/env python3
"""Detect disproportionate prompt-cache rewrites from chronological JSONL usage records.

Each line must be an object with: request_id, cache_read_tokens,
cache_creation_tokens. Optional previous_prefix_tokens overrides the inferred
prefix (previous cache_read + cache_creation). Exit 0 pass, 2 invalid input,
4 policy violation.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path


def load_json(path: Path):
    try:
        obj=json.loads(path.read_text(encoding="utf-8"))
    except (OSError,json.JSONDecodeError) as e:
        raise ValueError(f"cannot read {path}: {e}") from e
    if not isinstance(obj,dict): raise ValueError("policy must be an object")
    return obj


def nonneg(v,name):
    if not isinstance(v,(int,float)) or isinstance(v,bool) or v < 0:
        raise ValueError(f"{name} must be a non-negative number")
    return float(v)


def records(path: Path):
    try: lines=path.read_text(encoding="utf-8").splitlines()
    except OSError as e: raise ValueError(f"cannot read {path}: {e}") from e
    out=[]
    for n,line in enumerate(lines,1):
        if not line.strip(): continue
        try: d=json.loads(line)
        except json.JSONDecodeError as e: raise ValueError(f"line {n}: invalid JSON: {e}") from e
        if not isinstance(d,dict): raise ValueError(f"line {n}: object required")
        rid=d.get("request_id")
        if not isinstance(rid,str) or not rid: raise ValueError(f"line {n}: request_id required")
        out.append((rid,nonneg(d.get("cache_read_tokens"),"cache_read_tokens"),nonneg(d.get("cache_creation_tokens"),"cache_creation_tokens"),d))
    if not out: raise ValueError("trace contains no records")
    return out


def main():
    ap=argparse.ArgumentParser(); ap.add_argument("trace",type=Path); ap.add_argument("--policy",type=Path,required=True); a=ap.parse_args()
    try:
        policy=load_json(a.policy); rows=records(a.trace)
        max_ratio=float(policy.get("max_rewrite_ratio",0.05)); min_prefix=float(policy.get("min_previous_prefix_tokens",10000)); max_create=float(policy.get("max_cache_creation_tokens_per_request",50000))
        if not 0 <= max_ratio <= 1 or min_prefix < 0 or max_create < 0: raise ValueError("invalid policy thresholds")
        violations=[]; report=[]; prev_prefix=None
        for rid,read,create,d in rows:
            prefix=nonneg(d["previous_prefix_tokens"],"previous_prefix_tokens") if "previous_prefix_tokens" in d else prev_prefix
            ratio=(create/prefix) if prefix and prefix >= min_prefix else None
            reasons=[]
            if create > max_create: reasons.append(f"cache_creation {create:.0f} > {max_create:.0f}")
            if ratio is not None and ratio > max_ratio: reasons.append(f"rewrite_ratio {ratio:.4f} > {max_ratio:.4f}")
            if reasons: violations.append({"request_id":rid,"reasons":reasons})
            report.append({"request_id":rid,"cache_read_tokens":read,"cache_creation_tokens":create,"previous_prefix_tokens":prefix,"rewrite_ratio":round(ratio,6) if ratio is not None else None})
            prev_prefix=read+create
        print(json.dumps({"status":"fail" if violations else "pass","requests":report,"violations":violations},indent=2))
        return 4 if violations else 0
    except (ValueError,TypeError) as e:
        print(json.dumps({"status":"invalid","error":str(e)}),file=sys.stderr); return 2

if __name__ == "__main__": raise SystemExit(main())
