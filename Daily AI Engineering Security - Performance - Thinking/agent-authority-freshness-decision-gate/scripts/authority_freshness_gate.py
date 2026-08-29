#!/usr/bin/env python3
"""Validate observable decision evidence against authority/freshness policy.

Decision JSON shape:
{
  "action_type": "configuration-change",
  "impact": "high",
  "approval": {"present": true, "scopes": ["configuration-change"]},
  "facts": [
    {"id":"desired_model","critical":true,"source":"desired-state",
     "observed_at":"2026-08-30T01:30:00+07:00","authority_rank":100,
     "source_version":"abc123","current_source_version":"abc123","evidence":"..."}
  ],
  "assumptions": [...], "hypotheses": [...], "decision": "...",
  "risks": [...], "verification_status": "pending"
}

Exit codes: 0 allow, 2 revalidate, 3 block, 1 invalid/runtime error.
"""
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def load(path: str) -> dict[str, Any]:
    obj = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(obj, dict):
        raise ValueError(f"{path}: expected JSON object")
    return obj


def parse_time(value: str) -> datetime:
    dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if dt.tzinfo is None:
        raise ValueError("observed_at must include timezone")
    return dt.astimezone(timezone.utc)


def evaluate(decision: dict[str, Any], registry: dict[str, Any], now: datetime | None = None) -> dict[str, Any]:
    now = (now or datetime.now(timezone.utc)).astimezone(timezone.utc)
    violations: list[dict[str, str]] = []
    refresh: list[str] = []
    sources = registry.get("sources", {})
    min_rank = int(registry.get("minimum_authority_rank", 0))

    for field in ("facts", "assumptions", "hypotheses", "risks"):
        if field not in decision or not isinstance(decision[field], list):
            violations.append({"severity": "block", "code": "missing_decision_structure", "detail": field})
    if not decision.get("decision"):
        violations.append({"severity": "block", "code": "missing_decision", "detail": "decision text required"})

    facts = decision.get("facts", []) if isinstance(decision.get("facts"), list) else []
    for idx, fact in enumerate(facts):
        if not isinstance(fact, dict):
            violations.append({"severity": "block", "code": "invalid_fact", "detail": str(idx)})
            continue
        fid = str(fact.get("id", f"fact-{idx}"))
        if not fact.get("critical", False):
            continue
        source_id = fact.get("source")
        evidence = fact.get("evidence")
        observed = fact.get("observed_at")
        if not source_id or not evidence or not observed:
            violations.append({"severity": "revalidate", "code": "critical_fact_missing_evidence", "detail": fid})
            refresh.append(fid)
            continue
        source_policy = sources.get(source_id)
        if not isinstance(source_policy, dict):
            violations.append({"severity": "revalidate", "code": "unknown_authority_source", "detail": f"{fid}:{source_id}"})
            refresh.append(fid)
            continue
        expected_rank = int(source_policy.get("authority_rank", 0))
        reported_rank = int(fact.get("authority_rank", expected_rank))
        if min(expected_rank, reported_rank) < min_rank:
            violations.append({"severity": "revalidate", "code": "insufficient_authority", "detail": f"{fid}:{source_id}"})
            refresh.append(fid)
        try:
            age = (now - parse_time(str(observed))).total_seconds()
            max_age = int(source_policy.get("max_age_seconds", 0))
            if source_policy.get("mutable", True) and max_age >= 0 and age > max_age:
                violations.append({"severity": "revalidate", "code": "stale_fact", "detail": f"{fid}:age={int(age)}s"})
                refresh.append(fid)
        except ValueError as exc:
            violations.append({"severity": "revalidate", "code": "invalid_observed_at", "detail": f"{fid}:{exc}"})
            refresh.append(fid)
        current_version = fact.get("current_source_version")
        observed_version = fact.get("source_version")
        if source_policy.get("mutable", True) and current_version is not None:
            if observed_version is None or str(observed_version) != str(current_version):
                violations.append({"severity": "revalidate", "code": "source_version_mismatch", "detail": fid})
                refresh.append(fid)

    action = str(decision.get("action_type", ""))
    required_sources = [sid for sid, p in sources.items() if action in p.get("required_for", [])]
    fact_sources = {str(f.get("source")) for f in facts if isinstance(f, dict) and f.get("critical")}
    for sid in required_sources:
        if sid not in fact_sources:
            violations.append({"severity": "revalidate", "code": "required_authority_missing", "detail": sid})
            refresh.append(f"source:{sid}")

    approval = decision.get("approval", {})
    if action in ("scope-expansion", "irreversible-action"):
        if not isinstance(approval, dict) or not approval.get("present"):
            violations.append({"severity": "block", "code": "approval_missing", "detail": action})
        elif action not in approval.get("scopes", []):
            violations.append({"severity": "block", "code": "approval_scope_mismatch", "detail": action})

    if decision.get("self_asserted_approval", False):
        violations.append({"severity": "block", "code": "self_asserted_approval", "detail": "agent prose cannot grant approval"})

    severities = {v["severity"] for v in violations}
    if "block" in severities:
        status = "block"
    elif "revalidate" in severities:
        status = "revalidate"
    else:
        status = "allow"
    return {
        "status": status,
        "violations": violations,
        "facts_to_refresh": sorted(set(refresh)),
        "critical_fact_count": sum(bool(f.get("critical")) for f in facts if isinstance(f, dict)),
        "verification_required": decision.get("impact") == "high" and bool(registry.get("require_independent_verification_for_high_impact", True)),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("decision")
    ap.add_argument("--registry", required=True)
    ap.add_argument("--json-out")
    args = ap.parse_args()
    try:
        report = evaluate(load(args.decision), load(args.registry))
        text = json.dumps(report, indent=2, ensure_ascii=False)
        if args.json_out:
            Path(args.json_out).write_text(text + "\n", encoding="utf-8")
        print(text)
        return {"allow": 0, "revalidate": 2, "block": 3}[report["status"]]
    except (OSError, ValueError, TypeError, json.JSONDecodeError) as exc:
        print(f"authority-freshness-gate error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
