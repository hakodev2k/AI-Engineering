#!/usr/bin/env python3
"""Evaluate workspace-scan measurements against explicit performance budgets."""
from __future__ import annotations
import argparse, json, sys


def load(path):
    with open(path, "r", encoding="utf-8") as f:
        x = json.load(f)
    if not isinstance(x, dict):
        raise ValueError(f"{path}: JSON root must be object")
    return x


def elapsed(m):
    return float(m.get("elapsed_ms", 0)) if isinstance(m, dict) else 0.0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("measurement")
    ap.add_argument("--policy", required=True)
    ap.add_argument("--baseline")
    args = ap.parse_args()
    try:
        m = load(args.measurement)
        p = load(args.policy)
        b = load(args.baseline) if args.baseline else None
    except (OSError, json.JSONDecodeError, ValueError) as e:
        print(json.dumps({"status": "error", "error": str(e)}), file=sys.stderr)
        return 2

    limits = p.get("limits", {})
    failures, warnings, recommendations = [], [], []
    gs = elapsed(m.get("git_status_untracked"))
    walk = elapsed(m.get("bounded_walk"))
    max_git = float(limits.get("maxGitStatusMs", 2000))
    max_walk = float(limits.get("maxBoundedWalkMs", 3000))

    if m.get("git_status_untracked", {}).get("timeout"):
        failures.append("git status with untracked files timed out")
    elif gs > max_git:
        failures.append(f"git status {gs:.1f}ms exceeds {max_git:.1f}ms")
    if walk > max_walk:
        failures.append(f"bounded walk {walk:.1f}ms exceeds {max_walk:.1f}ms")
    if m.get("bounded_walk", {}).get("bounded"):
        warnings.append("bounded walk hit max entry budget before completion")
    if m.get("cross_fs_risk"):
        warnings.append("workspace is under /mnt/ in WSL-like environment")
        recommendations.append("Prefer Linux filesystem paths for Linux-side agent/build workloads.")
    if gs > max_git:
        recommendations += [
            "Inspect large untracked/generated directories and add safe ignore/exclude rules.",
            "Evaluate core.untrackedCache and core.fsmonitor where supported.",
            "Do not switch to unsafe/full-access sandbox modes solely for performance."
        ]
    if b:
        pct = float(limits.get("maxRegressionPercent", 50))
        base = elapsed(b.get("git_status_untracked"))
        if base > 0 and gs > base * (1 + pct / 100):
            failures.append(f"git status regressed > {pct:.1f}% vs baseline ({base:.1f}ms -> {gs:.1f}ms)")

    out = {
        "status": "fail" if failures else "pass",
        "failures": failures,
        "warnings": warnings,
        "recommendations": recommendations,
        "metrics": {"git_status_untracked_ms": gs, "bounded_walk_ms": walk}
    }
    print(json.dumps(out, indent=2))
    return 3 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
