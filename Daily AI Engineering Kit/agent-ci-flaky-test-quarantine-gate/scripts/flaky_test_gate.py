#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def load(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"file not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}") from exc


def parse_time(value: str) -> datetime:
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except Exception as exc:
        raise ValueError(f"invalid datetime: {value}") from exc
    if dt.tzinfo is None:
        raise ValueError(f"datetime must include timezone: {value}")
    return dt.astimezone(timezone.utc)


def validate_policy(p: Any) -> dict[str, Any]:
    if not isinstance(p, dict):
        raise ValueError("policy must be an object")
    required = ["minimum_observations","minimum_passes","minimum_failures","minimum_failure_rate","maximum_failure_rate","maximum_quarantine_days"]
    for key in required:
        if key not in p:
            raise ValueError(f"policy missing {key}")
    if not 0 <= p["minimum_failure_rate"] <= p["maximum_failure_rate"] <= 1:
        raise ValueError("invalid failure-rate bounds")
    if p["maximum_quarantine_days"] < 1:
        raise ValueError("maximum_quarantine_days must be >= 1")
    return p


def summarize(history: Any, policy: dict[str, Any]) -> list[dict[str, Any]]:
    if not isinstance(history, dict) or not isinstance(history.get("observations"), list):
        raise ValueError("history.observations must be an array")
    by_test: dict[str, list[dict[str, Any]]] = defaultdict(list)
    seen: set[tuple[str,str,int]] = set()
    for obs in history["observations"]:
        if not isinstance(obs, dict):
            raise ValueError("observation must be object")
        test, status, run_id = obs.get("test"), obs.get("status"), obs.get("run_id")
        attempt = obs.get("attempt", 1)
        if not isinstance(test, str) or not test or status not in {"passed","failed"} or not isinstance(run_id, str) or not run_id:
            raise ValueError("observation requires test, passed|failed status, and run_id")
        if not isinstance(attempt, int) or attempt < 1:
            raise ValueError("attempt must be positive integer")
        key = (test, run_id, attempt)
        if key in seen:
            raise ValueError(f"duplicate execution observation: {key}")
        seen.add(key)
        by_test[test].append(obs)
    result = []
    for test, observations in sorted(by_test.items()):
        total = len(observations)
        failures = sum(o["status"] == "failed" for o in observations)
        passes = total - failures
        rate = failures / total if total else 0
        eligible = (
            total >= policy["minimum_observations"] and
            failures >= policy["minimum_failures"] and
            passes >= policy["minimum_passes"] and
            policy["minimum_failure_rate"] <= rate <= policy["maximum_failure_rate"]
        )
        result.append({"test":test,"observations":total,"passes":passes,"failures":failures,"failure_rate":round(rate,4),"flaky_candidate":eligible})
    return result


def validate_quarantine(q: Any, policy: dict[str, Any], now: datetime) -> tuple[dict[str,dict[str,Any]], list[dict[str,Any]]]:
    if not isinstance(q, dict) or not isinstance(q.get("entries"), list):
        raise ValueError("quarantine.entries must be an array")
    entries = {}
    findings = []
    for e in q["entries"]:
        if not isinstance(e, dict) or not isinstance(e.get("test"), str) or not e["test"]:
            raise ValueError("quarantine entry requires test")
        if e["test"] in entries:
            raise ValueError(f"duplicate quarantine entry: {e['test']}")
        entries[e["test"]] = e
        for field in ("owner","issue","reason","approved_by","created_at","expires_at"):
            if not isinstance(e.get(field), str) or not e[field].strip():
                findings.append({"severity":"blocking","kind":"missing_quarantine_field","test":e["test"],"field":field})
        try:
            created = parse_time(e.get("created_at", "")); expires = parse_time(e.get("expires_at", ""))
            if expires <= now:
                findings.append({"severity":"blocking","kind":"expired_quarantine","test":e["test"],"expires_at":e["expires_at"]})
            days = (expires - created).total_seconds()/86400
            if days > policy["maximum_quarantine_days"]:
                findings.append({"severity":"blocking","kind":"quarantine_too_long","test":e["test"],"days":round(days,2)})
            if expires <= created:
                findings.append({"severity":"blocking","kind":"invalid_quarantine_window","test":e["test"]})
        except ValueError:
            findings.append({"severity":"blocking","kind":"invalid_quarantine_datetime","test":e["test"]})
    return entries, findings


def evaluate(history: Any, quarantine: Any, policy: dict[str, Any], now: datetime) -> dict[str, Any]:
    tests = summarize(history, policy)
    qmap, findings = validate_quarantine(quarantine, policy, now)
    candidates = {x["test"] for x in tests if x["flaky_candidate"]}
    observed = {x["test"] for x in tests}
    for test in sorted(qmap):
        if test not in observed:
            findings.append({"severity":"blocking","kind":"quarantined_test_missing_history","test":test})
        elif test not in candidates:
            findings.append({"severity":"blocking","kind":"quarantine_without_flaky_evidence","test":test})
    for test in sorted(candidates - set(qmap)):
        findings.append({"severity":"review","kind":"flaky_candidate_not_quarantined","test":test})
    blocking = sum(f["severity"] == "blocking" for f in findings)
    return {"status":"fail" if blocking else "pass","summary":{"blocking":blocking,"review":sum(f["severity"]=="review" for f in findings),"tests":len(tests)},"tests":tests,"findings":findings}


def main() -> int:
    ap = argparse.ArgumentParser(description="Evidence-based flaky test quarantine gate")
    ap.add_argument("--history", required=True, type=Path)
    ap.add_argument("--quarantine", required=True, type=Path)
    ap.add_argument("--policy", required=True, type=Path)
    ap.add_argument("--output", required=True, type=Path)
    ap.add_argument("--now", help="ISO-8601 time override for deterministic CI/tests")
    a = ap.parse_args()
    try:
        now = parse_time(a.now) if a.now else datetime.now(timezone.utc)
        policy = validate_policy(load(a.policy))
        report = evaluate(load(a.history), load(a.quarantine), policy, now)
    except ValueError as exc:
        print(f"validation error: {exc}", file=sys.stderr)
        return 2
    a.output.parent.mkdir(parents=True, exist_ok=True)
    a.output.write_text(json.dumps(report, indent=2, sort_keys=True)+"\n", encoding="utf-8")
    if report["status"] == "fail":
        print(f"flaky test gate failed: {report['summary']['blocking']} blocking finding(s)", file=sys.stderr)
        return 1
    print(f"flaky test gate passed: {report['summary']}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
