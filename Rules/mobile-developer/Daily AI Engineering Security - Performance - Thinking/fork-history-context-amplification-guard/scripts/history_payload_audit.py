#!/usr/bin/env python3
"""Read-only JSONL audit for fork/compaction context amplification."""
from __future__ import annotations
import argparse, hashlib, json, re, sys
from collections import Counter
from pathlib import Path

DATA_RE = re.compile(r"data:image/[^;\"']+;base64,([A-Za-z0-9+/=]+)")
DEFAULTS = {"max_total_bytes": 536870912, "max_record_bytes": 16777216,
            "max_compacted_share": 0.75, "max_duplicate_blob_bytes": 67108864,
            "max_compaction_records": 32}

def load_config(path: str | None) -> dict:
    cfg = dict(DEFAULTS)
    if path:
        try:
            raw = json.loads(Path(path).read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise ValueError(f"cannot load config: {exc}") from exc
        if not isinstance(raw, dict): raise ValueError("config must be an object")
        for k in cfg:
            if k in raw: cfg[k] = raw[k]
    return cfg

def audit(path: Path, cfg: dict) -> dict:
    if not path.is_file(): raise ValueError(f"input not found: {path}")
    total = compacted = largest = compact_count = inline = 0
    hashes: Counter[str] = Counter(); sizes: dict[str, int] = {}; bad: list[int] = []
    with path.open("rb") as f:
        for line_no, raw in enumerate(f, 1):
            total += len(raw); largest = max(largest, len(raw))
            try: obj = json.loads(raw)
            except (UnicodeDecodeError, json.JSONDecodeError): bad.append(line_no); continue
            if not isinstance(obj, dict):
                bad.append(line_no); continue
            text = raw.decode("utf-8", errors="ignore")
            item = obj.get("item")
            item_type = item.get("type") if isinstance(item, dict) else None
            payload = obj.get("payload")
            payload_type = payload.get("type") if isinstance(payload, dict) else None
            is_compacted = obj.get("type") == "compacted" or item_type == "compacted" or payload_type == "compacted"
            if is_compacted: compacted += len(raw); compact_count += 1
            for match in DATA_RE.finditer(text):
                b64 = match.group(1); size = len(b64); inline += size
                digest = hashlib.sha256(b64.encode("ascii")).hexdigest()
                hashes[digest] += 1; sizes[digest] = size
    dup = sum(sizes[h] * (count - 1) for h, count in hashes.items() if count > 1)
    share = compacted / total if total else 0.0
    violations = []
    checks = [(total > cfg["max_total_bytes"], "max_total_bytes"),
              (largest > cfg["max_record_bytes"], "max_record_bytes"),
              (share > cfg["max_compacted_share"], "max_compacted_share"),
              (dup > cfg["max_duplicate_blob_bytes"], "max_duplicate_blob_bytes"),
              (compact_count > cfg["max_compaction_records"], "max_compaction_records")]
    violations.extend(name for failed, name in checks if failed)
    if bad: violations.append("malformed_jsonl")
    return {"input": str(path), "total_bytes": total, "compacted_bytes": compacted,
            "compacted_share": round(share, 6), "compaction_records": compact_count,
            "largest_record_bytes": largest, "inline_blob_encoded_bytes": inline,
            "unique_inline_blobs": len(hashes), "duplicate_blob_encoded_bytes": dup,
            "malformed_lines": bad, "violations": violations, "status": "block" if violations else "allow"}

def main() -> int:
    p = argparse.ArgumentParser(); p.add_argument("rollout"); p.add_argument("--config"); p.add_argument("--pretty", action="store_true")
    a = p.parse_args()
    try: result = audit(Path(a.rollout), load_config(a.config))
    except (ValueError, TypeError, KeyError) as exc: print(json.dumps({"status":"error","error":str(exc)}), file=sys.stderr); return 2
    print(json.dumps(result, indent=2 if a.pretty else None, sort_keys=True))
    return 1 if result["status"] == "block" else 0
if __name__ == "__main__": raise SystemExit(main())
