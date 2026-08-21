#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}")


def main():
    p = argparse.ArgumentParser(description="Evaluate normalized tool fixture results against a contract.")
    p.add_argument("--contract", required=True)
    p.add_argument("--results", required=True)
    args = p.parse_args()

    try:
        contract = load_json(args.contract)
        results_doc = load_json(args.results)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    results = results_doc.get("results")
    if not isinstance(results, list):
        print("ERROR: results JSON must contain a 'results' array", file=sys.stderr)
        return 2

    by_id = {}
    for item in results:
        if isinstance(item, dict) and item.get("id"):
            by_id[item["id"]] = item

    failures = []
    for fixture in contract.get("fixtures", []):
        fid = fixture.get("id")
        observed = by_id.get(fid)
        if observed is None:
            failures.append(f"{fid}: missing runtime result")
            continue

        expected_status = fixture.get("expected_status")
        actual_status = observed.get("status")
        if actual_status != expected_status:
            failures.append(f"{fid}: status expected={expected_status} actual={actual_status}")
            continue

        if actual_status == "success":
            payload = observed.get("result")
            if not isinstance(payload, dict):
                failures.append(f"{fid}: success result must be an object")
                continue
            required_fields = set(contract.get("success_required_fields", [])) | set(fixture.get("required_result_fields", []))
            missing = sorted(field for field in required_fields if field not in payload)
            if missing:
                failures.append(f"{fid}: missing success fields: {', '.join(missing)}")

        elif actual_status == "error":
            error = observed.get("error")
            if not isinstance(error, dict):
                failures.append(f"{fid}: error result must contain an error object")
                continue
            required_fields = set(contract.get("error_required_fields", []))
            missing = sorted(field for field in required_fields if field not in error)
            if missing:
                failures.append(f"{fid}: missing error fields: {', '.join(missing)}")
            expected_code = fixture.get("expected_error_code")
            if expected_code is not None and error.get("code") != expected_code:
                failures.append(f"{fid}: error code expected={expected_code} actual={error.get('code')}")

        declared_level = contract.get("side_effect_level")
        observed_effect = observed.get("observed_side_effect_level", "none")
        rank = {"none": 0, "read": 1, "reversible-write": 2, "destructive-write": 3, "privileged": 4}
        if observed_effect not in rank:
            failures.append(f"{fid}: invalid observed_side_effect_level={observed_effect}")
        elif declared_level in rank and rank[observed_effect] > rank[declared_level]:
            failures.append(f"{fid}: undeclared side effect observed={observed_effect} declared={declared_level}")

    extra = sorted(set(by_id) - {fx.get("id") for fx in contract.get("fixtures", [])})
    if extra:
        failures.append(f"unexpected runtime result ids: {', '.join(extra)}")

    if failures:
        for failure in failures:
            print(f"FAIL: {failure}")
        return 1

    print(f"PASS: {len(contract.get('fixtures', []))} fixture result(s) satisfy the declared contract")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
