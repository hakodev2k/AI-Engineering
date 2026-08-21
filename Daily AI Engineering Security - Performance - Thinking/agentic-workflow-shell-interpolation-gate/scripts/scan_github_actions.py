#!/usr/bin/env python3
"""Conservative GitHub Actions trust-boundary scanner.

Detects high-risk GitHub context interpolation inside shell `run:` blocks and
review-worthy patterns in agentic workflows. No third-party dependencies.

Exit codes: 0 pass, 2 invalid input/config, 3 blocking finding.
"""
from __future__ import annotations

import argparse
import fnmatch
import json
import re
import sys
from pathlib import Path
from typing import Any

BLOCK = "block"
REVIEW = "review"


def load_json(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read policy {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("policy must be a JSON object")
    return data


def workflow_files(root: Path, patterns: list[str]) -> list[Path]:
    files: set[Path] = set()
    for p in root.rglob("*"):
        if not p.is_file():
            continue
        rel = p.relative_to(root).as_posix()
        if any(fnmatch.fnmatch(rel, pattern) for pattern in patterns):
            files.add(p)
    return sorted(files)


def find_run_blocks(lines: list[str]) -> list[tuple[int, int, str]]:
    """Return (start_line, end_line, text) for simple YAML run blocks."""
    blocks: list[tuple[int, int, str]] = []
    i = 0
    while i < len(lines):
        m = re.match(r"^(\s*)(?:-\s*)?run\s*:\s*(.*)$", lines[i])
        if not m:
            i += 1
            continue
        indent = len(m.group(1))
        tail = m.group(2)
        start = i + 1
        collected = [tail] if tail and tail not in {"|", ">", "|-", ">-"} else []
        j = i + 1
        while j < len(lines):
            raw = lines[j]
            if not raw.strip():
                collected.append(raw)
                j += 1
                continue
            current_indent = len(raw) - len(raw.lstrip(" "))
            if current_indent <= indent:
                break
            collected.append(raw)
            j += 1
        blocks.append((start, j, "\n".join(collected)))
        i = max(j, i + 1)
    return blocks


def scan_file(path: Path, root: Path, policy: dict[str, Any]) -> list[dict[str, Any]]:
    text = path.read_text(encoding="utf-8", errors="replace")
    lines = text.splitlines()
    rel = path.relative_to(root).as_posix()
    findings: list[dict[str, Any]] = []
    high = policy.get("high_risk_context_patterns", [])
    if not isinstance(high, list) or not all(isinstance(x, str) for x in high):
        raise ValueError("high_risk_context_patterns must be a list of strings")

    if policy.get("block_direct_run_interpolation", True):
        for start, end, block in find_run_blocks(lines):
            for source in high:
                needle = "${{ " + source
                needle2 = "${{" + source
                if needle in block or needle2 in block:
                    findings.append({
                        "severity": BLOCK,
                        "rule": "direct-untrusted-run-interpolation",
                        "file": rel,
                        "line": start,
                        "source": source,
                        "message": "high-risk GitHub context is expanded directly inside a shell run block",
                        "remediation": "pass the value through env/action input and consume it as quoted data"
                    })

    agent_markers = policy.get("agent_action_markers", [])
    is_agent = any(isinstance(x, str) and x in text for x in agent_markers)
    if is_agent and policy.get("require_explicit_permissions_for_agent_workflows", True):
        if not re.search(r"(?m)^permissions\s*:", text):
            findings.append({
                "severity": BLOCK,
                "rule": "agent-workflow-missing-explicit-permissions",
                "file": rel,
                "line": 1,
                "message": "agentic workflow has no top-level explicit permissions boundary",
                "remediation": "declare least-privilege permissions explicitly"
            })

    if policy.get("flag_wildcard_agent_users", True) and is_agent:
        for idx, line in enumerate(lines, 1):
            if re.search(r"(?:allow-users|allowed_users|allowed-users)\s*:\s*['\"]?\*", line):
                findings.append({
                    "severity": REVIEW,
                    "rule": "wildcard-agent-users",
                    "file": rel,
                    "line": idx,
                    "message": "command-capable agent appears open to wildcard users",
                    "remediation": "restrict callers or document an explicit reviewed threat model"
                })

    if policy.get("flag_pull_request_target_checkout", True):
        has_pr_target = bool(re.search(r"(?m)^\s*pull_request_target\s*:", text))
        has_checkout = "actions/checkout@" in text
        head_ref = any(token in text for token in (
            "github.event.pull_request.head.sha",
            "github.event.pull_request.head.ref",
            "github.head_ref"
        ))
        if has_pr_target and has_checkout and head_ref:
            line = next((i for i, v in enumerate(lines, 1) if "actions/checkout@" in v), 1)
            findings.append({
                "severity": BLOCK,
                "rule": "pull-request-target-head-checkout",
                "file": rel,
                "line": line,
                "message": "pull_request_target workflow appears to checkout attacker-controlled head content",
                "remediation": "avoid privileged head checkout/execution; separate untrusted analysis from privileged action"
            })

    return findings


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("root", type=Path)
    ap.add_argument("--policy", type=Path, required=True)
    ap.add_argument("--json-out", type=Path)
    args = ap.parse_args()
    try:
        root = args.root.resolve()
        if not root.is_dir():
            raise ValueError(f"root is not a directory: {root}")
        policy = load_json(args.policy)
        patterns = policy.get("workflow_globs", [".github/workflows/*.yml", ".github/workflows/*.yaml"])
        if not isinstance(patterns, list) or not all(isinstance(x, str) for x in patterns):
            raise ValueError("workflow_globs must be a list of strings")
        findings: list[dict[str, Any]] = []
        files = workflow_files(root, patterns)
        for path in files:
            findings.extend(scan_file(path, root, policy))
        max_findings = int(policy.get("max_findings", 200))
        findings = findings[:max_findings]
        report = {
            "files_scanned": len(files),
            "blocking": sum(1 for f in findings if f["severity"] == BLOCK),
            "review": sum(1 for f in findings if f["severity"] == REVIEW),
            "findings": findings,
        }
        rendered = json.dumps(report, indent=2)
        if args.json_out:
            args.json_out.write_text(rendered + "\n", encoding="utf-8")
        print(rendered)
        return 3 if report["blocking"] else 0
    except (OSError, ValueError, TypeError) as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
