#!/usr/bin/env python3
"""Compare expected and effective subagent permission envelopes.

Exit codes:
  0 policy match / allow
  2 policy drift / block
  3 invalid input / block
"""
import argparse
import hashlib
import json
import sys
from pathlib import Path


def load_json(path):
    try:
        value = json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def canonical(obj, ignored):
    return {k: obj[k] for k in sorted(obj) if k not in ignored}


def digest(obj):
    raw = json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def rank(cfg, field, value):
    order = cfg.get("permission_order", {}).get(field, [])
    if value not in order:
        return None
    return order.index(value)


def classify(expected, effective, cfg):
    ignored = set(cfg.get("ignored_fields", []))
    required = cfg.get("required_fields", [])
    missing_expected = [k for k in required if k not in expected]
    missing_effective = [k for k in required if k not in effective]
    if missing_expected or missing_effective:
        return "missing_provenance", {"missing_expected": missing_expected, "missing_effective": missing_effective}

    exp = canonical(expected, ignored)
    eff = canonical(effective, ignored)
    if exp == eff:
        return "match", {}

    diffs = {}
    broadening = False
    restrictive = False
    for key in sorted(set(exp) | set(eff)):
        if exp.get(key) == eff.get(key):
            continue
        diffs[key] = {"expected": exp.get(key), "effective": eff.get(key)}
        if key in cfg.get("permission_order", {}):
            er = rank(cfg, key, exp.get(key))
            ar = rank(cfg, key, eff.get(key))
            if er is None or ar is None:
                return "missing_provenance", {"unknown_permission_value": key, "diffs": diffs}
            if ar > er:
                broadening = True
            elif ar < er:
                restrictive = True

    if expected.get("role") != effective.get("role") or expected.get("policy_version") != effective.get("policy_version"):
        return "stale_role_policy", {"diffs": diffs}
    if broadening:
        return "broadening", {"diffs": diffs}
    if restrictive:
        return "restrictive_drift", {"diffs": diffs}
    return "policy_drift", {"diffs": diffs}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--expected", required=True)
    parser.add_argument("--effective", required=True)
    parser.add_argument("--config", required=True)
    args = parser.parse_args()
    try:
        expected = load_json(args.expected)
        effective = load_json(args.effective)
        cfg = load_json(args.config)
        classification, detail = classify(expected, effective, cfg)
        exp_norm = canonical(expected, set(cfg.get("ignored_fields", [])))
        eff_norm = canonical(effective, set(cfg.get("ignored_fields", [])))
        allow = classification == "match"
        output = {
            "decision": "allow" if allow else "block",
            "classification": classification,
            "expected_hash": digest(exp_norm),
            "effective_hash": digest(eff_norm),
            "detail": detail,
        }
        print(json.dumps(output, sort_keys=True))
        return 0 if allow else 2
    except ValueError as exc:
        print(json.dumps({"decision": "block", "classification": "input_error", "error": str(exc)}, sort_keys=True))
        return 3


if __name__ == "__main__":
    sys.exit(main())
