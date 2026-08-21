#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

TERMINAL = {"resolved", "blocked", "rejected-with-evidence"}


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate evidence for PR review comment resolutions")
    parser.add_argument("--input", required=True, help="Resolution JSON file")
    args = parser.parse_args()
    path = Path(args.input)
    if not path.is_file():
        print(f"ERROR: missing input: {path}", file=sys.stderr)
        return 2
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"ERROR: invalid JSON: {exc}", file=sys.stderr)
        return 2
    errors = []
    if not isinstance(data.get("pull_request"), int) or data["pull_request"] < 1:
        errors.append("pull_request must be a positive integer")
    comments = data.get("comments")
    if not isinstance(comments, list) or not comments:
        errors.append("comments must be a non-empty array")
    else:
        ids = set()
        for i, item in enumerate(comments):
            p = f"comments[{i}]"
            cid = item.get("comment_id")
            if not isinstance(cid, int): errors.append(f"{p}.comment_id must be integer")
            elif cid in ids: errors.append(f"duplicate comment_id {cid}")
            else: ids.add(cid)
            status = item.get("status")
            if status not in TERMINAL:
                errors.append(f"{p}.status must be terminal before completion")
            if not str(item.get("finding", "")).strip(): errors.append(f"{p}.finding required")
            evidence = item.get("evidence")
            if not isinstance(evidence, list) or not any(str(x).strip() for x in evidence):
                errors.append(f"{p}.evidence requires at least one item")
            if not str(item.get("action", "")).strip(): errors.append(f"{p}.action required")
    verification = data.get("verification")
    if not isinstance(verification, list) or not any(str(x).strip() for x in verification):
        errors.append("verification requires at least one evidence item")
    status = data.get("status")
    if status not in {"verified", "blocked", "partial"}:
        errors.append("invalid top-level status")
    if status == "verified" and isinstance(comments, list) and any(c.get("status") == "blocked" for c in comments):
        errors.append("verified result cannot contain blocked comments")
    if errors:
        for e in errors: print(f"ERROR: {e}", file=sys.stderr)
        return 1
    print(f"PASS: {len(comments)} review comments have evidence-backed terminal states")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
