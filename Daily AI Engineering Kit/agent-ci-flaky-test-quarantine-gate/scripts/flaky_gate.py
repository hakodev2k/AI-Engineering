#!/usr/bin/env python3
import argparse, fnmatch, json, sys
from pathlib import Path

VALID = {"pass", "fail"}

def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        raise ValueError(f"cannot read JSON {path}: {e}") from e

def validate_evidence(e):
    required = ["test_id", "revision", "command", "environment", "observations"]
    missing = [k for k in required if k not in e]
    if missing: raise ValueError("missing evidence fields: " + ", ".join(missing))
    if not all(isinstance(e[k], str) and e[k].strip() for k in required[:-1]):
        raise ValueError("test_id, revision, command and environment must be non-empty strings")
    if not isinstance(e["observations"], list): raise ValueError("observations must be a list")
    for i, o in enumerate(e["observations"]):
        if not isinstance(o, dict) or o.get("result") not in VALID:
            raise ValueError(f"observation {i} result must be pass or fail")
        if o.get("revision") != e["revision"]:
            raise ValueError(f"observation {i} revision differs from evidence revision")

def validate_policy(p):
    for key in ("min_observations", "max_test_reruns", "recovery_consecutive_passes"):
        if not isinstance(p.get(key), int) or p[key] < 1: raise ValueError(f"{key} must be positive integer")
    if p["min_observations"] > p["max_test_reruns"] + 1:
        raise ValueError("min_observations cannot exceed original observation plus max_test_reruns")
    if not isinstance(p.get("protected_test_patterns", []), list): raise ValueError("protected_test_patterns must be list")

def evaluate(e, p):
    validate_evidence(e); validate_policy(p)
    obs = e["observations"]
    results = [x["result"] for x in obs]
    protected = any(fnmatch.fnmatch(e["test_id"], pat) for pat in p.get("protected_test_patterns", []))
    if protected: status, reason = "protected_test", "test matches protected_test_patterns"
    elif len(obs) < p["min_observations"]: status, reason = "insufficient_evidence", "minimum valid observations not reached"
    elif set(results) == {"fail"}: status, reason = "deterministic_failure", "all valid observations failed"
    elif set(results) == {"pass"}: status, reason = "stable_pass", "all valid observations passed"
    else: status, reason = "quarantine_eligible", "same revision produced both pass and fail outcomes"
    return {"status": status, "reason": reason, "test_id": e["test_id"], "revision": e["revision"], "observations": len(obs), "passes": results.count("pass"), "failures": results.count("fail"), "human_approval_required": bool(p.get("require_human_approval_for_quarantine", True)) if status == "quarantine_eligible" else False}

def main():
    ap = argparse.ArgumentParser(description="Classify bounded flaky-test evidence")
    sub = ap.add_subparsers(dest="cmd", required=True)
    ev = sub.add_parser("evaluate")
    ev.add_argument("--evidence", required=True); ev.add_argument("--policy", required=True)
    a = ap.parse_args()
    try: out = evaluate(load(a.evidence), load(a.policy))
    except ValueError as ex:
        print(json.dumps({"status":"invalid_input","error":str(ex)})); return 2
    print(json.dumps(out, indent=2, sort_keys=True))
    return 0 if out["status"] == "quarantine_eligible" else 1
if __name__ == "__main__": sys.exit(main())
