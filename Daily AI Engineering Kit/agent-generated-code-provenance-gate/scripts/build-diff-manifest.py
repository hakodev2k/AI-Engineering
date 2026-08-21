#!/usr/bin/env python3
import argparse, hashlib, json, subprocess, sys
from pathlib import Path


def run_git(repo, args):
    p = subprocess.run(["git", "-C", str(repo), *args], text=True, capture_output=True)
    if p.returncode != 0:
        raise RuntimeError(p.stderr.strip() or "git command failed")
    return p.stdout


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", default=".")
    ap.add_argument("--baseline", required=True)
    ap.add_argument("--output", required=True)
    args = ap.parse_args()
    repo = Path(args.repo).resolve()
    if not (repo / ".git").exists():
        print("ERROR: repository root must contain .git", file=sys.stderr); return 2
    try:
        run_git(repo, ["rev-parse", "--verify", args.baseline])
        names = run_git(repo, ["diff", "--name-status", args.baseline, "--"])
        stats = run_git(repo, ["diff", "--numstat", args.baseline, "--"])
        patch = run_git(repo, ["diff", "--no-ext-diff", "--binary", args.baseline, "--"])
    except RuntimeError as e:
        print(f"ERROR: {e}", file=sys.stderr); return 3
    stat_map = {}
    for line in stats.splitlines():
        parts = line.split("\t")
        if len(parts) >= 3:
            stat_map[parts[-1]] = {"additions": parts[0], "deletions": parts[1]}
    files = []
    for line in names.splitlines():
        parts = line.split("\t")
        if len(parts) < 2: continue
        status, path = parts[0], parts[-1]
        files.append({"path": path, "status": status, **stat_map.get(path, {"additions":"0","deletions":"0"})})
    normalized = patch.replace("\r\n", "\n").encode("utf-8")
    data = {"version":1,"baseline_ref":args.baseline,"diff_sha256":hashlib.sha256(normalized).hexdigest(),"files":files}
    out = Path(args.output); out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status":"ok","files":len(files),"diff_sha256":data["diff_sha256"]}))
    return 0

if __name__ == "__main__": raise SystemExit(main())
