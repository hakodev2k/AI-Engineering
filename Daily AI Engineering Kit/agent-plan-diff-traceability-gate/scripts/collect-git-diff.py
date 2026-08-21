#!/usr/bin/env python3
import hashlib
import json
import subprocess
import sys


def run(*args):
    p = subprocess.run(args, text=True, capture_output=True)
    if p.returncode != 0:
        raise RuntimeError(p.stderr.strip() or "command failed")
    return p.stdout


def sha(text):
    return hashlib.sha256(text.encode("utf-8", errors="replace")).hexdigest()


def main():
    if len(sys.argv) != 3:
        print("usage: collect-git-diff.py <base> <head>", file=sys.stderr)
        return 2
    base, head = sys.argv[1:]
    try:
        names = run("git", "diff", "--name-status", "--find-renames", base, head)
    except Exception as exc:
        print(f"git diff failed: {exc}", file=sys.stderr)
        return 3
    changes = []
    for raw in names.splitlines():
        if not raw.strip():
            continue
        parts = raw.split("\t")
        code = parts[0]
        if code.startswith("R") and len(parts) >= 3:
            old_path, path = parts[1], parts[2]
            status = "renamed"
        else:
            path = parts[-1]
            old_path = None
            status = {"A":"added","M":"modified","D":"deleted"}.get(code[:1], "unknown")
        try:
            patch = run("git", "diff", "--no-ext-diff", "--binary", base, head, "--", path)
        except Exception:
            patch = ""
        item = {"path": path, "status": status, "content_fingerprint": sha(patch)}
        if old_path:
            item["old_path"] = old_path
        changes.append(item)
    print(json.dumps({"base_revision": base, "head_revision": head, "changes": changes}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
