#!/usr/bin/env python3
import argparse
import json
import os
import subprocess
import sys
from pathlib import Path


def run_git(args):
    result = subprocess.run(["git", *args], capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "git command failed")
    return result.stdout


def main():
    parser = argparse.ArgumentParser(description="Detect changed repository files safely.")
    parser.add_argument("--base", default=os.getenv("IMPACT_BASE_REF", "HEAD"))
    parser.add_argument("--output", default="changed-files.json")
    parser.add_argument("--include-untracked", action="store_true", default=os.getenv("IMPACT_ALLOW_UNTRACKED") == "1")
    args = parser.parse_args()

    try:
        run_git(["rev-parse", "--is-inside-work-tree"])
        changed = set()

        diff_output = run_git(["diff", "--name-only", args.base, "--"])
        changed.update(line.strip() for line in diff_output.splitlines() if line.strip())

        staged_output = run_git(["diff", "--cached", "--name-only", "--"])
        changed.update(line.strip() for line in staged_output.splitlines() if line.strip())

        if args.include_untracked:
            untracked = run_git(["ls-files", "--others", "--exclude-standard"])
            changed.update(line.strip() for line in untracked.splitlines() if line.strip())

        payload = {
            "base_ref": args.base,
            "include_untracked": args.include_untracked,
            "files": sorted(changed),
        }

        output = Path(args.output)
        output.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
        print(f"Wrote {len(changed)} changed file(s) to {output}")
        return 0
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
