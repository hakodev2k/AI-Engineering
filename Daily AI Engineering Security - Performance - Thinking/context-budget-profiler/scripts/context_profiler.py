#!/usr/bin/env python3
import hashlib, json, math, sys
from pathlib import Path


def estimate_tokens(text: str) -> int:
    # Deterministic approximation for relative before/after comparison.
    # Provider billing may differ; do not present this as exact model tokenization.
    return max(1, math.ceil(len(text.encode("utf-8")) / 4))


def norm(text: str) -> str:
    return " ".join(text.split())


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: context_profiler.py <inventory.json>", file=sys.stderr)
        return 2
    try:
        data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"invalid inventory: {exc}", file=sys.stderr)
        return 3
    if not isinstance(data, list):
        print("inventory must be a JSON array", file=sys.stderr)
        return 3

    rows, groups, hashes = [], {}, {}
    for i, item in enumerate(data):
        if not isinstance(item, dict) or not all(k in item for k in ("name","source","kind","text")):
            print(f"item {i} missing required fields", file=sys.stderr)
            return 4
        text = str(item["text"])
        tokens = estimate_tokens(text)
        digest = hashlib.sha256(norm(text).encode()).hexdigest()
        row = {
            "name": item["name"], "source": item["source"], "kind": item["kind"],
            "required": bool(item.get("required", False)), "estimated_tokens": tokens,
            "sha256_normalized": digest
        }
        rows.append(row)
        key = f'{item["source"]}:{item["kind"]}'
        groups[key] = groups.get(key, 0) + tokens
        hashes.setdefault(digest, []).append(item["name"])

    duplicates = [{"hash": h, "names": names} for h, names in hashes.items() if len(names) > 1]
    total = sum(r["estimated_tokens"] for r in rows)
    required = sum(r["estimated_tokens"] for r in rows if r["required"])
    hotspots = sorted(rows, key=lambda r: r["estimated_tokens"], reverse=True)
    report = {
        "estimator": "utf8-bytes-divided-by-4-ceil",
        "estimated_total_tokens": total,
        "estimated_required_tokens": required,
        "groups": dict(sorted(groups.items(), key=lambda kv: kv[1], reverse=True)),
        "hotspots": hotspots,
        "exact_normalized_duplicates": duplicates,
        "note": "Estimates are for consistent relative comparison, not provider billing."
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0

if __name__ == "__main__":
    sys.exit(main())
