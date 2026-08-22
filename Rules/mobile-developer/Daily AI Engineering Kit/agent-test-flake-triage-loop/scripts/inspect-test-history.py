#!/usr/bin/env python3
import argparse
import csv
import json
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description="Summarize run-flake-loop TSV evidence")
    parser.add_argument("summary", help="Path to summary.tsv")
    parser.add_argument("--json-out", help="Optional output JSON path")
    args = parser.parse_args()

    path = Path(args.summary)
    if not path.is_file():
        print(f"error: summary file not found: {path}")
        return 2

    rows = []
    try:
        with path.open(newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f, delimiter="\t")
            required = {"attempt", "exit_code", "result", "log"}
            if not reader.fieldnames or not required.issubset(reader.fieldnames):
                print("error: invalid summary header")
                return 3
            rows = list(reader)
    except OSError as exc:
        print(f"error: cannot read summary: {exc}")
        return 4

    passes = sum(1 for r in rows if r["result"] == "pass")
    failures = sum(1 for r in rows if r["result"] == "fail")
    unknown = len(rows) - passes - failures
    result = {
        "attempts": len(rows),
        "passes": passes,
        "failures": failures,
        "unknown_results": unknown,
        "intermittent": passes > 0 and failures > 0,
        "all_passed": len(rows) > 0 and failures == 0 and unknown == 0,
        "all_failed": len(rows) > 0 and passes == 0 and failures > 0 and unknown == 0,
        "failure_rate": (failures / len(rows)) if rows else None,
        "logs": [r["log"] for r in rows],
    }

    rendered = json.dumps(result, indent=2)
    print(rendered)
    if args.json_out:
        out = Path(args.json_out)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(rendered + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
