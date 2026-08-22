#!/usr/bin/env python3
import argparse, json, subprocess, sys
from datetime import datetime, timezone
from pathlib import Path


def git(repo, *args):
    p = subprocess.run(["git", "-C", repo, *args], text=True, capture_output=True)
    if p.returncode != 0:
        raise RuntimeError(p.stderr.strip() or "git command failed")
    return p.stdout.strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", required=True)
    ap.add_argument("--target", required=True)
    ap.add_argument("--head", required=True)
    ap.add_argument("--plan", required=True)
    ap.add_argument("--output", required=True)
    ns = ap.parse_args()
    try:
        plan = json.loads(Path(ns.plan).read_text(encoding="utf-8"))
        plan_id = str(plan["plan_id"]).strip()
        paths = plan.get("planned_scope", {}).get("paths", [])
        if not plan_id or not isinstance(paths, list) or not paths:
            raise ValueError("plan_id and planned_scope.paths are required")
        target_sha = git(ns.repo, "rev-parse", ns.target)
        head_sha = git(ns.repo, "rev-parse", ns.head)
        base_sha = git(ns.repo, "merge-base", ns.target, ns.head)
        record = {
            "version": "1.0.0",
            "plan_id": plan_id,
            "plan_revision": int(plan.get("plan_revision", 1)),
            "repository": str(Path(ns.repo).resolve()),
            "captured_at": datetime.now(timezone.utc).isoformat(),
            "refs": {"target_ref": ns.target, "head_ref": ns.head, "target_sha": target_sha, "head_sha": head_sha, "merge_base_sha": base_sha},
            "planned_scope": plan["planned_scope"],
            "assumptions": plan.get("assumptions", []),
            "steps": plan.get("steps", []),
            "tests": plan.get("tests", []),
            "risk": plan.get("risk", "medium"),
            "baseline_missing": False
        }
        Path(ns.output).write_text(json.dumps(record, indent=2) + "\n", encoding="utf-8")
        print(ns.output)
        return 0
    except (OSError, ValueError, KeyError, RuntimeError, json.JSONDecodeError) as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 2

if __name__ == "__main__":
    raise SystemExit(main())
