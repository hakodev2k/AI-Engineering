#!/usr/bin/env python3
"""Persist exact tool output and emit/verify compact residual metadata.

Exit codes: 0 success, 2 integrity/range failure, 3 usage/environment failure.
"""
from __future__ import annotations
import argparse, hashlib, json, os, tempfile
from datetime import datetime, timezone
from pathlib import Path


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def atomic_write(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix=".residual-", dir=str(path.parent))
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(data); f.flush(); os.fsync(f.fileno())
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp): os.unlink(tmp)


def preview(data: bytes, limit: int) -> str:
    if limit < 32: raise ValueError("preview limit must be >= 32")
    text = data.decode("utf-8", "replace")
    if len(text) <= limit: return text
    half = max(1, (limit - 29) // 2)
    return text[:half] + "\n...[content omitted]...\n" + text[-half:]


def capture(args) -> int:
    raw = Path(args.input).read_bytes()
    digest = sha256(raw)
    artifact_dir = Path(args.artifact_dir)
    artifact = artifact_dir / f"{digest}.bin"
    if artifact.exists():
        if sha256(artifact.read_bytes()) != digest:
            print("existing artifact hash mismatch", flush=True); return 2
    else:
        atomic_write(artifact, raw)
    meta = {
        "version": 1,
        "tool": args.tool,
        "invocation_id": args.invocation_id,
        "sha256": digest,
        "artifact": str(artifact),
        "bytes": len(raw),
        "lines": raw.count(b"\n") + (1 if raw and not raw.endswith(b"\n") else 0),
        "inline_budget_bytes": args.inline_budget,
        "truncated": len(raw) > args.inline_budget,
        "preview": preview(raw, args.inline_budget),
        "completed": args.completed,
        "exit_code": args.exit_code,
        "captured_at": datetime.now(timezone.utc).isoformat(),
    }
    out = Path(args.residual)
    atomic_write(out, (json.dumps(meta, indent=2, ensure_ascii=False) + "\n").encode())
    print(json.dumps({"status":"captured","sha256":digest,"artifact":str(artifact),"residual":str(out)}))
    return 0


def load_residual(path: Path) -> dict:
    obj = json.loads(path.read_text(encoding="utf-8"))
    required = {"sha256","artifact","bytes","truncated","completed"}
    if not isinstance(obj, dict) or not required.issubset(obj):
        raise ValueError("invalid residual schema")
    return obj


def verify(args) -> int:
    meta = load_residual(Path(args.residual)); p = Path(meta["artifact"])
    if not p.is_file(): print("artifact missing"); return 2
    raw = p.read_bytes()
    ok = len(raw) == int(meta["bytes"]) and sha256(raw) == meta["sha256"]
    print(json.dumps({"status":"verified" if ok else "mismatch","sha256":sha256(raw),"bytes":len(raw)}))
    return 0 if ok else 2


def read_range(args) -> int:
    meta = load_residual(Path(args.residual)); p = Path(meta["artifact"])
    raw = p.read_bytes()
    if sha256(raw) != meta["sha256"]: print("artifact hash mismatch"); return 2
    start = args.start; end = len(raw) if args.end is None else args.end
    if start < 0 or end < start or end > len(raw): print("invalid byte range"); return 2
    os.write(1, raw[start:end])
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(); sub = ap.add_subparsers(dest="cmd", required=True)
    c = sub.add_parser("capture")
    c.add_argument("--input", required=True); c.add_argument("--artifact-dir", required=True)
    c.add_argument("--residual", required=True); c.add_argument("--tool", required=True)
    c.add_argument("--invocation-id", required=True); c.add_argument("--inline-budget", type=int, default=4096)
    c.add_argument("--completed", action="store_true"); c.add_argument("--exit-code", type=int)
    v = sub.add_parser("verify"); v.add_argument("--residual", required=True)
    r = sub.add_parser("read-range"); r.add_argument("--residual", required=True); r.add_argument("--start", type=int, default=0); r.add_argument("--end", type=int)
    args = ap.parse_args()
    try:
        return {"capture":capture,"verify":verify,"read-range":read_range}[args.cmd](args)
    except (OSError, ValueError, json.JSONDecodeError) as e:
        print(f"error: {e}"); return 3


if __name__ == "__main__": raise SystemExit(main())
