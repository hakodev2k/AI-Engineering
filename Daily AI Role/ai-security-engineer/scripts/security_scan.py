#!/usr/bin/env python3
"""Safe, dependency-free heuristic preflight for local source/configuration files."""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable


SEVERITY_ORDER = {"low": 1, "medium": 2, "high": 3, "critical": 4}
DEFAULT_EXCLUDES = {
    ".git",
    ".idea",
    ".next",
    ".nuxt",
    ".svn",
    ".venv",
    ".vscode",
    "__pycache__",
    "bin",
    "build",
    "coverage",
    "dist",
    "node_modules",
    "obj",
    "packages",
    "target",
    "vendor",
}
TEXT_EXTENSIONS = {
    "",
    ".cfg",
    ".conf",
    ".config",
    ".cs",
    ".env",
    ".go",
    ".ini",
    ".java",
    ".js",
    ".json",
    ".jsx",
    ".md",
    ".properties",
    ".ps1",
    ".py",
    ".rb",
    ".sh",
    ".sql",
    ".tf",
    ".toml",
    ".ts",
    ".tsx",
    ".txt",
    ".xml",
    ".yaml",
    ".yml",
}
MAX_FILE_BYTES = 1_000_000
SAFE_VALUE_MARKERS = (
    "${",
    "{{",
    "<",
    "changeme",
    "dummy",
    "example",
    "not-a-secret",
    "placeholder",
    "redacted",
    "replace-me",
    "secretref:",
    "vault:",
)


@dataclass(frozen=True)
class Rule:
    identifier: str
    severity: str
    pattern: re.Pattern[str]
    message: str
    secret_group: int | None = None


@dataclass(frozen=True)
class Finding:
    rule: str
    severity: str
    path: str
    line: int
    message: str
    evidence: str = "[REDACTED]"


RULES = (
    Rule(
        "private-key-material",
        "critical",
        re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----"),
        "Probable private key material is embedded in a scanned file.",
    ),
    Rule(
        "aws-access-key-id",
        "high",
        re.compile(r"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b"),
        "Probable AWS access key identifier is embedded in a scanned file.",
    ),
    Rule(
        "hardcoded-secret-assignment",
        "high",
        re.compile(
            r"(?i)\b(?:api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|password|passwd|pwd)\b"
            r"\s*[:=]\s*[\"']?([^\s\"'#,;}{]{8,})"
        ),
        "Probable hardcoded credential or token assignment is present.",
        secret_group=1,
    ),
    Rule(
        "python-tls-verification-disabled",
        "medium",
        re.compile(r"(?i)\bverify\s*=\s*False\b"),
        "TLS certificate verification appears disabled.",
    ),
    Rule(
        "dotnet-certificate-validation-bypass",
        "medium",
        re.compile(r"DangerousAcceptAnyServerCertificateValidator"),
        ".NET server certificate validation bypass is referenced.",
    ),
)


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Scan local text/configuration files for a small set of probable secret and TLS-bypass patterns. "
            "Output is redacted; manual verification is always required."
        )
    )
    parser.add_argument("target", type=Path, help="Existing local file or directory to scan")
    parser.add_argument("--format", choices=("text", "json"), default="text", dest="output_format")
    parser.add_argument(
        "--fail-on",
        choices=("none", "low", "medium", "high", "critical"),
        default="high",
        help="Return exit 1 when a finding at or above this severity exists (default: high)",
    )
    parser.add_argument(
        "--exclude",
        action="append",
        default=[],
        metavar="NAME_OR_PATH",
        help="Skip a directory/file name or a path relative to the target; repeat as needed",
    )
    return parser.parse_args(argv)


def normalized_excludes(values: Iterable[str]) -> set[str]:
    return {value.replace("\\", "/").strip("/") for value in values if value.strip("/\\")}


def should_exclude(path: Path, base: Path, excludes: set[str]) -> bool:
    try:
        relative_path = path.relative_to(base).as_posix()
    except ValueError:
        relative_path = path.name
    return path.name in excludes or relative_path in excludes


def candidate_files(target: Path, excludes: set[str]) -> Iterable[Path]:
    if target.is_file():
        yield target
        return

    for root, directories, files in os.walk(target, followlinks=False):
        root_path = Path(root)
        directories[:] = [
            name
            for name in directories
            if name not in DEFAULT_EXCLUDES
            and not (root_path / name).is_symlink()
            and not should_exclude(root_path / name, target, excludes)
        ]
        for name in files:
            path = root_path / name
            if path.is_symlink() or should_exclude(path, target, excludes):
                continue
            if path.suffix.lower() in TEXT_EXTENSIONS:
                yield path


def probable_placeholder(value: str) -> bool:
    lowered = value.lower()
    return any(marker in lowered for marker in SAFE_VALUE_MARKERS) or set(value) <= {"*", "x", "X", "-", "_"}


def scan_file(path: Path, display_base: Path) -> tuple[list[Finding], str | None]:
    try:
        if path.stat().st_size > MAX_FILE_BYTES:
            return [], f"skipped oversized file: {path}"
        raw = path.read_bytes()
    except OSError as error:
        return [], f"cannot read {path}: {error}"
    if b"\x00" in raw:
        return [], None
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        return [], None

    try:
        relative_path = path.relative_to(display_base).as_posix()
    except ValueError:
        relative_path = path.name

    findings = []
    for line_number, line in enumerate(text.splitlines(), start=1):
        for rule in RULES:
            for match in rule.pattern.finditer(line):
                if rule.secret_group is not None and probable_placeholder(match.group(rule.secret_group)):
                    continue
                findings.append(
                    Finding(
                        rule=rule.identifier,
                        severity=rule.severity,
                        path=relative_path,
                        line=line_number,
                        message=rule.message,
                    )
                )
    return findings, None


def emit_text(findings: list[Finding], warnings: list[str], scanned: int) -> None:
    for finding in findings:
        print(
            f"{finding.severity.upper()} {finding.rule} {finding.path}:{finding.line} "
            f"{finding.message} {finding.evidence}"
        )
    for warning in warnings:
        print(f"WARNING {warning}", file=sys.stderr)
    print(f"Scanned {scanned} file(s); found {len(findings)} heuristic finding(s). Manual verification required.")


def emit_json(findings: list[Finding], warnings: list[str], scanned: int) -> None:
    print(
        json.dumps(
            {
                "scanner": "ai-security-engineer-heuristic-preflight",
                "scanned_files": scanned,
                "findings": [asdict(finding) for finding in findings],
                "warnings": warnings,
                "manual_verification_required": True,
            },
            indent=2,
        )
    )


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv if argv is not None else sys.argv[1:])
    target = args.target.resolve()
    if not target.exists() or not (target.is_file() or target.is_dir()):
        print(f"ERROR: target is not a readable file or directory: {target}", file=sys.stderr)
        return 2

    excludes = normalized_excludes(args.exclude)
    display_base = target if target.is_dir() else target.parent
    findings: list[Finding] = []
    warnings: list[str] = []
    scanned = 0
    for path in candidate_files(target, excludes):
        file_findings, warning = scan_file(path, display_base)
        scanned += 1
        findings.extend(file_findings)
        if warning:
            warnings.append(warning)
    findings.sort(key=lambda item: (-SEVERITY_ORDER[item.severity], item.path, item.line, item.rule))

    if args.output_format == "json":
        emit_json(findings, warnings, scanned)
    else:
        emit_text(findings, warnings, scanned)

    if args.fail_on == "none":
        return 0
    threshold = SEVERITY_ORDER[args.fail_on]
    return 1 if any(SEVERITY_ORDER[finding.severity] >= threshold for finding in findings) else 0


if __name__ == "__main__":
    raise SystemExit(main())
