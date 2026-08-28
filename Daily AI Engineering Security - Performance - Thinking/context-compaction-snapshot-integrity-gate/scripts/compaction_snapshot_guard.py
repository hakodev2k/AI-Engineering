#!/usr/bin/env python3
"""Validate context-token snapshot semantics before destructive auto-compaction."""
import argparse, json
from pathlib import Path

REQUIRED=("context_window","persisted_total_tokens","latest_context_tokens","snapshot_source","cumulative_run_tokens")

def evaluate(s, policy):
    missing=[k for k in REQUIRED if k not in s]
    if missing: return {"ok":False,"decision":"block","reasons":["missing:"+k for k in missing]}
    nums=("context_window","persisted_total_tokens","latest_context_tokens","cumulative_run_tokens")
    if any(not isinstance(s[k],int) or s[k] < 0 for k in nums) or s["context_window"] < 1:
        return {"ok":False,"decision":"block","reasons":["invalid_numeric_field"]}
    reasons=[]; warnings=[]
    latest=s["latest_context_tokens"]; persisted=s["persisted_total_tokens"]; window=s["context_window"]
    source=s["snapshot_source"]
    if source not in policy.get("trusted_snapshot_sources",[]): reasons.append("untrusted_snapshot_source")
    ratio=(persisted/max(1,latest))
    if ratio > policy.get("max_persisted_to_latest_ratio",1.25): reasons.append("persisted_snapshot_inflated_vs_latest")
    transcript=s.get("transcript_estimate_tokens")
    if transcript is not None:
        if not isinstance(transcript,int) or transcript < 0: reasons.append("invalid_transcript_estimate")
        else:
            drift=abs(latest-transcript)/max(1,transcript)
            if drift > policy.get("max_transcript_estimate_drift_ratio",.25): reasons.append("latest_snapshot_disagrees_with_transcript_estimate")
    cumulative=s["cumulative_run_tokens"]
    if cumulative > latest*2 and persisted >= cumulative*.9: reasons.append("persisted_value_looks_like_cumulative_run_usage")
    utilization=latest/window
    threshold=policy.get("auto_compact_utilization",.8)
    requested=bool(s.get("compaction_requested",False))
    if requested and utilization < threshold: reasons.append("compaction_requested_below_trusted_threshold")
    if cumulative > window and utilization < threshold: warnings.append("cumulative_usage_exceeds_window_but_latest_context_does_not")
    if reasons:
        return {"ok":False,"decision":"suppress-auto-compaction-and-recompute","reasons":sorted(set(reasons)),"warnings":warnings,"metrics":{"latest_utilization":utilization,"persisted_to_latest_ratio":ratio}}
    return {"ok":True,"decision":"allow-compaction" if requested and utilization>=threshold else "no-compaction-needed","reasons":[],"warnings":warnings,"metrics":{"latest_utilization":utilization,"persisted_to_latest_ratio":ratio}}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--input",required=True); ap.add_argument("--policy",required=True); a=ap.parse_args()
    try:
        s=json.loads(Path(a.input).read_text(encoding="utf-8")); p=json.loads(Path(a.policy).read_text(encoding="utf-8")); r=evaluate(s,p)
    except Exception as e:
        print(json.dumps({"ok":False,"error":str(e)})); return 2
    print(json.dumps(r,indent=2,sort_keys=True)); return 0 if r["ok"] else 3
if __name__=="__main__": raise SystemExit(main())
