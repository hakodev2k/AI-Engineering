#!/usr/bin/env python3
"""Deterministic stale-file compare-and-swap guard for AI agent write workflows.

Exit codes:
  0 = pass
  2 = stale snapshot / policy violation
  3 = invalid input
  4 = I/O failure

The guard never mutates protected target files. It only reads them and writes
explicit snapshot/report JSON artifacts requested by the caller.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import sys
from typing import Any


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def resolve_under_root(root: Path, value: str) -> Path:
    root = root.resolve()
    candidate = (root / value).resolve() if not Path(value).is_absolute() else Path(value).resolve()
    try:
        candidate.relative_to(root)
    except ValueError as exc:
        raise ValueError(f"path escapes root: {value}") from exc
    return candidate


def describe(root: Path, path: Path) -> dict[str, Any]:
    rel = path.resolve().relative_to(root.resolve()).as_posix()
    if not path.exists():
        return {"path": rel, "exists": False, "sha256": None, "size": None, "mtime_ns": None}
    if not path.is_file():
        raise ValueError(f"not a regular file: {rel}")
    st = path.stat()
    return {
        "path": rel,
        "exists": True,
        "sha256": sha256_file(path),
        "size": st.st_size,
        "mtime_ns": st.st_mtime_ns,
    }


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    with tmp.open("w", encoding="utf-8", newline="\n") as f:
        json.dump(value, f, indent=2, sort_keys=True)
        f.write("\n")
    os.replace(tmp, path)


def snapshot(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    if not root.is_dir():
        print(f"invalid root: {root}", file=sys.stderr)
        return 3
    try:
        records = [describe(root, resolve_under_root(root, p)) for p in args.paths]
        payload = {"version": 1, "root": str(root), "files": records}
        write_json(Path(args.output), payload)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"snapshot failed: {exc}", file=sys.stderr)
        return 4
    print(json.dumps({"status": "snapshotted", "count": len(records)}))
    return 0


def compare_record(expected: dict[str, Any], current: dict[str, Any]) -> dict[str, Any] | None:
    if bool(expected.get("exists")) != bool(current.get("exists")):
        return {
            "path": expected.get("path"),
            "reason": "existence_changed",
            "expected_exists": expected.get("exists"),
            "current_exists": current.get("exists"),
        }
    if not expected.get("exists"):
        return None
    if expected.get("sha256") != current.get("sha256"):
        return {
            "path": expected.get("path"),
            "reason": "content_hash_changed",
            "expected_sha256": expected.get("sha256"),
            "current_sha256": current.get("sha256"),
            "expected_size": expected.get("size"),
            "current_size": current.get("size"),
            "expected_mtime_ns": expected.get("mtime_ns"),
            "current_mtime_ns": current.get("mtime_ns"),
        }
    return None


def verify(args: argparse.Namespace) -> int:
    try:
        snap = load_json(Path(args.snapshot))
        root = Path(args.root or snap.get("root", ".")).resolve()
        files = snap.get("files")
        if not isinstance(files, list):
            raise ValueError("snapshot.files must be an array")
        stale = []
        verified = 0
        for expected in files:
            if not isinstance(expected, dict) or "path" not in expected:
                raise ValueError("invalid snapshot record")
            current = describe(root, resolve_under_root(root, str(expected["path"])))
            diff = compare_record(expected, current)
            if diff:
                stale.append(diff)
            else:
                verified += 1
        report = {
            "status": "stale" if stale else "fresh",
            "verified": verified,
            "stale_count": len(stale),
            "stale": stale,
        }
        if args.report:
            write_json(Path(args.report), report)
        print(json.dumps(report, sort_keys=True))
        return 2 if stale else 0
    except ValueError as exc:
        print(f"verify invalid input: {exc}", file=sys.stderr)
        return 3
    except (OSError, json.JSONDecodeError) as exc:
        print(f"verify failed: {exc}", file=sys.stderr)
        return 4


def post_verify(args: argparse.Namespace) -> int:
    """Verify current files match an expected post-write snapshot.

    The expected snapshot should be captured from the intended materialized
    output in a temporary/staging location or immediately after a trusted
    mutation step. This command proves the current bytes equal that expected
    state; it does not decide whether the change is semantically correct.
    """
    return verify(args)


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description=__doc__)
    sub = p.add_subparsers(dest="command", required=True)

    s = sub.add_parser("snapshot", help="capture content-version tokens for files")
    s.add_argument("--root", required=True)
    s.add_argument("--output", required=True)
    s.add_argument("paths", nargs="+")
    s.set_defaults(func=snapshot)

    v = sub.add_parser("verify", help="fail if any file differs from captured snapshot")
    v.add_argument("--snapshot", required=True)
    v.add_argument("--root")
    v.add_argument("--report")
    v.set_defaults(func=verify)

    pv = sub.add_parser("post-verify", help="verify current files against expected post-write snapshot")
    pv.add_argument("--snapshot", required=True)
    pv.add_argument("--root")
    pv.add_argument("--report")
    pv.set_defaults(func=post_verify)
    return p


def main() -> int:
    args = build_parser().parse_args()
    return int(args.func(args))


if __name__ == "__main__":
    raise SystemExit(main())
