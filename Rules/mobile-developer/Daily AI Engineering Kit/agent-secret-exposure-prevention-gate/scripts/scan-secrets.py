#!/usr/bin/env python3
"""Deterministic repository secret scanner with redacted JSON output.

Exit codes: 0=no blocking finding, 2=blocking finding, 3=scanner/config error.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import re
import sys
from pathlib import Path

PATTERNS = [
    ("private-key", "critical", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----")),
    ("github-token", "critical", re.compile(r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,255}\b")),
    ("github-fine-grained-token", "critical", re.compile(r"\bgithub_pat_[A-Za-z0-9_]{50,255}\b")),
    ("aws-access-key-id", "high", re.compile(r"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b")),
    ("openai-api-key", "critical", re.compile(r"\bsk-[A-Za-z0-9_-]{20,255}\b")),
    ("slack-token", "high", re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{10,255}\b")),
    ("jwt", "high", re.compile(r"\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b")),
]
GENERIC = re.compile(
    r"(?i)\b(?:api[_-]?key|secret|client[_-]?secret|access[_-]?token|auth[_-]?token|password|passwd|pwd)\b"
    r"\s*[:=]\s*[\"']?([A-Za-z0-9_./+=:@-]{8,})"
)


def entropy(value: str) -> float:
    if not value:
        return 0.0
    counts = {c: value.count(c) for c in set(value)}
    total = len(value)
    return -sum((n / total) * math.log2(n / total) for n in counts.values())


def fingerprint(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8", "ignore")).hexdigest()[:16]


def redact(value: str) -> str:
    if len(value) <= 8:
        return "<redacted>"
    return f"{value[:3]}…{value[-3:]}"


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def is_excluded(rel: str, excluded: list[str]) -> bool:
    normalized = rel.replace("\\", "/")
    return any(normalized.startswith(prefix) or f"/{prefix}" in normalized for prefix in excluded)


def load_allowlist(path: Path) -> set[tuple[str, str, str]]:
    if not path.exists():
        return set()
    data = load_json(path)
    allowed = set()
    for item in data.get("entries", []):
        p, detector, fp = item.get("path"), item.get("detector"), item.get("fingerprint")
        if p and detector and fp:
            allowed.add((p.replace("\\", "/"), detector, fp))
    return allowed


def finding(path: str, line_no: int, detector: str, severity: str, value: str, confidence: str):
    return {
        "path": path,
        "line": line_no,
        "detector": detector,
        "severity": severity,
        "confidence": confidence,
        "fingerprint": fingerprint(value),
        "evidence": redact(value),
    }


def scan_file(path: Path, rel: str, cfg: dict, allow: set[tuple[str, str, str]]):
    results = []
    try:
        if path.stat().st_size > int(cfg["max_file_bytes"]):
            return results, None
        text = path.read_text(encoding="utf-8", errors="ignore")
        for line_no, line in enumerate(text.splitlines(), 1):
            for detector, severity, pattern in PATTERNS:
                for match in pattern.finditer(line):
                    value = match.group(0)
                    fp = fingerprint(value)
                    if (rel, detector, fp) not in allow:
                        results.append(finding(rel, line_no, detector, severity, value, "high"))
            for match in GENERIC.finditer(line):
                value = match.group(1)
                if len(value) < int(cfg["minimum_generic_secret_length"]):
                    continue
                if entropy(value) < float(cfg["minimum_entropy"]):
                    continue
                detector = "generic-high-entropy-secret"
                fp = fingerprint(value)
                if (rel, detector, fp) not in allow:
                    results.append(finding(rel, line_no, detector, "high", value, "medium"))
        return results, None
    except (OSError, UnicodeError) as exc:
        return results, f"{rel}: {type(exc).__name__}: {exc}"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--config", required=True)
    parser.add_argument("--allowlist")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    try:
        root = Path(args.root).resolve()
        cfg_path = Path(args.config).resolve()
        cfg = load_json(cfg_path)
        if not root.is_dir():
            raise ValueError(f"root is not a directory: {root}")
        required = {"max_file_bytes", "include_extensions", "exclude_paths", "minimum_entropy", "minimum_generic_secret_length", "block_on_severity", "max_scan_errors"}
        missing = sorted(required - set(cfg))
        if missing:
            raise ValueError(f"missing config keys: {', '.join(missing)}")

        allow_path = Path(args.allowlist).resolve() if args.allowlist else None
        allow = load_allowlist(allow_path) if allow_path else set()
        findings = []
        errors = []
        extensions = set(cfg["include_extensions"])

        for base, dirs, files in os.walk(root):
            base_path = Path(base)
            rel_dir = base_path.relative_to(root).as_posix()
            dirs[:] = [d for d in dirs if not is_excluded((Path(rel_dir) / d).as_posix().lstrip("./") + "/", cfg["exclude_paths"])]
            for name in files:
                path = base_path / name
                rel = path.relative_to(root).as_posix()
                if is_excluded(rel, cfg["exclude_paths"]):
                    continue
                if path.suffix.lower() not in extensions and not name.startswith(".env"):
                    continue
                file_findings, error = scan_file(path, rel, cfg, allow)
                findings.extend(file_findings)
                if error:
                    errors.append(error)
                    if len(errors) >= int(cfg["max_scan_errors"]):
                        break
            if len(errors) >= int(cfg["max_scan_errors"]):
                break

        blockers = [f for f in findings if f["severity"] in set(cfg["block_on_severity"])]
        report = {
            "scanner": "agent-secret-exposure-prevention-gate",
            "root": str(root),
            "status": "error" if len(errors) >= int(cfg["max_scan_errors"]) else ("blocked" if blockers else "passed"),
            "summary": {"findings": len(findings), "blocking_findings": len(blockers), "scan_errors": len(errors)},
            "findings": findings,
            "errors": errors,
        }
        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")

        if report["status"] == "error":
            print(f"Secret scan failed with {len(errors)} scan error(s). Report: {output}", file=sys.stderr)
            return 3
        if blockers:
            print(f"Secret scan blocked: {len(blockers)} blocking finding(s). Redacted report: {output}", file=sys.stderr)
            return 2
        print(f"Secret scan passed. Findings: {len(findings)}. Report: {output}")
        return 0
    except (OSError, ValueError, KeyError, json.JSONDecodeError) as exc:
        print(f"Secret scanner error: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
