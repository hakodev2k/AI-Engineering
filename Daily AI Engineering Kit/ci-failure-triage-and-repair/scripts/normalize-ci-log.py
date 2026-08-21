#!/usr/bin/env python3
import argparse
import os
import re
import sys
from pathlib import Path

SECRET_PATTERNS = [
    re.compile(r"(?i)(authorization\s*:\s*(?:bearer|basic)\s+)[^\s]+"),
    re.compile(r"(?i)\b(api[_-]?key|token|password|secret)\b\s*[:=]\s*([^\s,;]+)"),
    re.compile(r"\bgh[pousr]_[A-Za-z0-9_]{20,}\b"),
]
ANSI = re.compile(r"\x1b\[[0-?]*[ -/]*[@-~]")


def redact(line: str) -> str:
    line = ANSI.sub("", line)
    line = SECRET_PATTERNS[0].sub(r"\1<REDACTED>", line)
    line = SECRET_PATTERNS[1].sub(lambda m: f"{m.group(1)}=<REDACTED>", line)
    line = SECRET_PATTERNS[2].sub("<REDACTED_GITHUB_TOKEN>", line)
    return line.rstrip()


def main() -> int:
    p = argparse.ArgumentParser(description="Normalize and bound a CI log without mutating repository files.")
    p.add_argument("input", help="CI log file")
    p.add_argument("--output", default="ci.normalized.log")
    p.add_argument("--max-lines", type=int, default=int(os.getenv("CI_TRIAGE_MAX_LOG_LINES", "4000")))
    args = p.parse_args()
    if args.max_lines < 100:
        print("--max-lines must be >= 100", file=sys.stderr); return 2
    src = Path(args.input)
    if not src.is_file():
        print(f"Input not found: {src}", file=sys.stderr); return 2
    try:
        lines = src.read_text(encoding="utf-8", errors="replace").splitlines()
        cleaned = [redact(x) for x in lines]
        if len(cleaned) > args.max_lines:
            head = args.max_lines // 3
            tail = args.max_lines - head
            cleaned = cleaned[:head] + [f"... <TRUNCATED {len(lines)-args.max_lines} LINES> ..."] + cleaned[-tail:]
        Path(args.output).write_text("\n".join(cleaned) + "\n", encoding="utf-8")
        print(f"Wrote {len(cleaned)} normalized lines to {args.output}")
        return 0
    except OSError as exc:
        print(f"I/O error: {exc}", file=sys.stderr); return 2

if __name__ == "__main__":
    raise SystemExit(main())
