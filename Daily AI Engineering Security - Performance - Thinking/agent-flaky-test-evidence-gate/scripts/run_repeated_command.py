#!/usr/bin/env python3
"""Run a command repeatedly and persist every observation as JSONL.

The runner intentionally does not use a shell. Pass the command after `--`.
Exit codes:
  0: runner completed all requested observations (individual command failures are data)
  2: invalid arguments
  3: runner/internal I/O failure
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run a command repeatedly and save JSONL evidence.")
    parser.add_argument("--runs", type=int, required=True, help="Number of observations (1-20).")
    parser.add_argument("--timeout", type=int, default=600, help="Timeout per run in seconds (1-7200).")
    parser.add_argument("--output", required=True, help="JSONL output path.")
    parser.add_argument("--cwd", default=None, help="Working directory; defaults to current directory.")
    parser.add_argument("command", nargs=argparse.REMAINDER, help="Command after --.")
    args = parser.parse_args()
    if args.command and args.command[0] == "--":
        args.command = args.command[1:]
    if not (1 <= args.runs <= 20):
        parser.error("--runs must be between 1 and 20")
    if not (1 <= args.timeout <= 7200):
        parser.error("--timeout must be between 1 and 7200 seconds")
    if not args.command:
        parser.error("a command is required after --")
    return args


def safe_environment_snapshot() -> dict[str, str]:
    keys = [
        "CI", "OS", "OSTYPE", "PROCESSOR_ARCHITECTURE", "PYTHONHASHSEED",
        "TZ", "LANG", "LC_ALL", "DOTNET_ENVIRONMENT", "ASPNETCORE_ENVIRONMENT",
    ]
    return {k: os.environ[k] for k in keys if k in os.environ}


def main() -> int:
    try:
        args = parse_args()
        cwd = Path(args.cwd).resolve() if args.cwd else Path.cwd().resolve()
        if not cwd.is_dir():
            print(f"cwd is not a directory: {cwd}", file=sys.stderr)
            return 2

        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        env_snapshot = safe_environment_snapshot()

        with output.open("w", encoding="utf-8") as stream:
            for index in range(1, args.runs + 1):
                started = time.monotonic()
                started_at = datetime.now(timezone.utc).isoformat()
                timed_out = False
                stdout = ""
                stderr = ""
                exit_code: int | None = None

                try:
                    completed = subprocess.run(
                        args.command,
                        cwd=str(cwd),
                        capture_output=True,
                        text=True,
                        errors="replace",
                        timeout=args.timeout,
                        check=False,
                    )
                    exit_code = completed.returncode
                    stdout = completed.stdout
                    stderr = completed.stderr
                except subprocess.TimeoutExpired as exc:
                    timed_out = True
                    exit_code = None
                    stdout = (exc.stdout.decode(errors="replace") if isinstance(exc.stdout, bytes) else exc.stdout) or ""
                    stderr = (exc.stderr.decode(errors="replace") if isinstance(exc.stderr, bytes) else exc.stderr) or ""
                except OSError as exc:
                    stderr = f"runner-os-error: {type(exc).__name__}: {exc}"
                    exit_code = None

                record = {
                    "schema_version": 1,
                    "run": index,
                    "started_at_utc": started_at,
                    "duration_seconds": round(time.monotonic() - started, 6),
                    "command": args.command,
                    "cwd": str(cwd),
                    "exit_code": exit_code,
                    "timed_out": timed_out,
                    "environment": env_snapshot,
                    "stdout": stdout,
                    "stderr": stderr,
                }
                stream.write(json.dumps(record, ensure_ascii=False) + "\n")
                stream.flush()
                print(f"run {index}/{args.runs}: exit={exit_code} timeout={timed_out}", file=sys.stderr)

        return 0
    except SystemExit:
        raise
    except Exception as exc:  # defensive boundary for scheduled/non-interactive use
        print(f"runner failure: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
