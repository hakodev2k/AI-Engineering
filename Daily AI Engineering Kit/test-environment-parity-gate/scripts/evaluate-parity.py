#!/usr/bin/env python3
import argparse, hashlib, json, os, sys


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def fp(data):
    return hashlib.sha256(json.dumps(data, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def version_major(value):
    if not value:
        return ""
    digits = ""
    started = False
    for ch in str(value):
        if ch.isdigit(): digits += ch; started = True
        elif started: break
    return digits


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--contract", required=True)
    ap.add_argument("--snapshot", required=True)
    ap.add_argument("--policy", required=True)
    ap.add_argument("--output", required=True)
    args = ap.parse_args()
    contract, snap, policy = load(args.contract), load(args.snapshot), load(args.policy)
    gaps, total, matched = [], 0.0, 0.0
    critical_dims = set(policy.get("critical_dimensions", []))
    weights = policy.get("dimension_weights", {})
    for name, expected in contract.get("dimensions", {}).items():
        weight = float(weights.get(name, 0.5)); total += weight
        actual = snap.get("dimensions", {}).get(name)
        if actual is None:
            sev = "critical" if expected.get("required") and name in critical_dims else "high"
            gaps.append({"id": f"{name}:missing", "dimension": name, "severity": sev, "reason": "dimension-missing", "expected": expected, "actual": None})
            continue
        reasons = []
        if str(expected.get("provider", "")).lower() != str(actual.get("provider", "")).lower(): reasons.append("provider-mismatch")
        ev, av = version_major(expected.get("version")), version_major(actual.get("version"))
        if ev and av and ev != av: reasons.append("major-version-mismatch")
        missing_caps = sorted(set(expected.get("capabilities", [])) - set(actual.get("capabilities", [])))
        if missing_caps: reasons.append("missing-capabilities:" + ",".join(missing_caps))
        if reasons:
            sev = "critical" if expected.get("required") and name in critical_dims else "high" if expected.get("required") else "medium"
            gaps.append({"id": f"{name}:mismatch", "dimension": name, "severity": sev, "reason": ";".join(reasons), "expected": expected, "actual": actual})
        else:
            matched += weight
    score = 1.0 if total == 0 else round(matched / total, 4)
    threshold = float(policy.get("production_minimum_score" if contract.get("target_kind") == "production-target" else "default_minimum_score", 0.85))
    critical = any(g["severity"] == "critical" for g in gaps)
    status = "blocked" if critical or score < threshold else "review-required" if gaps else "verified"
    result = {"version": 1, "status": status, "score": score, "threshold": threshold, "contract_fingerprint": fp(contract), "snapshot_fingerprint": fp(snap), "gaps": gaps, "requires_independent_review": contract.get("target_kind") == "production-target" or critical}
    os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as f: json.dump(result, f, indent=2, sort_keys=True)
    print(status)
    return 0 if status == "verified" else 2

if __name__ == "__main__": sys.exit(main())
