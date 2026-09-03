#!/usr/bin/env python3
"""Analyze JSONL telemetry samples without emitting raw observed values.
Exit codes: 0 pass, 2 cardinality threshold breach, 3 invalid input/config.
"""
from __future__ import annotations
import argparse, json, sys
from collections import defaultdict
from pathlib import Path


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(str(exc)) from exc


def main() -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("--input", required=True); ap.add_argument("--config", required=True); ap.add_argument("--output", required=True)
    args = ap.parse_args(); source, output = Path(args.input).resolve(), Path(args.output).resolve()
    if not source.is_file(): print(f"sample not found: {source}", file=sys.stderr); return 3
    try: cfg = load_json(Path(args.config).resolve())
    except ValueError as exc: print(f"invalid config: {exc}", file=sys.stderr); return 3
    max_distinct = int(cfg.get("max_distinct_values_per_key", 100)); max_ratio = float(cfg.get("max_uniqueness_ratio", 0.25)); min_samples = int(cfg.get("min_samples_for_ratio_check", 20)); dangerous = {str(x).lower() for x in cfg.get("dangerous_dimensions", [])}
    values, occurrences = defaultdict(set), defaultdict(int); records = 0
    try:
        with source.open("r", encoding="utf-8") as fh:
            for lineno, raw in enumerate(fh, 1):
                if not raw.strip(): continue
                obj = json.loads(raw)
                if not isinstance(obj, dict): raise ValueError(f"line {lineno} is not an object")
                attrs = obj.get("attributes", obj)
                if not isinstance(attrs, dict): raise ValueError(f"line {lineno} attributes are not an object")
                records += 1
                for key, value in attrs.items():
                    canonical = json.dumps(value, sort_keys=True, separators=(",", ":")) if isinstance(value, (dict, list)) else str(value)
                    values[str(key)].add(canonical); occurrences[str(key)] += 1
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"invalid sample: {exc}", file=sys.stderr); return 3
    keys, breaches = [], []
    for key in sorted(values):
        distinct, seen = len(values[key]), occurrences[key]; ratio = distinct / seen if seen else 0.0; reasons = []
        if distinct > max_distinct: reasons.append(f"distinct>{max_distinct}")
        if seen >= min_samples and ratio > max_ratio: reasons.append(f"uniqueness_ratio>{max_ratio}")
        if key.lower() in dangerous and distinct > 1: reasons.append("dangerous_dimension_has_multiple_values")
        item = {"key": key, "occurrences": seen, "distinct": distinct, "uniqueness_ratio": round(ratio, 6), "breaches": reasons}; keys.append(item)
        if reasons: breaches.append(item)
    report = {"records": records, "key_count": len(keys), "breach_count": len(breaches), "keys": keys, "note": "Raw observed values are intentionally omitted."}
    output.parent.mkdir(parents=True, exist_ok=True); output.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({"records": records, "breaches": len(breaches), "output": str(output)})); return 2 if breaches else 0


if __name__ == "__main__": raise SystemExit(main())
