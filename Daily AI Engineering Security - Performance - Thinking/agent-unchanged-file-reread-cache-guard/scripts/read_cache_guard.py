#!/usr/bin/env python3
"""Range-aware unchanged-file read cache guard.

Commands:
  check   Decide whether a read can be served as an unchanged receipt.
  record  Record a completed read range and file fingerprint.
  invalidate Remove ledger entries for a path.
  compact Mark cached content as context-residency unknown.
  stats   Print aggregate cache metrics.

The script never mutates target repository files. Ledger writes are atomic.
Exit codes: 0 success/hit, 2 cache miss, 3 invalid input, 4 I/O error.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import tempfile
import time
from pathlib import Path


def eprint(*args):
    print(*args, file=sys.stderr)


def canonical(path: str) -> str:
    return str(Path(path).expanduser().resolve(strict=True))


def file_hash(path: str, algo: str = "sha256", max_bytes: int = 8 * 1024 * 1024) -> tuple[str, int]:
    p = Path(path)
    size = p.stat().st_size
    h = hashlib.new(algo)
    with p.open("rb") as f:
        remaining = max_bytes
        while remaining > 0:
            chunk = f.read(min(1024 * 1024, remaining))
            if not chunk:
                break
            h.update(chunk)
            remaining -= len(chunk)
    # Include size so a shared prefix cannot masquerade as the same oversized file.
    h.update(f"\0size={size}".encode())
    return h.hexdigest(), size


def load_json(path: Path, default):
    if not path.exists():
        return default
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def atomic_write(path: Path, value) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix=path.name + ".", dir=str(path.parent))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(value, f, indent=2, sort_keys=True)
            f.write("\n")
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


def load_policy(path: Path) -> dict:
    return load_json(path, {
        "hash_algorithm": "sha256",
        "max_hash_bytes": 8388608,
        "ranges": {"allow_superset_hits": True},
        "context_residency": {"after_compaction": "unknown"},
    })


def normalize_range(start: int | None, end: int | None) -> tuple[int, int]:
    s = 1 if start is None else start
    e = 2**63 - 1 if end is None else end
    if s < 1 or e < s:
        raise ValueError("invalid range")
    return s, e


def fingerprint(path: str, policy: dict) -> dict:
    p = Path(path)
    st = p.stat()
    digest, size = file_hash(path, policy.get("hash_algorithm", "sha256"), int(policy.get("max_hash_bytes", 8388608)))
    return {
        "size": size,
        "mtime_ns": st.st_mtime_ns,
        "hash": digest,
    }


def covers(entry: dict, start: int, end: int, allow_superset: bool) -> bool:
    es, ee = int(entry["start"]), int(entry["end"])
    return (es == start and ee == end) or (allow_superset and es <= start and ee >= end)


def cmd_check(args) -> int:
    try:
        cp = canonical(args.path)
        policy = load_policy(Path(args.policy))
        ledger = load_json(Path(args.ledger), {"entries": [], "metrics": {}})
        fp = fingerprint(cp, policy)
        start, end = normalize_range(args.start, args.end)
        allow_superset = bool(policy.get("ranges", {}).get("allow_superset_hits", True))
        for entry in ledger.get("entries", []):
            if entry.get("path") != cp:
                continue
            if entry.get("fingerprint", {}).get("hash") != fp["hash"]:
                continue
            if not covers(entry, start, end, allow_superset):
                continue
            residency = entry.get("context_residency", "unknown")
            if args.require_context and residency != "present":
                print(json.dumps({"decision": "MISS_REHYDRATE", "reason": "content-not-proven-in-context", "path": cp}))
                return 2
            metrics = ledger.setdefault("metrics", {})
            metrics["cache_hits"] = int(metrics.get("cache_hits", 0)) + 1
            atomic_write(Path(args.ledger), ledger)
            print(json.dumps({
                "decision": "UNCHANGED_READ",
                "path": cp,
                "hash": fp["hash"],
                "range": [start, None if end == 2**63 - 1 else end],
                "context_residency": residency,
            }))
            return 0
        metrics = ledger.setdefault("metrics", {})
        metrics["cache_misses"] = int(metrics.get("cache_misses", 0)) + 1
        atomic_write(Path(args.ledger), ledger)
        print(json.dumps({"decision": "MISS_READ_REQUIRED", "path": cp}))
        return 2
    except (OSError, json.JSONDecodeError) as exc:
        eprint(f"I/O error: {exc}")
        return 4
    except (ValueError, KeyError) as exc:
        eprint(f"invalid input: {exc}")
        return 3


def cmd_record(args) -> int:
    try:
        cp = canonical(args.path)
        policy = load_policy(Path(args.policy))
        ledger_path = Path(args.ledger)
        ledger = load_json(ledger_path, {"entries": [], "metrics": {}})
        fp = fingerprint(cp, policy)
        start, end = normalize_range(args.start, args.end)
        entry = {
            "path": cp,
            "start": start,
            "end": end,
            "fingerprint": fp,
            "context_residency": "present",
            "recorded_at": int(time.time()),
            "returned_bytes": max(0, int(args.returned_bytes or 0)),
        }
        entries = [e for e in ledger.get("entries", []) if not (e.get("path") == cp and e.get("start") == start and e.get("end") == end)]
        entries.append(entry)
        ledger["entries"] = entries
        metrics = ledger.setdefault("metrics", {})
        metrics["reads_recorded"] = int(metrics.get("reads_recorded", 0)) + 1
        metrics["bytes_returned"] = int(metrics.get("bytes_returned", 0)) + entry["returned_bytes"]
        atomic_write(ledger_path, ledger)
        print(json.dumps({"recorded": True, "path": cp, "hash": fp["hash"]}))
        return 0
    except (OSError, json.JSONDecodeError) as exc:
        eprint(f"I/O error: {exc}")
        return 4
    except ValueError as exc:
        eprint(f"invalid input: {exc}")
        return 3


def cmd_invalidate(args) -> int:
    try:
        cp = str(Path(args.path).expanduser().resolve(strict=False))
        ledger_path = Path(args.ledger)
        ledger = load_json(ledger_path, {"entries": [], "metrics": {}})
        before = len(ledger.get("entries", []))
        ledger["entries"] = [e for e in ledger.get("entries", []) if e.get("path") != cp]
        removed = before - len(ledger["entries"])
        ledger.setdefault("metrics", {})["invalidations"] = int(ledger.get("metrics", {}).get("invalidations", 0)) + removed
        atomic_write(ledger_path, ledger)
        print(json.dumps({"invalidated": removed, "path": cp}))
        return 0
    except (OSError, json.JSONDecodeError) as exc:
        eprint(f"I/O error: {exc}")
        return 4


def cmd_compact(args) -> int:
    try:
        ledger_path = Path(args.ledger)
        ledger = load_json(ledger_path, {"entries": [], "metrics": {}})
        for entry in ledger.get("entries", []):
            entry["context_residency"] = "unknown"
        ledger.setdefault("metrics", {})["compactions"] = int(ledger.get("metrics", {}).get("compactions", 0)) + 1
        atomic_write(ledger_path, ledger)
        print(json.dumps({"updated_entries": len(ledger.get("entries", [])), "context_residency": "unknown"}))
        return 0
    except (OSError, json.JSONDecodeError) as exc:
        eprint(f"I/O error: {exc}")
        return 4


def cmd_stats(args) -> int:
    try:
        ledger = load_json(Path(args.ledger), {"entries": [], "metrics": {}})
        print(json.dumps({"entries": len(ledger.get("entries", [])), "metrics": ledger.get("metrics", {})}, indent=2, sort_keys=True))
        return 0
    except (OSError, json.JSONDecodeError) as exc:
        eprint(f"I/O error: {exc}")
        return 4


def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser()
    p.add_argument("--ledger", default=".agent-read-cache/ledger.json")
    p.add_argument("--policy", default=str(Path(__file__).resolve().parents[1] / "config" / "policy.json"))
    sub = p.add_subparsers(dest="command", required=True)
    c = sub.add_parser("check")
    c.add_argument("path")
    c.add_argument("--start", type=int)
    c.add_argument("--end", type=int)
    c.add_argument("--require-context", action="store_true")
    c.set_defaults(func=cmd_check)
    r = sub.add_parser("record")
    r.add_argument("path")
    r.add_argument("--start", type=int)
    r.add_argument("--end", type=int)
    r.add_argument("--returned-bytes", type=int, default=0)
    r.set_defaults(func=cmd_record)
    i = sub.add_parser("invalidate")
    i.add_argument("path")
    i.set_defaults(func=cmd_invalidate)
    co = sub.add_parser("compact")
    co.set_defaults(func=cmd_compact)
    s = sub.add_parser("stats")
    s.set_defaults(func=cmd_stats)
    return p


def main() -> int:
    args = parser().parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
