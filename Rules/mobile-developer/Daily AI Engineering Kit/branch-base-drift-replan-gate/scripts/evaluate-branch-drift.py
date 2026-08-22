#!/usr/bin/env python3
import argparse, fnmatch, json, subprocess, sys
from pathlib import Path


def git(repo, *args):
    p = subprocess.run(["git", "-C", repo, *args], text=True, capture_output=True)
    if p.returncode != 0:
        raise RuntimeError(p.stderr.strip() or "git command failed")
    return p.stdout.strip()


def matches(path, patterns):
    return any(fnmatch.fnmatch(path, p) or fnmatch.fnmatch("/" + path, p) for p in patterns)


def overlaps(path, planned):
    norm = path.rstrip("/")
    for p in planned:
        q = p.rstrip("/")
        if fnmatch.fnmatch(path, p) or norm.startswith(q + "/") or q.startswith(norm + "/") or norm == q:
            return True
    return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", required=True)
    ap.add_argument("--record", required=True)
    ap.add_argument("--policy", required=True)
    ap.add_argument("--output", required=True)
    ns = ap.parse_args()
    try:
        record = json.loads(Path(ns.record).read_text(encoding="utf-8"))
        policy = json.loads(Path(ns.policy).read_text(encoding="utf-8"))
        refs = record["refs"]
        current_target = git(ns.repo, "rev-parse", refs["target_ref"])
        current_head = git(ns.repo, "rev-parse", refs["head_ref"])
        current_base = git(ns.repo, "merge-base", refs["target_ref"], refs["head_ref"])
        baseline_target = refs["target_sha"]
        changed = []
        if current_target != baseline_target:
            out = git(ns.repo, "diff", "--name-only", f"{baseline_target}..{current_target}")
            changed = [x for x in out.splitlines() if x.strip()]
        planned = record.get("planned_scope", {}).get("paths", [])
        direct_overlap = [p for p in changed if overlaps(p, planned)]
        high = [p for p in changed if matches(p, policy.get("high_risk_path_patterns", []))]
        public = [p for p in changed if matches(p, policy.get("public_contract_path_patterns", []))]
        shared = [p for p in changed if matches(p, policy.get("shared_path_patterns", []))]
        reasons = []
        review_reasons = []
        if current_target != baseline_target: reasons.append("target-branch-advanced")
        if current_base != refs["merge_base_sha"]: reasons.append("merge-base-changed")
        if direct_overlap: reasons.append("planned-scope-overlap")
        if high: review_reasons.append("high-risk-overlap")
        if public: review_reasons.append("public-contract-overlap")
        if shared: review_reasons.append("shared-boundary-overlap")
        if record.get("baseline_missing"): review_reasons.append("missing-original-baseline")
        if not reasons and not review_reasons:
            status = "fresh"
        elif review_reasons:
            status = "review-required"
        else:
            status = "replan-required"
        report = {
            "version": "1.0.0",
            "plan_id": record["plan_id"],
            "plan_revision": record["plan_revision"],
            "status": status,
            "baseline": {"target_sha": baseline_target, "head_sha": refs["head_sha"], "merge_base_sha": refs["merge_base_sha"]},
            "current": {"target_sha": current_target, "head_sha": current_head, "merge_base_sha": current_base},
            "changed_since_baseline": changed,
            "direct_overlap": direct_overlap,
            "high_risk_overlap": high,
            "public_contract_overlap": public,
            "shared_boundary_overlap": shared,
            "reasons": reasons,
            "review_reasons": sorted(set(review_reasons))
        }
        Path(ns.output).write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
        print(status)
        return 0 if status == "fresh" else 3
    except (OSError, KeyError, ValueError, RuntimeError, json.JSONDecodeError) as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 2

if __name__ == "__main__": raise SystemExit(main())
