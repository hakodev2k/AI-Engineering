#!/usr/bin/env python3
"""Verify configured vs effective context-compaction policy from observed runtime values."""
from __future__ import annotations
import argparse, json, math, sys
from pathlib import Path


def load(path):
    try:
        data=json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"invalid JSON: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("input must be a JSON object")
    return data


def num(d,k,positive=True):
    v=d.get(k)
    if not isinstance(v,(int,float)) or isinstance(v,bool) or not math.isfinite(v):
        raise ValueError(f"{k} must be a finite number")
    if positive and v <= 0: raise ValueError(f"{k} must be > 0")
    return float(v)


def main():
    p=argparse.ArgumentParser()
    p.add_argument("input")
    ns=p.parse_args()
    try:
        d=load(ns.input)
        ctx=num(d,"effective_context_tokens")
        eff=num(d,"effective_threshold_tokens")
        cfg=d.get("configured_ratio")
        if cfg is not None:
            cfg=num(d,"configured_ratio")
            if cfg > 1: raise ValueError("configured_ratio must be <= 1")
        max_delta=float(d.get("max_ratio_delta",0.05))
        max_tokens=d.get("max_threshold_tokens")
        eff_ratio=eff/ctx
        reasons=[]
        status="PASS"
        if eff > ctx:
            reasons.append("effective threshold exceeds context window"); status="BLOCK"
        if cfg is not None and abs(eff_ratio-cfg) > max_delta:
            reasons.append(f"configured/effective ratio delta {abs(eff_ratio-cfg):.4f} exceeds {max_delta:.4f}")
            status="BLOCK" if d.get("block_on_ratio_delta",True) else "WARN"
        if max_tokens is not None:
            max_tokens=float(max_tokens)
            if eff > max_tokens:
                reasons.append(f"effective threshold {eff:.0f} exceeds absolute ceiling {max_tokens:.0f}"); status="BLOCK"
        out={"status":status,"effective_context_tokens":int(ctx),"effective_threshold_tokens":int(eff),"effective_ratio":round(eff_ratio,6),"configured_ratio":cfg,"reasons":reasons}
        print(json.dumps(out,indent=2,sort_keys=True))
        return 0 if status=="PASS" else (1 if status=="WARN" else 2)
    except (ValueError,TypeError) as exc:
        print(json.dumps({"status":"BLOCK","reasons":[str(exc)]},indent=2))
        return 2

if __name__ == "__main__":
    raise SystemExit(main())
