#!/usr/bin/env python3
import argparse
import hashlib
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

PACKAGE_NAMES = {"package.json", "package-lock.json", "pnpm-lock.yaml", "yarn.lock", "pyproject.toml", "requirements.txt", "poetry.lock", "Pipfile", "Pipfile.lock", "Directory.Packages.props", "packages.lock.json"}
IGNORED = {".git", "node_modules", "bin", "obj", ".venv", "venv", "dist", "build"}


def git(root, *args):
    p = subprocess.run(["git", "-C", str(root), *args], text=True, capture_output=True)
    if p.returncode != 0:
        raise RuntimeError(p.stderr.strip() or "git command failed")
    return p.stdout.strip()


def digest(path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def package_files(root):
    files = []
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        rel_parts = path.relative_to(root).parts
        if any(part in IGNORED for part in rel_parts):
            continue
        if path.name in PACKAGE_NAMES or path.suffix in {".csproj", ".fsproj", ".vbproj"}:
            files.append(path)
    return sorted(files)


def main():
    ap = argparse.ArgumentParser(description="Capture a dependency-upgrade baseline.")
    ap.add_argument("--root", default=".")
    ap.add_argument("--allow-dirty", action="store_true")
    args = ap.parse_args()
    root = Path(args.root).resolve()
    if not root.is_dir():
        raise SystemExit(f"Invalid root: {root}")
    try:
        head = git(root, "rev-parse", "HEAD")
        status = git(root, "status", "--porcelain")
    except RuntimeError as exc:
        raise SystemExit(str(exc))
    if status and not args.allow_dirty:
        raise SystemExit("Working tree is not clean; baseline capture blocked.")
    files = package_files(root)
    data = {
        "captured_at": datetime.now(timezone.utc).isoformat(),
        "root": str(root),
        "head": head,
        "git_status": status.splitlines() if status else [],
        "files": {p.relative_to(root).as_posix(): {"sha256": digest(p), "size": p.stat().st_size} for p in files},
    }
    outdir = root / ".ai" / "dependency-upgrade-canary"
    outdir.mkdir(parents=True, exist_ok=True)
    out = outdir / "baseline.json"
    out.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
