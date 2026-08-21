#!/usr/bin/env python3
"""Measure workspace scan costs with bounded, read-only probes."""
from __future__ import annotations
import argparse, json, os, platform, subprocess, time
from pathlib import Path


def timed(cmd, cwd, timeout):
    t0 = time.perf_counter()
    try:
        p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=timeout)
        ok = p.returncode == 0
        err = p.stderr.strip()
    except subprocess.TimeoutExpired:
        return {"ok": False, "timeout": True, "elapsed_ms": round((time.perf_counter()-t0)*1000, 2)}
    return {"ok": ok, "timeout": False, "elapsed_ms": round((time.perf_counter()-t0)*1000, 2), "stderr": err[:500]}


def bounded_walk(root: Path, max_entries: int, prune: set[str]):
    count = dirs = files = max_depth = 0
    base_parts = len(root.parts)
    t0 = time.perf_counter()
    for cur, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in prune]
        dirs += len(dirnames)
        files += len(filenames)
        count += len(dirnames) + len(filenames)
        max_depth = max(max_depth, len(Path(cur).parts)-base_parts)
        if count >= max_entries:
            return {"entries_seen": count, "dirs_seen": dirs, "files_seen": files, "max_depth": max_depth,
                    "bounded": True, "elapsed_ms": round((time.perf_counter()-t0)*1000, 2)}
    return {"entries_seen": count, "dirs_seen": dirs, "files_seen": files, "max_depth": max_depth,
            "bounded": False, "elapsed_ms": round((time.perf_counter()-t0)*1000, 2)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("workspace", nargs="?", default=".")
    ap.add_argument("--timeout", type=float, default=10)
    ap.add_argument("--max-entries", type=int, default=50000)
    ap.add_argument("--output")
    args = ap.parse_args()
    root = Path(args.workspace).resolve()
    if not root.is_dir():
        raise SystemExit("workspace is not a directory")
    prune = {".git", "node_modules", ".pnpm-store", ".next", "dist", "build", "bin", "obj", "coverage", ".cache", ".venv", "venv"}
    result = {
        "workspace": str(root),
        "platform": platform.platform(),
        "is_wsl": bool(os.environ.get("WSL_DISTRO_NAME")) or "microsoft" in platform.release().lower(),
        "cross_fs_risk": str(root).startswith("/mnt/"),
        "git_status": timed(["git", "--no-optional-locks", "status", "--porcelain=v1", "-uno"], str(root), args.timeout),
        "git_status_untracked": timed(["git", "--no-optional-locks", "status", "--porcelain=v1"], str(root), args.timeout),
        "bounded_walk": bounded_walk(root, args.max_entries, prune),
        "pruned_names": sorted(prune),
        "measured_at_epoch": time.time()
    }
    text = json.dumps(result, indent=2)
    if args.output:
        Path(args.output).write_text(text + "\n", encoding="utf-8")
    print(text)


if __name__ == "__main__":
    main()
