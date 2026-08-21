#!/usr/bin/env python3
import argparse
import fnmatch
import json
import os
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML is required: pip install pyyaml", file=sys.stderr)
    sys.exit(2)

PACKAGE_ROOT = Path(__file__).resolve().parents[1]


def load_policy(path: Path):
    try:
        data = yaml.safe_load(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"ERROR: cannot read policy {path}: {exc}", file=sys.stderr)
        sys.exit(2)
    if not isinstance(data, dict) or "scan" not in data or "patterns" not in data:
        print("ERROR: invalid policy: scan and patterns are required", file=sys.stderr)
        sys.exit(2)
    return data


def excluded(rel: str, globs):
    normalized = rel.replace(os.sep, "/")
    return any(fnmatch.fnmatch(normalized, pat) or fnmatch.fnmatch(normalized + "/", pat) for pat in globs)


def is_within(path: Path, parent: Path):
    try:
        path.resolve().relative_to(parent.resolve())
        return True
    except ValueError:
        return False


def iter_files(root: Path, policy):
    scan = policy["scan"]
    extensions = {x.lower() for x in scan.get("include_extensions", [])}
    excludes = scan.get("exclude_paths", [])
    max_bytes = int(scan.get("max_file_bytes", 1048576))
    package_is_inside_scan_root = is_within(PACKAGE_ROOT, root)
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if package_is_inside_scan_root and is_within(path, PACKAGE_ROOT):
            continue
        rel = str(path.relative_to(root))
        if excluded(rel, excludes):
            continue
        if extensions and path.suffix.lower() not in extensions:
            continue
        try:
            if path.stat().st_size > max_bytes:
                continue
        except OSError:
            continue
        yield path, rel


def scan_file(path: Path, rel: str, policy):
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError as exc:
        return [{"file": rel, "severity": "error", "line": 0, "pattern": "read-error", "excerpt": str(exc)}]
    findings = []
    compiled = []
    for severity, patterns in policy.get("patterns", {}).items():
        for pattern in patterns or []:
            compiled.append((severity, pattern, re.compile(re.escape(pattern), re.IGNORECASE)))
    for line_no, line in enumerate(text.splitlines(), start=1):
        for severity, pattern, rx in compiled:
            if rx.search(line):
                findings.append({
                    "file": rel.replace(os.sep, "/"),
                    "severity": severity,
                    "line": line_no,
                    "pattern": pattern,
                    "excerpt": line.strip()[:240]
                })
    return findings


def main():
    parser = argparse.ArgumentParser(description="Scan repository text for instructions that must be treated as untrusted agent input.")
    parser.add_argument("--root", default=".", help="Repository root")
    parser.add_argument("--policy", default="config/policy.yaml", help="Policy YAML path")
    parser.add_argument("--output", default="artifacts/untrusted-instruction-findings.json", help="JSON findings output")
    parser.add_argument("--fail-on", choices=["none", "medium", "high"], default=None)
    args = parser.parse_args()

    root = Path(args.root).resolve()
    policy_path = Path(args.policy)
    if not policy_path.is_absolute():
        policy_path = (Path.cwd() / policy_path).resolve()
    if not root.is_dir() or not policy_path.is_file():
        print("ERROR: root directory or policy file does not exist", file=sys.stderr)
        return 2

    policy = load_policy(policy_path)
    findings = []
    scanned = 0
    for path, rel in iter_files(root, policy):
        scanned += 1
        findings.extend(scan_file(path, rel, policy))

    counts = {}
    for item in findings:
        counts[item["severity"]] = counts.get(item["severity"], 0) + 1

    report = {
        "schema_version": 1,
        "root": str(root),
        "scanned_files": scanned,
        "counts": counts,
        "findings": findings,
    }
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    for item in findings:
        print(f"{item['severity'].upper():6} {item['file']}:{item['line']} [{item['pattern']}] {item['excerpt']}")
    print(f"Scanned {scanned} files; findings={len(findings)}; report={output}")

    threshold = args.fail_on
    if threshold is None:
        threshold = "high" if policy.get("mode") == "block-on-high" else "none"
    rank = {"none": 99, "medium": 1, "high": 2, "error": 2}
    threshold_rank = rank[threshold]
    if threshold != "none" and any(rank.get(x.get("severity"), 0) >= threshold_rank for x in findings):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
