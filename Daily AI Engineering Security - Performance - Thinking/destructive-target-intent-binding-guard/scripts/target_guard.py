#!/usr/bin/env python3
"""Validate structured destructive-operation targets without executing anything."""
from __future__ import annotations
import argparse, json, os, re, sys
from pathlib import Path

EXIT_BLOCK = 20
EXIT_REVIEW = 21
EXIT_INVALID = 2
PATTERN = re.compile(r"[*?\[]")
VARIABLE = re.compile(r"(?:\$|%[A-Za-z_][A-Za-z0-9_]*%)")


def read_object(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as fh:
        value = json.load(fh)
    if not isinstance(value, dict):
        raise ValueError("expected JSON object")
    return value


def norm(value: str, cwd: Path) -> Path:
    p = Path(value)
    if not p.is_absolute():
        p = cwd / p
    return Path(os.path.abspath(os.path.normpath(str(p))))


def within(path: Path, root: Path) -> bool:
    try:
        path.relative_to(root)
        return True
    except ValueError:
        return False


def evaluate(req: dict, policy: dict) -> dict:
    operation = req.get("operation")
    cwd_value = req.get("cwd")
    target_values = req.get("targets")
    authorized_values = req.get("authorized_targets")
    root_values = req.get("allowed_roots")
    recursive = req.get("recursive", False)
    recoverable = req.get("recoverable", False)

    if operation not in {"delete", "cleanup"}:
        raise ValueError("operation must be delete or cleanup")
    if not isinstance(cwd_value, str) or not cwd_value:
        raise ValueError("cwd must be a non-empty string")
    for name, value in (("targets", target_values), ("authorized_targets", authorized_values), ("allowed_roots", root_values)):
        if not isinstance(value, list) or not all(isinstance(x, str) and x for x in value):
            raise ValueError(f"{name} must be a non-empty string array")
    if not isinstance(recursive, bool) or not isinstance(recoverable, bool):
        raise ValueError("recursive and recoverable must be booleans")

    cwd = norm(cwd_value, Path.cwd())
    roots = [norm(x, cwd) for x in root_values]
    authorized = {norm(x, cwd) for x in authorized_values}
    findings = []
    normalized = []

    for raw in target_values:
        if raw.startswith("~") or PATTERN.search(raw) or VARIABLE.search(raw):
            findings.append({"code": "ambiguous-target-expression", "severity": "block", "target": raw})
            continue
        p = norm(raw, cwd)
        normalized.append(str(p))
        if p.anchor and p == Path(p.anchor):
            findings.append({"code": "filesystem-root-target", "severity": "block", "target": str(p)})
        if not any(within(p, root) for root in roots):
            findings.append({"code": "outside-allowed-root", "severity": "block", "target": str(p)})
        if p not in authorized:
            findings.append({"code": "target-not-authorized", "severity": "block", "target": str(p)})
        if recursive and any(p == root for root in roots):
            findings.append({"code": "recursive-allowed-root", "severity": "block", "target": str(p)})

    if recursive and policy.get("review_recursive", True):
        findings.append({"code": "recursive-operation", "severity": "review"})
    if not recoverable and policy.get("review_unrecoverable", True):
        findings.append({"code": "unrecoverable-operation", "severity": "review"})

    decision = "allow"
    if any(x["severity"] == "block" for x in findings):
        decision = "block"
    elif any(x["severity"] == "review" for x in findings):
        decision = "review"
    return {"decision": decision, "operation": operation, "targets": normalized, "findings": findings}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--policy", required=True)
    parser.add_argument("--output")
    args = parser.parse_args()
    try:
        result = evaluate(read_object(args.input), read_object(args.policy))
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(json.dumps({"decision": "block", "error": str(exc)}), file=sys.stderr)
        return EXIT_INVALID
    text = json.dumps(result, indent=2, sort_keys=True)
    if args.output:
        Path(args.output).write_text(text + "\n", encoding="utf-8")
    else:
        print(text)
    return 0 if result["decision"] == "allow" else EXIT_REVIEW if result["decision"] == "review" else EXIT_BLOCK


if __name__ == "__main__":
    raise SystemExit(main())
