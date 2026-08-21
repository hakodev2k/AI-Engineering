#!/usr/bin/env python3
import argparse, hashlib, json, os, subprocess, sys, time
from pathlib import Path

EXIT_OK = 0
EXIT_REVALIDATE = 10
EXIT_HARD_STOP = 20
EXIT_ERROR = 30


def run_git(root, *args):
    p = subprocess.run(["git", "-C", str(root), *args], capture_output=True, text=True)
    if p.returncode != 0:
        return None
    return p.stdout.strip()


def sha256_file(path, max_bytes):
    st = path.stat()
    if st.st_size > max_bytes:
        raise ValueError(f"file exceeds max hash bytes: {path} ({st.st_size})")
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def status_digest(root):
    text = run_git(root, "status", "--porcelain=v1", "--untracked-files=normal")
    if text is None:
        return None
    return hashlib.sha256(text.encode()).hexdigest()


def repo_identity(root):
    root = root.resolve()
    top = run_git(root, "rev-parse", "--show-toplevel")
    return str(Path(top).resolve()) if top else str(root)


def capture(args):
    root = Path(args.root).resolve()
    if not root.exists():
        raise ValueError("root does not exist")
    files = []
    seen = set()
    for raw in args.files:
        p = (root / raw).resolve() if not Path(raw).is_absolute() else Path(raw).resolve()
        try:
            rel = p.relative_to(root)
        except ValueError:
            raise ValueError(f"tracked path escapes root: {raw}")
        key = rel.as_posix()
        if key in seen:
            continue
        seen.add(key)
        entry = {"path": key, "exists": p.exists()}
        if p.exists():
            if not p.is_file():
                raise ValueError(f"tracked path is not a file: {raw}")
            entry["sha256"] = sha256_file(p, args.max_file_bytes)
            entry["size"] = p.stat().st_size
        files.append(entry)
    branch = run_git(root, "branch", "--show-current")
    head = run_git(root, "rev-parse", "HEAD")
    snap = {
        "schema": 1,
        "created_unix": int(time.time()),
        "root": repo_identity(root),
        "branch": branch,
        "head": head,
        "status_digest": status_digest(root),
        "files": files,
    }
    body = json.dumps(snap, sort_keys=True, separators=(",", ":"))
    snap["snapshot_id"] = hashlib.sha256(body.encode()).hexdigest()[:20]
    out = Path(args.snapshot)
    if not out.is_absolute(): out = root / out
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp = out.with_suffix(out.suffix + ".tmp")
    tmp.write_text(json.dumps(snap, indent=2) + "\n", encoding="utf-8")
    os.replace(tmp, out)
    print(json.dumps({"status":"captured","snapshot_id":snap["snapshot_id"],"tracked_files":len(files)}))
    return EXIT_OK


def load_policy(path):
    if not path: return {}
    return json.loads(Path(path).read_text(encoding="utf-8"))


def check(args):
    root = Path(args.root).resolve()
    snap_path = Path(args.snapshot)
    if not snap_path.is_absolute(): snap_path = root / snap_path
    snap = json.loads(snap_path.read_text(encoding="utf-8"))
    policy = load_policy(args.policy)
    max_bytes = int(policy.get("max_file_bytes_for_hash", args.max_file_bytes))
    changes = []
    hard = []
    current_root = repo_identity(root)
    if current_root != snap.get("root"):
        hard.append({"type":"root","before":snap.get("root"),"after":current_root})
    branch = run_git(root, "branch", "--show-current")
    if branch != snap.get("branch"):
        item={"type":"branch","before":snap.get("branch"),"after":branch}
        (hard if policy.get("hard_stop_on_branch_change", True) else changes).append(item)
    head = run_git(root, "rev-parse", "HEAD")
    if head != snap.get("head"):
        item={"type":"head","before":snap.get("head"),"after":head}
        (hard if policy.get("hard_stop_on_head_change", False) else changes).append(item)
    for old in snap.get("files", []):
        p = root / old["path"]
        if not p.exists():
            item={"type":"file-missing","path":old["path"]}
            (hard if policy.get("hard_stop_on_missing_tracked_file", True) else changes).append(item)
            continue
        digest = sha256_file(p, max_bytes)
        if old.get("sha256") != digest:
            changes.append({"type":"file-changed","path":old["path"],"before":old.get("sha256"),"after":digest})
    cur_status = status_digest(root)
    status_changed = cur_status != snap.get("status_digest")
    if hard:
        result={"classification":"hard-stop","snapshot_id":snap.get("snapshot_id"),"hard_stop":hard,"changes":changes,"status_changed":status_changed}
        print(json.dumps(result, indent=2)); return EXIT_HARD_STOP
    if changes:
        result={"classification":"revalidation-required","snapshot_id":snap.get("snapshot_id"),"changes":changes,"status_changed":status_changed}
        print(json.dumps(result, indent=2)); return EXIT_REVALIDATE
    result={"classification":"non-impacting" if status_changed else "none","snapshot_id":snap.get("snapshot_id"),"changes":[],"status_changed":status_changed}
    print(json.dumps(result, indent=2)); return EXIT_OK


def main():
    p=argparse.ArgumentParser(description="Capture and verify trusted workspace state")
    sp=p.add_subparsers(dest="cmd", required=True)
    c=sp.add_parser("capture"); c.add_argument("--root",default="."); c.add_argument("--snapshot",required=True); c.add_argument("--files",nargs="*",default=[]); c.add_argument("--max-file-bytes",type=int,default=10*1024*1024)
    k=sp.add_parser("check"); k.add_argument("--root",default="."); k.add_argument("--snapshot",required=True); k.add_argument("--policy"); k.add_argument("--max-file-bytes",type=int,default=10*1024*1024)
    a=p.parse_args()
    try: return capture(a) if a.cmd=="capture" else check(a)
    except Exception as e:
        print(json.dumps({"classification":"error","error":str(e)}), file=sys.stderr)
        return EXIT_ERROR

if __name__ == "__main__": sys.exit(main())
