#!/usr/bin/env python3
"""Deterministic watchdog for planning/review loops.

Input JSON must contain:
{
  "plan_approved": true,
  "requirements_changed": false,
  "events": [{"type": "plan|review|source_change|requested_artifact|test_result|acceptance_evidence", "id": "..."}],
  "acceptance_gates": [{"name": "...", "status": "pass|fail|unknown"}]
}
Exit: 0 allowed, 2 invalid input/config, 3 strict policy block.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path


def load(path: Path):
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain an object")
    return value


def analyze(data, cfg):
    events = data.get("events")
    gates = data.get("acceptance_gates", [])
    if not isinstance(events, list) or not all(isinstance(e, dict) and isinstance(e.get("type"), str) for e in events):
        raise ValueError("events must be a list of objects with string type")
    if not isinstance(gates, list) or not all(isinstance(g, dict) and g.get("status") in {"pass","fail","unknown"} for g in gates):
        raise ValueError("acceptance_gates must contain pass/fail/unknown status")
    if not isinstance(data.get("plan_approved", False), bool) or not isinstance(data.get("requirements_changed", False), bool):
        raise ValueError("plan_approved and requirements_changed must be booleans")
    meta = set(cfg.get("meta_event_types", [])); progress = set(cfg.get("progress_event_types", []))
    streak = 0; deltas = 0; plan_regens = 0
    for event in events:
        t = event["type"]
        if t in progress:
            deltas += 1; streak = 0
        elif t in meta:
            streak += 1
            if t in {"plan", "replan"}: plan_regens += 1
        else:
            streak = 0
    max_meta = int(cfg.get("max_consecutive_meta_actions", 3))
    max_regen = int(cfg.get("max_plan_regenerations_without_requirement_change", 1))
    unsatisfied = [g.get("name", "unnamed") for g in gates if g["status"] != "pass"]
    reasons = []
    decision = "continue"
    if data["plan_approved"] and streak >= max_meta:
        decision = "transition_required"; reasons.append("meta-only action limit reached")
    if data["plan_approved"] and not data["requirements_changed"] and plan_regens > max_regen:
        decision = "blocked"; reasons.append("plan regenerated without material requirement change")
    if not unsatisfied and gates:
        decision = "complete_allowed" if decision == "continue" else decision
    elif data.get("claiming_completion", False):
        decision = "blocked"; reasons.append("completion claimed with unsatisfied acceptance gates")
    return {"decision":decision,"consecutive_meta_actions":streak,"deliverable_deltas":deltas,"plan_regenerations":plan_regens,"unsatisfied_gates":unsatisfied,"reasons":reasons}


def main():
    p=argparse.ArgumentParser(); p.add_argument("input",type=Path); p.add_argument("--config",type=Path,required=True); p.add_argument("--strict",action="store_true")
    a=p.parse_args()
    try: result=analyze(load(a.input),load(a.config))
    except (ValueError,TypeError) as exc:
        print(json.dumps({"decision":"invalid","error":str(exc)}),file=sys.stderr); return 2
    print(json.dumps(result,indent=2))
    return 3 if a.strict and result["decision"] in {"blocked","transition_required"} else 0

if __name__ == "__main__": raise SystemExit(main())
