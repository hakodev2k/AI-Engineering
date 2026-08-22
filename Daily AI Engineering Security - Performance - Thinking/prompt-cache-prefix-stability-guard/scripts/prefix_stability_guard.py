#!/usr/bin/env python3
"""Compare canonical stable prompt segments for cache-prefix drift.
Exit 0 allow, 2 invalid input, 3 regression.
"""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path
from typing import Any


def load(path: Path) -> dict[str, Any]:
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(obj, dict):
        raise ValueError(f"{path} must contain object")
    return obj


def canon(value: Any, unordered_keys: set[str], key_name: str | None = None) -> Any:
    if isinstance(value, dict):
        return {k: canon(value[k], unordered_keys, k) for k in sorted(value)}
    if isinstance(value, list):
        items = [canon(v, unordered_keys) for v in value]
        if key_name in unordered_keys:
            return sorted(items, key=lambda x: json.dumps(x, sort_keys=True, separators=(",", ":"), ensure_ascii=False))
        return items
    return value


def sha(value: Any) -> str:
    raw = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
    return hashlib.sha256(raw).hexdigest()


def analyze(base: dict[str, Any], cand: dict[str, Any], policy: dict[str, Any]) -> tuple[dict[str, Any], int]:
    segments = policy.get("stable_segments", ["tools", "system"])
    unordered = set(policy.get("unordered_array_keys", ["tools", "agents", "skills"]))
    if not isinstance(segments, list) or not all(isinstance(x, str) for x in segments):
        raise ValueError("stable_segments must be string array")
    rows = []
    first = None
    for name in segments:
        if name not in base or name not in cand:
            raise ValueError(f"missing stable segment: {name}")
        b = canon(base[name], unordered, name)
        c = canon(cand[name], unordered, name)
        bh, ch = sha(b), sha(c)
        match = bh == ch
        rows.append({"segment": name, "baseline_sha256": bh, "candidate_sha256": ch, "match": match})
        if not match and first is None:
            first = name
    cumulative_base = sha([canon(base[n], unordered, n) for n in segments])
    cumulative_cand = sha([canon(cand[n], unordered, n) for n in segments])
    ok = first is None
    return {"decision": "allow" if ok else "regression", "segments": rows, "first_divergent_segment": first,
            "baseline_prefix_sha256": cumulative_base, "candidate_prefix_sha256": cumulative_cand}, (0 if ok else 3)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("baseline", type=Path); ap.add_argument("candidate", type=Path)
    ap.add_argument("--policy", type=Path, required=True)
    a = ap.parse_args()
    try:
        out, code = analyze(load(a.baseline), load(a.candidate), load(a.policy))
    except (ValueError, TypeError) as exc:
        print(json.dumps({"decision": "invalid", "error": str(exc)}), file=sys.stderr); return 2
    print(json.dumps(out, indent=2, ensure_ascii=False)); return code

if __name__ == "__main__":
    raise SystemExit(main())
