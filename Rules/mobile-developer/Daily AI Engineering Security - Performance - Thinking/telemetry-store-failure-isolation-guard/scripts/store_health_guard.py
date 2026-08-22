#!/usr/bin/env python3
"""Classify local SQLite stores for startup isolation. Read-only by design."""
from __future__ import annotations
import argparse, json, os, sqlite3, sys
from pathlib import Path
from typing import Any


def load(path: str) -> dict[str, Any]:
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read inventory: {exc}") from exc
    if not isinstance(data, dict) or not isinstance(data.get("stores"), list):
        raise ValueError("inventory must contain a stores array")
    return data


def size(path: str) -> int:
    try: return os.path.getsize(path)
    except OSError: return 0


def quick_check(path: str) -> tuple[str, list[str]]:
    uri = "file:" + Path(path).resolve().as_posix() + "?immutable=1"
    try:
        con = sqlite3.connect(uri, uri=True, timeout=1)
        rows = [str(r[0]) for r in con.execute("PRAGMA quick_check(3)").fetchall()]
        con.close()
        return ("ok" if rows == ["ok"] else "corrupt", rows)
    except sqlite3.Error as exc:
        return "error", [str(exc)]


def evaluate(store: dict[str, Any], probe_limit: int) -> dict[str, Any]:
    for key in ("name", "path", "critical"):
        if key not in store: raise ValueError(f"store missing {key}")
    path = str(store["path"]); wal = path + "-wal"
    db_bytes, wal_bytes = size(path), size(wal)
    max_db = int(store.get("max_bytes", 0)); max_wal = int(store.get("max_wal_bytes", 0))
    init_ms = float(store.get("init_ms", 0)); max_init = float(store.get("max_init_ms", 0))
    retries = int(store.get("identical_retry_count", 0))
    findings: list[str] = []
    if not os.path.exists(path): findings.append("missing")
    if max_db and db_bytes > max_db: findings.append("db-size-over-budget")
    if max_wal and wal_bytes > max_wal: findings.append("wal-size-over-budget")
    if max_init and init_ms > max_init: findings.append("init-time-over-budget")
    if retries >= 2: findings.append("retry-circuit-open")

    health = str(store.get("health", "unknown"))
    details: list[str] = []
    if health == "probe" and os.path.exists(path):
        if db_bytes <= probe_limit:
            health, details = quick_check(path)
        else:
            health = "unprobed-large"
            details = [f"skipped immutable quick_check above probe limit {probe_limit}"]
    if health in ("corrupt", "error"): findings.append("health-" + health)

    critical = bool(store["critical"])
    severe = any(x in findings for x in ("missing", "health-corrupt", "health-error")) or any("over-budget" in x for x in findings)
    if critical and severe: action = "block"
    elif not critical and (severe or "retry-circuit-open" in findings): action = "isolate"
    else: action = "continue"
    return {"name":store["name"],"critical":critical,"db_bytes":db_bytes,"wal_bytes":wal_bytes,"health":health,"health_details":details,"findings":findings,"action":action}


def main() -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("--inventory", required=True); ap.add_argument("--probe-limit-bytes", type=int, default=256*1024*1024)
    args = ap.parse_args()
    try:
        inv = load(args.inventory)
        results = [evaluate(s, args.probe_limit_bytes) for s in inv["stores"]]
    except (ValueError, TypeError) as exc:
        print(json.dumps({"status":"error","error":str(exc)})); return 2
    blocked = [r for r in results if r["action"] == "block"]
    isolated = [r for r in results if r["action"] == "isolate"]
    out = {"status":"block" if blocked else ("degraded" if isolated else "pass"),"blocked":len(blocked),"isolated":len(isolated),"stores":results}
    print(json.dumps(out, indent=2))
    return 1 if blocked else 0

if __name__ == "__main__": sys.exit(main())
