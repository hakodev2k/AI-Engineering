#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

VALID_SEVERITY = {"normal", "critical"}
VALID_ASSERTIONS = {"required_substring", "forbidden_substring", "required_field", "json_valid"}

def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        raise ValueError(f"cannot read JSON {path}: {e}")

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--suite", required=True)
    p.add_argument("--policy", required=True)
    a = p.parse_args()
    try:
        suite, policy = load(a.suite), load(a.policy)
        errors = []
        for key in ("suite_id", "version", "cases"):
            if key not in suite: errors.append(f"missing suite.{key}")
        if not isinstance(suite.get("cases"), list) or not suite.get("cases"):
            errors.append("suite.cases must be a non-empty array")
        ids = set()
        for i, case in enumerate(suite.get("cases", [])):
            prefix = f"cases[{i}]"
            cid = case.get("id")
            if not isinstance(cid, str) or not cid: errors.append(f"{prefix}.id invalid")
            elif cid in ids: errors.append(f"duplicate case id: {cid}")
            else: ids.add(cid)
            if case.get("severity") not in VALID_SEVERITY: errors.append(f"{prefix}.severity invalid")
            if not isinstance(case.get("high_impact"), bool): errors.append(f"{prefix}.high_impact must be boolean")
            if not isinstance(case.get("weight"), (int,float)) or case.get("weight",0) <= 0: errors.append(f"{prefix}.weight must be > 0")
            rubric = case.get("rubric")
            if not isinstance(rubric, list) or not rubric: errors.append(f"{prefix}.rubric must be non-empty")
            dims = set()
            for r in rubric or []:
                d = r.get("dimension")
                if not d or d in dims: errors.append(f"{prefix} rubric dimension invalid/duplicate: {d}")
                dims.add(d)
                if not isinstance(r.get("weight"), (int,float)) or r.get("weight",0) <= 0: errors.append(f"{prefix} rubric weight must be > 0")
                if not r.get("description"): errors.append(f"{prefix} rubric description required")
            for ass in case.get("assertions", []):
                if ass.get("type") not in VALID_ASSERTIONS: errors.append(f"{prefix} assertion type invalid: {ass.get('type')}")
        for key in ("minimum_repetitions","critical_minimum_repetitions","minimum_candidate_quality","maximum_quality_drop","maximum_critical_worst_run_drop","maximum_cost_increase_ratio","maximum_latency_increase_ratio"):
            if key not in policy: errors.append(f"missing policy.{key}")
        if policy.get("minimum_repetitions",0) < 1: errors.append("minimum_repetitions must be >= 1")
        if policy.get("critical_minimum_repetitions",0) < policy.get("minimum_repetitions",1): errors.append("critical_minimum_repetitions must be >= minimum_repetitions")
        if errors:
            print(json.dumps({"valid": False, "errors": errors}, indent=2))
            return 10
        print(json.dumps({"valid": True, "suite_id": suite["suite_id"], "version": suite["version"], "case_count": len(suite["cases"])}, indent=2))
        return 0
    except Exception as e:
        print(json.dumps({"valid": False, "error": str(e)}))
        return 2

if __name__ == "__main__":
    sys.exit(main())
