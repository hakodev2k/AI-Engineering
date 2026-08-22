#!/usr/bin/env python3
import argparse
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None


def run(cmd, root):
    p = subprocess.run(cmd, cwd=root, shell=True, text=True, capture_output=True)
    return {"command": cmd, "exit_code": p.returncode, "stdout": p.stdout[-12000:], "stderr": p.stderr[-12000:]}


def git(root, *args):
    p = subprocess.run(["git", "-C", str(root), *args], text=True, capture_output=True)
    if p.returncode != 0:
        raise RuntimeError(p.stderr.strip() or "git failed")
    return p.stdout.strip()


def load_request(path):
    text = path.read_text(encoding="utf-8")
    if path.suffix.lower() == ".json":
        return json.loads(text)
    if yaml is None:
        raise RuntimeError("PyYAML is required for YAML requests. Install: python -m pip install -r scripts/requirements.txt")
    return yaml.safe_load(text)


def main():
    ap = argparse.ArgumentParser(description="Verify a scoped dependency upgrade.")
    ap.add_argument("--root", default=".")
    ap.add_argument("--request", required=True)
    args = ap.parse_args()
    root = Path(args.root).resolve()
    request_path = Path(args.request).resolve()
    baseline_path = root / ".ai" / "dependency-upgrade-canary" / "baseline.json"
    if not root.is_dir() or not request_path.is_file():
        raise SystemExit("Root or request file not found.")
    if not baseline_path.is_file():
        raise SystemExit(f"Missing baseline: {baseline_path}")
    try:
        request = load_request(request_path)
        baseline = json.loads(baseline_path.read_text(encoding="utf-8"))
        changed = [line for line in git(root, "diff", "--name-only", baseline["head"]).splitlines() if line]
    except (RuntimeError, ValueError, KeyError) as exc:
        raise SystemExit(str(exc))

    required = ["target", "requested_version", "ecosystem", "verification_commands"]
    missing = [key for key in required if not request.get(key)]
    if missing:
        raise SystemExit("Missing request fields: " + ", ".join(missing))

    expected = set(request.get("expected_files") or [])
    unexpected = sorted(set(changed) - expected) if expected else []
    results = [run(cmd, root) for cmd in request["verification_commands"]]
    commands_ok = all(item["exit_code"] == 0 for item in results)

    baseline_package_files = set((baseline.get("files") or {}).keys())
    dependency_files_changed = sorted(set(changed) & baseline_package_files)
    lock_markers = ("lock", "packages.lock.json")
    lockfile_changed = any(any(marker in path.lower() for marker in lock_markers) for path in dependency_files_changed)

    status = "verified" if commands_ok and not unexpected and dependency_files_changed else "failed"
    output = {
        "verified_at": datetime.now(timezone.utc).isoformat(),
        "status": status,
        "baseline_head": baseline.get("head"),
        "target": request.get("target"),
        "requested_version": request.get("requested_version"),
        "changed_files": changed,
        "dependency_files_changed": dependency_files_changed,
        "lockfile_changed": lockfile_changed,
        "unexpected_files": unexpected,
        "commands_ok": commands_ok,
        "command_results": results,
        "notes": [
            "Target version resolution must also be confirmed by the independent verifier using the ecosystem package manager.",
            "A missing lockfile delta is informational for projects that do not use lockfiles."
        ]
    }
    outdir = root / ".ai" / "dependency-upgrade-canary"
    outdir.mkdir(parents=True, exist_ok=True)
    out = outdir / "verification.json"
    out.write_text(json.dumps(output, indent=2), encoding="utf-8")
    print(json.dumps({"status": status, "verification": str(out)}, indent=2))
    return 0 if status == "verified" else 3


if __name__ == "__main__":
    raise SystemExit(main())
