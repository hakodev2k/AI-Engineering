#!/usr/bin/env python3
import argparse
import json
import subprocess
import sys
from pathlib import Path


def run_git(args):
    p = subprocess.run(["git", *args], capture_output=True, text=True)
    if p.returncode != 0:
        raise RuntimeError(p.stderr.strip() or "git command failed")
    return p.stdout


def load_config(path):
    with open(path, "r", encoding="utf-8") as f:
        cfg = json.load(f)
    for key in ("thresholds", "weights", "patterns", "approval_required_categories"):
        if key not in cfg:
            raise ValueError(f"missing config key: {key}")
    return cfg


def classify(path, cfg):
    p = path.lower().replace("\\", "/")
    categories = []
    for category, patterns in cfg["patterns"].items():
        for pattern in patterns:
            pattern = pattern.lower()
            if pattern.startswith(".") and p.endswith(pattern):
                categories.append(category)
                break
            if pattern in p:
                categories.append(category)
                break
    return sorted(set(categories))


def assess(changed_files, cfg, tests_changed=False):
    findings = []
    categories = set()
    score = 0
    for path in changed_files:
        cats = classify(path, cfg)
        if cats:
            findings.append({"path": path, "categories": cats})
        for cat in cats:
            if cat not in categories:
                score += int(cfg["weights"].get(cat, 0))
                categories.add(cat)

    code_like = any(Path(p).suffix.lower() in {".cs", ".py", ".js", ".ts", ".tsx", ".java", ".go", ".rs"} for p in changed_files)
    if code_like and not tests_changed:
        score += int(cfg["weights"].get("test_gap", 0))
        categories.add("test_gap")

    t = cfg["thresholds"]
    if score >= t["high"]:
        level = "high"
    elif score >= t["medium"]:
        level = "medium"
    else:
        level = "low"

    approvals = sorted(categories.intersection(cfg["approval_required_categories"]))
    return {
        "status": "needs-approval" if approvals else "ready-for-review",
        "risk_score": score,
        "risk_level": level,
        "changed_files": changed_files,
        "detected_categories": sorted(categories),
        "approval_required_for": approvals,
        "findings": findings,
        "tests_changed": tests_changed,
        "rollback_readiness": {
            "required_evidence": cfg.get("required_rollback_evidence", []),
            "evidence_complete": False
        }
    }


def main():
    ap = argparse.ArgumentParser(description="Assess rollback readiness risk from a Git diff")
    ap.add_argument("--base", default="HEAD~1")
    ap.add_argument("--head", default="HEAD")
    ap.add_argument("--config", required=True)
    ap.add_argument("--output")
    args = ap.parse_args()

    try:
        cfg = load_config(args.config)
        raw = run_git(["diff", "--name-only", f"{args.base}...{args.head}"])
        files = [x.strip() for x in raw.splitlines() if x.strip()]
        tests_changed = any("test" in p.lower() or "spec" in p.lower() for p in files)
        result = assess(files, cfg, tests_changed)
        encoded = json.dumps(result, indent=2, sort_keys=True)
        if args.output:
            Path(args.output).parent.mkdir(parents=True, exist_ok=True)
            Path(args.output).write_text(encoded + "\n", encoding="utf-8")
        else:
            print(encoded)
        return 2 if result["status"] == "needs-approval" else 0
    except (OSError, ValueError, RuntimeError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
