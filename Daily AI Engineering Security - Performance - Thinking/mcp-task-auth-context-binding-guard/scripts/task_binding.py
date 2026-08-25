#!/usr/bin/env python3
"""Reference MCP task ownership binding using random task IDs and keyed HMAC fingerprints."""
from __future__ import annotations
import argparse, hashlib, hmac, json, os, secrets, sys, tempfile
from pathlib import Path

KEY_ENV = "MCP_TASK_BINDING_KEY"

def key() -> bytes:
    value = os.environ.get(KEY_ENV, "").encode()
    if len(value) < 32:
        raise ValueError(f"{KEY_ENV} must contain at least 32 bytes of secret material")
    return value

def fingerprint(principal: str, k: bytes) -> str:
    p = principal.strip()
    if not p:
        raise ValueError("principal must be non-empty")
    return hmac.new(k, p.encode("utf-8"), hashlib.sha256).hexdigest()

def load_registry(path: Path) -> dict:
    if not path.exists(): return {"version": 1, "tasks": {}}
    try: data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc: raise ValueError(f"invalid registry: {exc}") from exc
    if data.get("version") != 1 or not isinstance(data.get("tasks"), dict): raise ValueError("unsupported registry format")
    return data

def save_registry(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix=path.name + ".", dir=str(path.parent), text=True)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, sort_keys=True, separators=(",", ":")); f.write("\n")
        os.replace(tmp, path)
    except Exception:
        try: os.unlink(tmp)
        except OSError: pass
        raise

def create_binding(path: Path, principal: str, k: bytes) -> str:
    data = load_registry(path)
    task_id = secrets.token_urlsafe(32)
    data["tasks"][task_id] = {"owner_hmac_sha256": fingerprint(principal, k)}
    save_registry(path, data)
    return task_id

def check_binding(path: Path, task_id: str, principal: str, k: bytes) -> bool:
    data = load_registry(path); record = data["tasks"].get(task_id)
    if not isinstance(record, dict): return False
    expected = record.get("owner_hmac_sha256", "")
    actual = fingerprint(principal, k)
    return isinstance(expected, str) and hmac.compare_digest(expected, actual)

def main(argv=None) -> int:
    p = argparse.ArgumentParser(); sub = p.add_subparsers(dest="cmd", required=True)
    c = sub.add_parser("create"); c.add_argument("registry", type=Path); c.add_argument("--principal", required=True)
    q = sub.add_parser("check"); q.add_argument("registry", type=Path); q.add_argument("--task-id", required=True); q.add_argument("--principal", required=True)
    a = p.parse_args(argv)
    try:
        k = key()
        if a.cmd == "create": print(create_binding(a.registry, a.principal, k)); return 0
        ok = check_binding(a.registry, a.task_id, a.principal, k)
        print("ALLOW" if ok else "DENY"); return 0 if ok else 2
    except ValueError as exc:
        print(f"configuration-error: {exc}", file=sys.stderr); return 1
if __name__ == "__main__": raise SystemExit(main())
