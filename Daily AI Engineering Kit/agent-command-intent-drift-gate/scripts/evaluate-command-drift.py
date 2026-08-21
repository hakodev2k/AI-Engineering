#!/usr/bin/env python3
import argparse
import hashlib
import json
import sys
from pathlib import Path


def canonical(v):
    return json.dumps(v, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def digest(v):
    return hashlib.sha256(canonical(v).encode("utf-8")).hexdigest()


def normalize_executable(value, policy):
    value = value.strip()
    return value if policy.get("normalization", {}).get("case_sensitive_executable", False) else value.lower()


def normalize_args(values, policy):
    return [" ".join(x.split()) if policy.get("normalization", {}).get("collapse_whitespace", True) else x for x in values]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--intent", required=True)
    ap.add_argument("--execution", required=True)
    ap.add_argument("--policy", required=True)
    ap.add_argument("--output", required=True)
    ns = ap.parse_args()
    try:
        intent = json.load(open(ns.intent, encoding="utf-8"))
        execution = json.load(open(ns.execution, encoding="utf-8"))
        policy = json.load(open(ns.policy, encoding="utf-8"))
        blockers, warnings = [], []
        if execution.get("intent_id") != intent.get("intent_id"):
            blockers.append("intent-id-mismatch")
        if normalize_executable(execution["executable"], policy) != normalize_executable(intent["executable"], policy):
            blockers.append("executable-drift")
        if execution["target"].strip() != intent["target"].strip():
            blockers.append("target-drift")
        if execution["environment"].strip().lower() != intent["environment"].strip().lower():
            blockers.append("environment-drift")
        order = {"read-only": 0, "local-write": 1, "remote-write": 2, "destructive": 3}
        if order[execution["side_effect"]] > order[intent["side_effect"]]:
            blockers.append("side-effect-escalation")
        elif execution["side_effect"] != intent["side_effect"]:
            warnings.append("side-effect-changed")
        expected_args = normalize_args(intent.get("arguments", []), policy)
        actual_args = normalize_args(execution.get("arguments", []), policy)
        if expected_args != actual_args:
            expected = set(expected_args)
            actual = set(actual_args)
            added = sorted(actual - expected)
            removed = sorted(expected - actual)
            if added:
                blockers.append("unreviewed-arguments-added:" + ",".join(added))
            if removed:
                warnings.append("reviewed-arguments-removed:" + ",".join(removed))
            if not added and not removed:
                warnings.append("argument-order-drift")
        status = "blocked" if blockers else ("review-required" if warnings else "pass")
        normalized_intent = dict(intent)
        normalized_intent["executable"] = normalize_executable(intent["executable"], policy)
        normalized_intent["arguments"] = expected_args
        normalized_intent["environment"] = intent["environment"].strip().lower()
        normalized_intent["target"] = intent["target"].strip()
        result = {
            "version": "1.0",
            "status": status,
            "intent_id": intent["intent_id"],
            "intent_fingerprint": digest(normalized_intent),
            "policy_fingerprint": digest(policy),
            "execution_fingerprint": digest(execution),
            "blockers": sorted(set(blockers)),
            "warnings": sorted(set(warnings))
        }
        result["decision_fingerprint"] = digest(result)
        Path(ns.output).write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(json.dumps({"status": status, "decision_fingerprint": result["decision_fingerprint"]}))
        return 2 if status == "blocked" else (3 if status == "review-required" else 0)
    except Exception as exc:
        print(json.dumps({"status": "error", "error": str(exc)}))
        return 1


if __name__ == "__main__":
    sys.exit(main())
