#!/usr/bin/env python3
"""Deterministic JSONL history fidelity scanner/comparator.

The script treats every parsed JSON object as a canonical record by default. It
normalizes volatile top-level fields configured via --ignore-field, hashes the
remaining JSON, checks ordinal monotonicity, and compares fingerprint
multiplicity. It never modifies input files.
"""
from __future__ import annotations
import argparse, collections, hashlib, json, pathlib, sys
from typing import Any


def normalize(obj: Any, ignored: set[str]) -> Any:
    if isinstance(obj, dict):
        return {k: normalize(v, ignored) for k, v in sorted(obj.items()) if k not in ignored}
    if isinstance(obj, list):
        return [normalize(v, ignored) for v in obj]
    return obj


def scan(path: str, ignored: set[str]) -> dict[str, Any]:
    p = pathlib.Path(path)
    if not p.is_file():
        raise ValueError(f"not a file: {path}")
    hashes: list[str] = []
    ordinals: list[int] = []
    parse_errors: list[int] = []
    bytes_read = 0
    with p.open("rb") as fh:
        for line_no, raw in enumerate(fh, 1):
            bytes_read += len(raw)
            if not raw.strip():
                continue
            try:
                obj = json.loads(raw)
            except json.JSONDecodeError:
                parse_errors.append(line_no); continue
            if isinstance(obj, dict) and isinstance(obj.get("ordinal"), int):
                ordinals.append(obj["ordinal"])
            encoded = json.dumps(normalize(obj, ignored), sort_keys=True, ensure_ascii=False, separators=(",", ":")).encode()
            hashes.append(hashlib.sha256(encoded).hexdigest())
    regressions = sum(1 for a, b in zip(ordinals, ordinals[1:]) if b <= a)
    return {"path": str(p), "bytes": bytes_read, "records": len(hashes), "parse_errors": parse_errors,
            "ordinal_count": len(ordinals), "ordinal_regressions": regressions, "fingerprints": hashes}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("command", choices=["scan", "compare"])
    ap.add_argument("source")
    ap.add_argument("target", nargs="?")
    ap.add_argument("--ignore-field", action="append", default=[])
    a = ap.parse_args()
    try:
        src = scan(a.source, set(a.ignore_field))
        if a.command == "scan":
            out = {k: v for k, v in src.items() if k != "fingerprints"}
            out["ok"] = not src["parse_errors"] and src["ordinal_regressions"] == 0
            print(json.dumps(out, indent=2)); return 0 if out["ok"] else 3
        if not a.target:
            print("target required for compare", file=sys.stderr); return 2
        dst = scan(a.target, set(a.ignore_field))
        sc, dc = collections.Counter(src["fingerprints"]), collections.Counter(dst["fingerprints"])
        missing = list((sc - dc).elements()); excess = list((dc - sc).elements())
        out = {"source_records": src["records"], "target_records": dst["records"],
               "source_parse_errors": src["parse_errors"], "target_parse_errors": dst["parse_errors"],
               "source_ordinal_regressions": src["ordinal_regressions"], "target_ordinal_regressions": dst["ordinal_regressions"],
               "missing_count": len(missing), "excess_count": len(excess),
               "missing_sample": missing[:10], "excess_sample": excess[:10]}
        out["ok"] = not any([out["source_parse_errors"], out["target_parse_errors"], out["source_ordinal_regressions"], out["target_ordinal_regressions"], missing, excess])
        print(json.dumps(out, indent=2)); return 0 if out["ok"] else 3
    except (OSError, ValueError) as exc:
        print(str(exc), file=sys.stderr); return 2

if __name__ == "__main__":
    raise SystemExit(main())
