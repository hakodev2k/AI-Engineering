#!/usr/bin/env python3
"""Measure MCP tool-schema footprint and enforce explicit context budgets.

Input format: JSON array of tools or {"tools": [...]} where each tool may include
name, server, description, inputSchema, outputSchema, annotations.
Exit codes: 0 pass, 2 policy violation, 3 invalid input/config.
"""
from __future__ import annotations
import argparse, json, math, sys
from pathlib import Path


def load(path: str):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"error: cannot read {path}: {exc}", file=sys.stderr); sys.exit(3)


def canonical(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def token_count(text: str, cfg: dict) -> tuple[int, str]:
    mode = cfg.get("tokenizer", "estimate")
    if mode.startswith("tiktoken:"):
        try:
            import tiktoken
            enc = tiktoken.get_encoding(mode.split(":", 1)[1])
            return len(enc.encode(text)), mode
        except Exception as exc:
            print(f"warning: {mode} unavailable ({exc}); using estimate", file=sys.stderr)
    bpt = float(cfg.get("bytes_per_token_estimate", 4.0))
    if bpt <= 0: raise ValueError("bytes_per_token_estimate must be > 0")
    return math.ceil(len(text.encode("utf-8")) / bpt), "estimate"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("tools_json")
    ap.add_argument("--config", required=True)
    ap.add_argument("--baseline", help="Prior report JSON for reduction comparison")
    ap.add_argument("--report", help="Write machine-readable report")
    args = ap.parse_args()
    try:
        raw, cfg = load(args.tools_json), load(args.config)
        tools = raw.get("tools") if isinstance(raw, dict) else raw
        if not isinstance(tools, list): raise ValueError("tools input must be an array or {tools:[...]}")
        hot=set(cfg.get("hot_tools",[])); disabled=set(cfg.get("disabled_tools",[])); required=set(cfg.get("required_tools",[]))
        default=cfg.get("default_mode","deferred")
        if default not in {"hot","deferred","disabled"}: raise ValueError("default_mode invalid")
        rows=[]; total=hot_total=0; hot_count=0; violations=[]
        seen=set()
        for i,t in enumerate(tools):
            if not isinstance(t,dict) or not t.get("name"): raise ValueError(f"tool[{i}] missing name")
            server=str(t.get("server","unknown")); name=str(t["name"]); key=f"{server}::{name}"
            if key in seen: raise ValueError(f"duplicate tool key: {key}")
            seen.add(key)
            mode="disabled" if key in disabled or name in disabled else "hot" if key in hot or name in hot else default
            tokens, method=token_count(canonical(t),cfg)
            total += tokens
            if mode=="hot": hot_total += tokens; hot_count += 1
            if tokens > int(cfg.get("max_tool_tokens",10**9)): violations.append(f"TOOL_BUDGET:{key}:{tokens}")
            rows.append({"key":key,"server":server,"name":name,"tokens":tokens,"mode":mode,"method":method})
        missing=[r for r in required if r not in seen and r not in {x['name'] for x in rows}]
        violations += [f"REQUIRED_TOOL_MISSING:{x}" for x in missing]
        if total > int(cfg.get("max_total_tokens",10**9)): violations.append(f"TOTAL_BUDGET:{total}")
        if hot_total > int(cfg.get("max_hot_tokens",10**9)): violations.append(f"HOT_BUDGET:{hot_total}")
        if hot_count > int(cfg.get("max_hot_tools",10**9)): violations.append(f"HOT_TOOL_COUNT:{hot_count}")
        baseline_total=None; reduction=None
        if args.baseline:
            b=load(args.baseline); baseline_total=int(b.get("total_tokens",0))
            if baseline_total>0:
                reduction=100.0*(baseline_total-total)/baseline_total
                if reduction < float(cfg.get("min_reduction_percent",0)): violations.append(f"REDUCTION:{reduction:.2f}%")
        report={"policy_version":cfg.get("policy_version"),"total_tokens":total,"hot_tokens":hot_total,"hot_tools":hot_count,"baseline_tokens":baseline_total,"reduction_percent":reduction,"violations":violations,"tools":sorted(rows,key=lambda x:x['tokens'],reverse=True)}
        print(json.dumps(report,ensure_ascii=False,indent=2))
        if args.report: Path(args.report).write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        return 2 if violations and cfg.get("fail_on_budget_exceeded",True) else 0
    except (ValueError,TypeError) as exc:
        print(f"error: {exc}",file=sys.stderr); return 3

if __name__ == "__main__": raise SystemExit(main())
