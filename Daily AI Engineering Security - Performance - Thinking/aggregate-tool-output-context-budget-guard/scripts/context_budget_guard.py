#!/usr/bin/env python3
import argparse, json
from pathlib import Path


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def est_tokens(text, chars_per_token):
    return max(1, int((len(text) + chars_per_token - 1) // chars_per_token))


def evaluate(event, cfg):
    cpt = float(cfg.get("approx_chars_per_token", 4.0))
    existing = int(event.get("existing_context_tokens", 0))
    retry_count = int(event.get("identical_overflow_retries", 0))
    results = event.get("tool_results", [])
    if not isinstance(results, list):
        return {"ok": False, "decision": "block", "reasons": ["tool_results_not_list"]}

    measured = []
    total = 0
    over_individual = []
    for i, item in enumerate(results):
        if not isinstance(item, dict) or "content" not in item:
            return {"ok": False, "decision": "block", "reasons": [f"invalid_tool_result:{i}"]}
        tok = int(item.get("tokens") or est_tokens(str(item["content"]), cpt))
        total += tok
        measured.append({"index": i, "tool": item.get("tool", "unknown"), "tokens": tok, "priority": item.get("priority", "normal")})
        if tok > int(cfg["max_tool_result_tokens"]):
            over_individual.append(i)

    usable = int(cfg["model_context_tokens"]) - int(cfg["reserved_output_tokens"]) - int(cfg["safety_margin_tokens"])
    projected = existing + total
    reasons = []
    if total > int(cfg["max_tool_turn_tokens"]): reasons.append("aggregate_tool_turn_budget_exceeded")
    if projected > usable: reasons.append("projected_context_budget_exceeded")
    if over_individual: reasons.append("individual_tool_result_budget_exceeded")
    if reasons and retry_count > int(cfg.get("max_identical_overflow_retries", 1)):
        reasons.append("identical_overflow_retry_limit_exceeded")

    return {"ok": not reasons, "decision": "admit" if not reasons else "externalize_or_summarize", "existing_context_tokens": existing, "tool_turn_tokens": total, "projected_input_tokens": projected, "usable_input_budget": usable, "individual_over_budget": over_individual, "results": measured, "reasons": reasons}


def main():
    ap=argparse.ArgumentParser(description="Preflight aggregate tool-output context budget")
    ap.add_argument("--event",required=True); ap.add_argument("--config",required=True)
    a=ap.parse_args()
    try: r=evaluate(load(a.event),load(a.config))
    except Exception as e:
        print(json.dumps({"ok":False,"error":str(e)})); return 2
    print(json.dumps(r,indent=2,sort_keys=True)); return 0 if r["ok"] else 3

if __name__=="__main__": raise SystemExit(main())
