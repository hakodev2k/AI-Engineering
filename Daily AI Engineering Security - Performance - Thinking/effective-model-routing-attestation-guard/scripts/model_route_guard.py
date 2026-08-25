#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

EXIT_OK = 0
EXIT_DRIFT = 2
EXIT_INPUT = 3
FIELDS = ("model", "reasoning_effort", "provider", "service_tier", "sandbox_mode")


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}") from exc


def norm(value):
    return value.strip().lower() if isinstance(value, str) else value


def compare(intent, observed):
    required = ["task_id", "model", "reasoning_effort"]
    missing = [key for key in required if key not in intent]
    if missing:
        raise ValueError("intent missing: " + ", ".join(missing))
    if not isinstance(observed, dict):
        raise ValueError("observed must be an object")

    drift = []
    for field in FIELDS:
        if field in intent:
            if field not in observed:
                drift.append({"field": field, "expected": intent[field], "observed": None, "reason": "missing-runtime-evidence"})
            elif norm(intent[field]) != norm(observed[field]):
                drift.append({"field": field, "expected": intent[field], "observed": observed[field], "reason": "mismatch"})

    if intent.get("allow_inherit") is False and observed.get("resolution") == "inherited":
        drift.append({"field": "resolution", "expected": "explicit", "observed": "inherited", "reason": "inheritance-not-allowed"})

    return {
        "task_id": intent["task_id"],
        "status": "pass" if not drift else "drift",
        "drift": drift,
        "evidence_source": observed.get("source", "unknown"),
    }


def main(argv=None):
    parser = argparse.ArgumentParser(description="Fail-closed attestation for intended vs effective agent model routing.")
    parser.add_argument("--intent", required=True)
    parser.add_argument("--observed", required=True)
    parser.add_argument("--output")
    args = parser.parse_args(argv)

    try:
        result = compare(load_json(args.intent), load_json(args.observed))
    except ValueError as exc:
        print(json.dumps({"status": "error", "error": str(exc)}), file=sys.stderr)
        return EXIT_INPUT

    text = json.dumps(result, indent=2, sort_keys=True)
    if args.output:
        Path(args.output).write_text(text + "\n", encoding="utf-8")
    print(text)
    return EXIT_OK if result["status"] == "pass" else EXIT_DRIFT


if __name__ == "__main__":
    raise SystemExit(main())
