#!/usr/bin/env python3
from __future__ import annotations

import argparse
import configparser
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any

PASS, FAIL, APPROVAL, INVALID, ERROR = 0, 2, 3, 4, 5
VALID_ACTIONS = {"allow", "approval", "deny"}


def run_git(repo: Path, args: list[str], check: bool = True) -> subprocess.CompletedProcess[str]:
    p = subprocess.run(["git", "-C", str(repo), *args], text=True, capture_output=True, check=False)
    if check and p.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} failed: {p.stderr.strip()}")
    return p


def load_policy(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"invalid policy: {exc}") from exc
    if not isinstance(value, dict) or value.get("version") != 1:
        raise ValueError("policy.version must equal 1")
    for key in ["url_change", "branch_tracking_change", "gitlink_change", "dirty_submodule", "uninitialized_submodule", "missing_gitmodules_entry"]:
        if value.get(key) not in VALID_ACTIONS:
            raise ValueError(f"policy.{key} must be allow, approval, or deny")
    if not isinstance(value.get("max_submodules"), int) or value["max_submodules"] < 0:
        raise ValueError("policy.max_submodules must be a non-negative integer")
    return value


def parse_gitmodules(repo: Path, ref: str | None = None) -> dict[str, dict[str, str]]:
    if ref is None:
        path = repo / ".gitmodules"
        if not path.exists():
            return {}
        text = path.read_text(encoding="utf-8")
    else:
        p = run_git(repo, ["show", f"{ref}:.gitmodules"], check=False)
        if p.returncode != 0:
            return {}
        text = p.stdout
    parser = configparser.ConfigParser()
    parser.read_string(text)
    result: dict[str, dict[str, str]] = {}
    for section in parser.sections():
        if not section.startswith("submodule "):
            continue
        path = parser.get(section, "path", fallback="").strip()
        if path:
            result[path] = {
                "url": parser.get(section, "url", fallback="").strip(),
                "branch": parser.get(section, "branch", fallback="").strip(),
            }
    return result


def gitlinks(repo: Path, ref: str) -> dict[str, str]:
    p = run_git(repo, ["ls-tree", "-r", ref])
    out: dict[str, str] = {}
    for line in p.stdout.splitlines():
        meta, _, path = line.partition("\t")
        parts = meta.split()
        if len(parts) >= 3 and parts[0] == "160000":
            out[path] = parts[2]
    return out


def worktree_gitlinks(repo: Path) -> dict[str, str]:
    p = run_git(repo, ["ls-files", "--stage"])
    out: dict[str, str] = {}
    for line in p.stdout.splitlines():
        meta, _, path = line.partition("\t")
        parts = meta.split()
        if len(parts) >= 3 and parts[0] == "160000":
            out[path] = parts[1]
    return out


def add_finding(findings: list[dict[str, Any]], kind: str, path: str, action: str, evidence: dict[str, Any]) -> None:
    findings.append({"kind": kind, "path": path, "action": action, "evidence": evidence})


def scan(repo: Path, baseline: str, policy: dict[str, Any]) -> dict[str, Any]:
    run_git(repo, ["rev-parse", "--is-inside-work-tree"])
    run_git(repo, ["rev-parse", "--verify", baseline])
    base_cfg = parse_gitmodules(repo, baseline)
    cur_cfg = parse_gitmodules(repo)
    base_links = gitlinks(repo, baseline)
    cur_links = worktree_gitlinks(repo)
    paths = sorted(set(base_cfg) | set(cur_cfg) | set(base_links) | set(cur_links))
    findings: list[dict[str, Any]] = []
    if len(paths) > policy["max_submodules"]:
        add_finding(findings, "submodule_count_exceeded", "*", "deny", {"count": len(paths), "max": policy["max_submodules"]})
    for path in paths:
        bcfg, ccfg = base_cfg.get(path), cur_cfg.get(path)
        if path in cur_links and ccfg is None:
            add_finding(findings, "missing_gitmodules_entry", path, policy["missing_gitmodules_entry"], {})
        if bcfg and ccfg and bcfg.get("url") != ccfg.get("url"):
            add_finding(findings, "url_change", path, policy["url_change"], {"before": bcfg.get("url"), "after": ccfg.get("url")})
        if bcfg and ccfg and bcfg.get("branch") != ccfg.get("branch"):
            add_finding(findings, "branch_tracking_change", path, policy["branch_tracking_change"], {"before": bcfg.get("branch"), "after": ccfg.get("branch")})
        if base_links.get(path) != cur_links.get(path):
            add_finding(findings, "gitlink_change", path, policy["gitlink_change"], {"before": base_links.get(path), "after": cur_links.get(path)})
        if path in cur_links:
            sub = repo / path
            if not sub.exists() or not (sub / ".git").exists() and not (sub / ".git").is_file():
                add_finding(findings, "uninitialized_submodule", path, policy["uninitialized_submodule"], {})
            else:
                p = run_git(sub, ["status", "--porcelain"], check=False)
                if p.returncode != 0 or p.stdout.strip():
                    add_finding(findings, "dirty_submodule", path, policy["dirty_submodule"], {"status": p.stdout.splitlines()[:20], "error": p.stderr.strip()})
    actions = [f["action"] for f in findings]
    status = "fail" if "deny" in actions else "approval_required" if "approval" in actions else "pass"
    return {
        "status": status,
        "repo": str(repo.resolve()),
        "baseline": baseline,
        "findings": findings,
        "summary": {
            "submodules_seen": len(paths),
            "finding_count": len(findings),
            "deny_count": actions.count("deny"),
            "approval_count": actions.count("approval")
        }
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", type=Path, default=Path("."))
    ap.add_argument("--policy", type=Path, required=True)
    ap.add_argument("--baseline", default="HEAD")
    ap.add_argument("--output", type=Path)
    args = ap.parse_args()
    try:
        policy = load_policy(args.policy)
        report = scan(args.repo, args.baseline, policy)
        code = PASS if report["status"] == "pass" else FAIL if report["status"] == "fail" else APPROVAL
    except ValueError as exc:
        report, code = {"status": "invalid", "repo": str(args.repo), "baseline": args.baseline, "findings": [], "summary": {}, "error": str(exc)}, INVALID
    except Exception as exc:
        report, code = {"status": "error", "repo": str(args.repo), "baseline": args.baseline, "findings": [], "summary": {}, "error": str(exc)}, ERROR
    text = json.dumps(report, indent=2, sort_keys=True)
    print(text)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text + "\n", encoding="utf-8")
    return code


if __name__ == "__main__":
    raise SystemExit(main())
