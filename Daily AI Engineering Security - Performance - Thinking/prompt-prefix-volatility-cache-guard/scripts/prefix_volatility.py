#!/usr/bin/env python3
import argparse, hashlib, json
from pathlib import Path


def load(path):
    try:
        value = json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, list):
        raise ValueError("manifest must be a JSON array")
    for i, seg in enumerate(value):
        if not isinstance(seg, dict) or not isinstance(seg.get("id"), str) or not isinstance(seg.get("tokens"), int) or seg["tokens"] < 0:
            raise ValueError(f"invalid segment at index {i}")
        if "content" not in seg:
            raise ValueError(f"segment {seg['id']} missing content")
    return value


def digest(content):
    encoded = content if isinstance(content, str) else json.dumps(content, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(encoded.encode("utf-8")).hexdigest()


def analyze(previous, current, budget):
    if budget < 0:
        raise ValueError("budget must be >= 0")
    first = None
    upto = min(len(previous), len(current))
    for i in range(upto):
        a, b = previous[i], current[i]
        if a["id"] != b["id"] or digest(a["content"]) != digest(b["content"]):
            first = i
            break
    if first is None and len(previous) != len(current):
        first = upto
    if first is None:
        return {"status": "unchanged", "blast_radius_tokens": 0, "within_budget": True, "first_changed_segment": None}
    blast = sum(seg["tokens"] for seg in current[first:])
    changed_id = current[first]["id"] if first < len(current) else "removed_tail"
    required = bool(current[first].get("required", False)) if first < len(current) else False
    return {
        "status": "changed",
        "first_changed_segment": changed_id,
        "blast_radius_tokens": blast,
        "within_budget": blast <= budget,
        "required_change": required,
        "recommendation": "measure_required_exemption" if required and blast > budget else ("relocate_or_isolate_volatile_segment" if blast > budget else "accept"),
    }


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--previous", required=True)
    p.add_argument("--current", required=True)
    p.add_argument("--budget", type=int, required=True)
    a = p.parse_args()
    try:
        result = analyze(load(a.previous), load(a.current), a.budget)
    except ValueError as exc:
        print(json.dumps({"status": "insufficient_evidence", "error": str(exc)}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["within_budget"] else 3


if __name__ == "__main__":
    raise SystemExit(main())
