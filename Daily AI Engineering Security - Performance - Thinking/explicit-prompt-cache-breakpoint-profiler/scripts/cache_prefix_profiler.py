#!/usr/bin/env python3
"""Profile stable prompt prefixes from sanitized ordered request manifests.

Input format:
{
  "requests": [
    {
      "id": "r1",
      "class": "invoice-review",
      "provider": "openai",
      "model": "gpt-5.6",
      "input_tokens": 12000,
      "cached_tokens": 9000,
      "blocks": [
        {"name":"system","label":"static-required","content":"..."},
        {"name":"tools","label":"static-required","content":{"tools":[]}},
        {"name":"user","label":"dynamic-required","content":"..."}
      ]
    }
  ]
}

The script hashes block content and never emits raw content.
Exit codes: 0 report produced, 2 invalid input, 3 insufficient evidence.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import statistics
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

OK, INVALID, INSUFFICIENT = 0, 2, 3


def load_object(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain an object")
    return value


def canon(value: Any) -> str:
    return json.dumps(value, sort_keys=True, ensure_ascii=False, separators=(",", ":"))


def digest(value: Any) -> str:
    return hashlib.sha256(canon(value).encode("utf-8")).hexdigest()


def sanitize_manifest(req: dict[str, Any], labels: set[str]) -> dict[str, Any]:
    rid = req.get("id")
    rclass = req.get("class")
    blocks = req.get("blocks")
    if not isinstance(rid, str) or not rid:
        raise ValueError("each request.id must be a non-empty string")
    if not isinstance(rclass, str) or not rclass:
        raise ValueError(f"request {rid}: class must be a non-empty string")
    if not isinstance(blocks, list) or not blocks:
        raise ValueError(f"request {rid}: blocks must be a non-empty array")
    out_blocks = []
    for i, block in enumerate(blocks):
        if not isinstance(block, dict):
            raise ValueError(f"request {rid}: block {i} must be an object")
        name, label = block.get("name"), block.get("label")
        if not isinstance(name, str) or not name:
            raise ValueError(f"request {rid}: block {i} name invalid")
        if label not in labels:
            raise ValueError(f"request {rid}: block {i} label invalid: {label}")
        if "content" not in block:
            raise ValueError(f"request {rid}: block {i} missing content")
        serialized = canon(block["content"])
        out_blocks.append({
            "index": i,
            "name": name,
            "label": label,
            "sha256": hashlib.sha256(serialized.encode("utf-8")).hexdigest(),
            "utf8_bytes": len(serialized.encode("utf-8")),
        })
    input_tokens = req.get("input_tokens")
    cached_tokens = req.get("cached_tokens")
    ratio = None
    if input_tokens is not None or cached_tokens is not None:
        if not isinstance(input_tokens, int) or input_tokens < 0 or not isinstance(cached_tokens, int) or cached_tokens < 0:
            raise ValueError(f"request {rid}: token usage must be non-negative integers")
        if cached_tokens > input_tokens:
            raise ValueError(f"request {rid}: cached_tokens cannot exceed input_tokens")
        ratio = (cached_tokens / input_tokens) if input_tokens else 0.0
    return {
        "id": rid,
        "class": rclass,
        "provider": req.get("provider"),
        "model": req.get("model"),
        "input_tokens": input_tokens,
        "cached_tokens": cached_tokens,
        "cache_hit_ratio": ratio,
        "blocks": out_blocks,
    }


def common_prefix_length(manifests: list[dict[str, Any]]) -> int:
    shortest = min(len(m["blocks"]) for m in manifests)
    length = 0
    for i in range(shortest):
        sig = {(m["blocks"][i]["name"], m["blocks"][i]["label"], m["blocks"][i]["sha256"]) for m in manifests}
        if len(sig) != 1:
            break
        length += 1
    return length


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--policy", type=Path, required=True)
    args = parser.parse_args()
    try:
        data, policy = load_object(args.input), load_object(args.policy)
        allowed_labels = set(policy.get("block_labels", []))
        if not allowed_labels:
            raise ValueError("policy.block_labels must not be empty")
        raw_requests = data.get("requests")
        if not isinstance(raw_requests, list) or not raw_requests:
            raise ValueError("input.requests must be a non-empty array")
        manifests = [sanitize_manifest(r, allowed_labels) for r in raw_requests if isinstance(r, dict)]
        if len(manifests) != len(raw_requests):
            raise ValueError("all requests must be objects")
        minimum = int(policy.get("minimum_comparable_requests", 3))
        groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
        for m in manifests:
            groups[m["class"]].append(m)
        eligible = {k: v for k, v in groups.items() if len(v) >= minimum}
        if not eligible:
            print(json.dumps({"status":"insufficient_evidence","reason":f"need at least {minimum} comparable requests per class"}, indent=2))
            return INSUFFICIENT
        reports = []
        for rclass, items in sorted(eligible.items()):
            prefix_len = common_prefix_length(items)
            stable_bytes = sum(items[0]["blocks"][i]["utf8_bytes"] for i in range(prefix_len))
            change_counts: Counter[str] = Counter()
            first_divergence = []
            base = items[0]
            for other in items[1:]:
                limit = min(len(base["blocks"]), len(other["blocks"]))
                diff = None
                for i in range(limit):
                    if base["blocks"][i]["sha256"] != other["blocks"][i]["sha256"] or base["blocks"][i]["name"] != other["blocks"][i]["name"]:
                        diff = i
                        break
                if diff is None and len(base["blocks"]) != len(other["blocks"]):
                    diff = limit
                first_divergence.append({"against": other["id"], "index": diff})
                for i in range(limit):
                    if base["blocks"][i]["sha256"] != other["blocks"][i]["sha256"]:
                        change_counts[base["blocks"][i]["name"]] += 1
            ratios = [m["cache_hit_ratio"] for m in items if m["cache_hit_ratio"] is not None]
            breakpoint = None
            if prefix_len:
                last = items[0]["blocks"][prefix_len - 1]
                if last["label"] == "static-required":
                    breakpoint = {"after_index": prefix_len - 1, "after_block": last["name"]}
            reports.append({
                "class": rclass,
                "request_count": len(items),
                "stable_prefix_blocks": prefix_len,
                "stable_prefix_utf8_bytes": stable_bytes,
                "breakpoint_candidate": breakpoint,
                "first_divergence": first_divergence,
                "changed_block_frequency": dict(change_counts),
                "cache_hit_ratio_mean": round(statistics.mean(ratios), 6) if ratios else None,
                "cache_observability": bool(ratios),
                "manifest_hashes": {m["id"]: digest(m["blocks"]) for m in items},
            })
        print(json.dumps({"status":"ok","classes":reports}, indent=2))
        return OK
    except (ValueError, TypeError) as exc:
        print(json.dumps({"status":"invalid","error":str(exc)}), file=sys.stderr)
        return INVALID


if __name__ == "__main__":
    raise SystemExit(main())
