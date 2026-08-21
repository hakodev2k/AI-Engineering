#!/usr/bin/env python3
"""Create/check a content-safe Git workspace fingerprint.
Exit codes: 0 success/match, 2 drift, 3 usage/environment error.
"""
from __future__ import annotations
import argparse, hashlib, json, os, subprocess, sys
from pathlib import Path

def git(*args: str) -> bytes:
    p = subprocess.run(["git", *args], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if p.returncode:
        raise RuntimeError(p.stderr.decode("utf-8", "replace").strip() or "git command failed")
    return p.stdout

def repo_root() -> Path:
    return Path(git("rev-parse", "--show-toplevel").decode().strip()).resolve()

def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def file_digest(root: Path, rel: str) -> str:
    p = (root / rel).resolve()
    try:
        p.relative_to(root)
    except ValueError:
        return "outside-repository"
    if not p.exists(): return "missing"
    if p.is_symlink(): return "symlink:" + os.readlink(p)
    if not p.is_file(): return "non-file"
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def parse_status(raw: bytes) -> list[str]:
    text = raw.decode("utf-8", "surrogateescape"); paths: set[str] = set()
    for rec in text.split("\0"):
        if not rec: continue
        if rec.startswith("1 ") or rec.startswith("u "):
            parts = rec.split(" ", 8)
            if len(parts) == 9: paths.add(parts[8])
        elif rec.startswith("2 "):
            parts = rec.split(" ", 9)
            if len(parts) == 10: paths.add(parts[9])
        elif rec.startswith("? ") or rec.startswith("! "):
            paths.add(rec[2:])
        else:
            paths.add(rec)
    return sorted(paths)

def snapshot() -> dict:
    root = repo_root(); head = git("rev-parse", "HEAD").decode().strip(); branch = git("rev-parse", "--abbrev-ref", "HEAD").decode().strip()
    status = git("status", "--porcelain=v2", "-z", "--untracked-files=all"); paths = parse_status(status)
    payload = {"version":1,"root_name":root.name,"head":head,"branch":branch,"status_sha256":sha256_bytes(status),"changed_paths":paths,"path_digests":{p:file_digest(root,p) for p in paths}}
    payload["fingerprint"] = sha256_bytes(json.dumps(payload, sort_keys=True, separators=(",", ":")).encode())
    return payload

def write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True); path.write_text(json.dumps(data, indent=2, sort_keys=True)+"\n", encoding="utf-8")

def main() -> int:
    ap=argparse.ArgumentParser(); sub=ap.add_subparsers(dest="cmd", required=True)
    b=sub.add_parser("baseline"); b.add_argument("--output", required=True)
    c=sub.add_parser("check"); c.add_argument("--baseline", required=True); args=ap.parse_args()
    try:
        current=snapshot()
        if args.cmd=="baseline":
            write_json(Path(args.output), current); print(json.dumps({"status":"baseline-written","fingerprint":current["fingerprint"]})); return 0
        baseline=json.loads(Path(args.baseline).read_text(encoding="utf-8"))
        if not isinstance(baseline,dict) or "fingerprint" not in baseline: raise ValueError("baseline JSON missing fingerprint")
        matched=baseline["fingerprint"]==current["fingerprint"]
        print(json.dumps({"status":"matched" if matched else "drift","baseline_fingerprint":baseline["fingerprint"],"current_fingerprint":current["fingerprint"],"head_changed":baseline.get("head")!=current.get("head"),"branch_changed":baseline.get("branch")!=current.get("branch"),"changed_paths_before":baseline.get("changed_paths",[]),"changed_paths_now":current.get("changed_paths",[])}, indent=2, sort_keys=True))
        return 0 if matched else 2
    except (OSError,RuntimeError,ValueError,json.JSONDecodeError) as e:
        print(f"workspace-fingerprint error: {e}", file=sys.stderr); return 3
if __name__=="__main__": raise SystemExit(main())