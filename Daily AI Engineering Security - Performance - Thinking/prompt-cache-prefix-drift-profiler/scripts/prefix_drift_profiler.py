#!/usr/bin/env python3
import argparse, hashlib, json
from pathlib import Path

def digest(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def load(path):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(data, dict) or not isinstance(data.get("requests"), list) or len(data["requests"]) < 2:
        raise ValueError("samples must contain at least two requests")
    return data

def analyze(data):
    requests = data["requests"]
    for request in requests:
        if not isinstance(request.get("blocks"), list) or "input_tokens" not in request:
            raise ValueError("each request needs blocks and input_tokens")
        for block in request["blocks"]:
            if not isinstance(block.get("label"), str) or not isinstance(block.get("content"), str):
                raise ValueError("each block needs string label/content")
    base = requests[0]["blocks"]
    comparisons = []
    for request in requests[1:]:
        other = request["blocks"]
        common = min(len(base), len(other))
        drift = None
        stable_bytes = 0
        for index in range(common):
            if base[index]["label"] != other[index]["label"] or digest(base[index]["content"]) != digest(other[index]["content"]):
                drift = index
                break
            stable_bytes += len(base[index]["content"].encode("utf-8"))
        if drift is None and len(base) != len(other):
            drift = common
        input_tokens = max(1, int(request["input_tokens"]))
        cache_read = request.get("cache_read_tokens")
        cache_creation = request.get("cache_creation_tokens")
        comparisons.append({
            "request_id": request.get("request_id"),
            "earliest_drift_index": drift,
            "earliest_drift_label": other[drift]["label"] if drift is not None and drift < len(other) else None,
            "stable_prefix_bytes": stable_bytes,
            "cache_read_ratio": None if cache_read is None else cache_read / input_tokens,
            "cache_creation_ratio": None if cache_creation is None else cache_creation / input_tokens,
            "ttft_ms": request.get("ttft_ms")
        })
    ratios = [item["cache_read_ratio"] for item in comparisons if item["cache_read_ratio"] is not None]
    status = "measured" if ratios else "structure_measured_usage_missing"
    early = [item for item in comparisons if item["earliest_drift_index"] is not None and item["earliest_drift_index"] <= 1]
    return {
        "status": status,
        "comparisons": comparisons,
        "early_prefix_drift_count": len(early),
        "mean_cache_read_ratio": None if not ratios else sum(ratios) / len(ratios)
    }

def main():
    parser = argparse.ArgumentParser(description="Locate cache-breaking drift in ordered prompt blocks.")
    parser.add_argument("samples")
    args = parser.parse_args()
    try:
        result = analyze(load(args.samples))
    except Exception as exc:
        print(json.dumps({"status": "error", "error": str(exc)}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
