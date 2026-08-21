#!/usr/bin/env python3
import argparse, hashlib, json, os, subprocess, sys
from datetime import datetime, timezone
from pathlib import Path


def run_git(repo, *args):
    p = subprocess.run(["git", "-C", str(repo), *args], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if p.returncode != 0:
        raise RuntimeError(p.stderr.decode("utf-8", "replace").strip() or "git command failed")
    return p.stdout


def file_hash(path, max_bytes):
    try:
        if not path.is_file() or path.stat().st_size > max_bytes:
            return None
        h = hashlib.sha256()
        with path.open("rb") as f:
            for chunk in iter(lambda: f.read(1024 * 1024), b""):
                h.update(chunk)
        return h.hexdigest()
    except OSError:
        return None


def parse_status(raw, root, max_bytes):
    parts = raw.split(b"\0")
    entries = []
    i = 0
    while i < len(parts):
        token = parts[i]
        i += 1
        if not token:
            continue
        text = token.decode("utf-8", "surrogateescape")
        if len(text) < 4:
            continue
        xy, path = text[:2], text[3:]
        kind = "untracked" if xy == "??" else "ignored" if xy == "!!" else "tracked"
        if "R" in xy or "C" in xy:
            kind = "renamed"
            if i < len(parts) and parts[i]:
                old_path = parts[i].decode("utf-8", "surrogateescape")
                i += 1
                path = path
                # old path is evidence only; encode it into status without changing contract.
                xy = xy + ":from=" + old_path
        content_sha = file_hash(root / path, max_bytes)
        entries.append({
            "path": path.replace("\\", "/"),
            "index_status": xy[0] if xy else " ",
            "worktree_status": xy[1] if len(xy) > 1 else " ",
            "kind": kind,
            "content_sha256": content_sha,
        })
    return sorted(entries, key=lambda e: e["path"])


def main():
    ap = argparse.ArgumentParser(description="Capture deterministic Git workspace baseline/current snapshot")
    ap.add_argument("--repo", default=".")
    ap.add_argument("--output", required=True)
    ap.add_argument("--max-file-bytes", type=int, default=10 * 1024 * 1024)
    args = ap.parse_args()
    repo = Path(args.repo).resolve()
    if args.max_file_bytes < 0:
        print("--max-file-bytes must be >= 0", file=sys.stderr); return 2
    try:
        root = Path(run_git(repo, "rev-parse", "--show-toplevel").decode().strip()).resolve()
        head = run_git(root, "rev-parse", "HEAD").decode().strip()
        raw = run_git(root, "status", "--porcelain=v1", "-z", "--untracked-files=all")
        entries = parse_status(raw, root, args.max_file_bytes)
    except Exception as ex:
        print(f"capture failed: {ex}", file=sys.stderr); return 3
    canonical = json.dumps({"head": head, "entries": entries}, sort_keys=True, separators=(",", ":")).encode()
    result = {
        "version": "1.0.0",
        "captured_at": datetime.now(timezone.utc).isoformat(),
        "repository_root": str(root),
        "head": head,
        "status_fingerprint": hashlib.sha256(canonical).hexdigest(),
        "entries": entries,
    }
    Path(args.output).write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": "captured", "head": head, "dirty_entries": len(entries), "fingerprint": result["status_fingerprint"]}))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
