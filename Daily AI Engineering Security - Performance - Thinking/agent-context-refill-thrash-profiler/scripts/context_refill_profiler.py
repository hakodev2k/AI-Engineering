#!/usr/bin/env python3
"""Profile post-compaction context refill and enforce token budgets.

Input JSONL: one record per context contribution or compaction event.
Contribution fields:
  turn:int, event:"context", source:str, tokens:int,
  fingerprint:str|optional, artifact_id:str|optional, required:bool|optional
Compaction fields:
  turn:int, event:"compact"

Exit codes: 0 pass, 2 policy violation, 3 invalid input/config, 4 I/O error.
The script is read-only and never sends content to a model/provider.
"""
from __future__ import annotations
import argparse, json, sys
from collections import Counter, defaultdict
from pathlib import Path


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read config: {exc}") from exc


def load_jsonl(path: Path):
    rows=[]
    try:
        for i,line in enumerate(path.read_text(encoding="utf-8").splitlines(),1):
            if not line.strip(): continue
            try: row=json.loads(line)
            except json.JSONDecodeError as exc: raise ValueError(f"line {i}: invalid JSON: {exc}") from exc
            if not isinstance(row,dict) or not isinstance(row.get("turn"),int) or row.get("event") not in {"context","compact"}:
                raise ValueError(f"line {i}: require turn:int and event=context|compact")
            if row["event"]=="context":
                if not isinstance(row.get("source"),str) or not isinstance(row.get("tokens"),int) or row["tokens"]<0:
                    raise ValueError(f"line {i}: context requires source:str and tokens>=0")
            rows.append(row)
        return rows
    except OSError as exc: raise ValueError(f"cannot read input: {exc}") from exc


def profile(rows, policy):
    window=int(policy["context_window_tokens"]); n=int(policy["post_compact_turns"])
    static=set(policy.get("static_sources",[])); required_sources=set(policy.get("required_reference_sources",[]))
    compact_turns=sorted(r["turn"] for r in rows if r["event"]=="compact")
    context=[r for r in rows if r["event"]=="context"]
    total=sum(r["tokens"] for r in context)
    attributed=sum(r["tokens"] for r in context if r.get("source") and r["source"]!="other")
    fingerprints=default(list)
    for r in context:
        if r.get("fingerprint") and r["source"] in static: fingerprints[r["fingerprint"]].append(r)
    duplicate_static=sum(sum(x["tokens"] for x in rs[1:]) for rs in fingerprints.values() if len(rs)>1)
    duplicate_ratio=duplicate_static/total if total else 0.0
    missing_refs=[r for r in context if (r.get("required") or r["source"] in required_sources) and not r.get("artifact_id")]
    cycles=[]; violations=[]
    for ct in compact_turns:
        subset=[r for r in context if ct < r["turn"] <= ct+n]
        refill=sum(r["tokens"] for r in subset); by=Counter()
        for r in subset: by[r["source"]]+=r["tokens"]
        ratio=refill/window if window else 0
        max_source=max(by.values(),default=0)/window if window else 0
        cycle={"compact_turn":ct,"refill_tokens":refill,"refill_ratio":round(ratio,6),"tokens_per_turn":round(refill/max(n,1),2),"by_source":dict(by)}
        cycles.append(cycle)
        if ratio>float(policy["max_refill_ratio_after_window"]): violations.append(f"turn {ct}: refill_ratio {ratio:.3f} exceeds budget")
        if max_source>float(policy["max_single_source_ratio"]): violations.append(f"turn {ct}: one source consumed {max_source:.3f} of context window")
    for ct in compact_turns:
        count=sum(1 for x in compact_turns if ct <= x < ct+20)
        if count>int(policy["max_compactions_in_20_turns"]):
            violations.append(f"turn {ct}: {count} compactions within 20 turns"); break
    coverage=attributed/total if total else 1.0
    if coverage<float(policy["minimum_attribution_coverage"]): violations.append(f"attribution coverage {coverage:.3f} below minimum")
    if duplicate_ratio>float(policy["max_duplicate_static_ratio"]): violations.append(f"duplicate static ratio {duplicate_ratio:.3f} exceeds budget")
    if missing_refs and policy.get("fail_on_missing_required_reference",True): violations.append(f"{len(missing_refs)} required context records lack artifact_id")
    return {"total_context_tokens":total,"compaction_count":len(compact_turns),"duplicate_static_tokens":duplicate_static,"duplicate_static_ratio":round(duplicate_ratio,6),"attribution_coverage":round(coverage,6),"missing_required_references":len(missing_refs),"post_compaction_cycles":cycles,"violations":violations,"status":"PASS" if not violations else "FAIL"}


def main():
    p=argparse.ArgumentParser(); p.add_argument("input",type=Path); p.add_argument("--policy",type=Path,required=True); p.add_argument("--output",type=Path)
    a=p.parse_args()
    try:
        report=profile(load_jsonl(a.input),load_json(a.policy)); text=json.dumps(report,indent=2,sort_keys=True)
        if a.output: a.output.write_text(text+"\n",encoding="utf-8")
        else: print(text)
        return 0 if report["status"]=="PASS" else 2
    except (ValueError,KeyError,TypeError) as exc:
        print(f"ERROR: {exc}",file=sys.stderr); return 3
    except OSError as exc:
        print(f"ERROR: {exc}",file=sys.stderr); return 4

if __name__=="__main__": raise SystemExit(main())
