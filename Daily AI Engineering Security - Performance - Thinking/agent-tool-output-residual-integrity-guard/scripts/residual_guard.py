#!/usr/bin/env python3
"""Create and verify bounded tool-output residuals without executing commands.

The capture command reads an existing file or stdin, writes an immutable-style artifact,
computes a SHA-256 digest, and emits a bounded head/tail model view plus residual metadata.
The verify command validates size/hash/accounting invariants.

Exit codes:
  0 success
  2 policy/verification failure
  3 invalid input
  4 I/O failure
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import tempfile
from collections import deque
from pathlib import Path

CHUNK = 64 * 1024


def fail(message: str, code: int) -> "NoReturn":
    print(message, file=sys.stderr)
    raise SystemExit(code)


def safe_artifact_dir(path: Path) -> Path:
    try:
        path.mkdir(parents=True, exist_ok=True)
        return path.resolve()
    except OSError as exc:
        fail(f"artifact directory error: {exc}", 4)


def capture(args: argparse.Namespace) -> int:
    if args.max_model_bytes < 512:
        fail("--max-model-bytes must be >= 512", 3)
    if not (0.1 <= args.head_fraction <= 0.9):
        fail("--head-fraction must be between 0.1 and 0.9", 3)

    artifact_dir = safe_artifact_dir(Path(args.artifact_dir))
    source = sys.stdin.buffer if args.input == "-" else None
    source_path = None if args.input == "-" else Path(args.input)
    if source_path is not None:
        if not source_path.is_file():
            fail(f"input is not a file: {source_path}", 3)
        try:
            source = source_path.open("rb")
        except OSError as exc:
            fail(f"cannot open input: {exc}", 4)

    head_limit = int(args.max_model_bytes * args.head_fraction)
    tail_limit = args.max_model_bytes - head_limit
    head = bytearray()
    tail_chunks: deque[bytes] = deque()
    tail_size = 0
    total = 0
    digest = hashlib.sha256()

    try:
        with tempfile.NamedTemporaryFile(
            mode="wb", prefix="residual-", suffix=".bin", dir=artifact_dir, delete=False
        ) as out:
            temp_path = Path(out.name)
            while True:
                chunk = source.read(CHUNK)
                if not chunk:
                    break
                total += len(chunk)
                digest.update(chunk)
                out.write(chunk)
                if len(head) < head_limit:
                    need = head_limit - len(head)
                    head.extend(chunk[:need])
                tail_chunks.append(chunk)
                tail_size += len(chunk)
                while tail_size > tail_limit and tail_chunks:
                    excess = tail_size - tail_limit
                    first = tail_chunks[0]
                    if len(first) <= excess:
                        tail_chunks.popleft()
                        tail_size -= len(first)
                    else:
                        tail_chunks[0] = first[excess:]
                        tail_size -= excess
                        break
            out.flush()
            os.fsync(out.fileno())
    except OSError as exc:
        fail(f"capture failed: {exc}", 4)
    finally:
        if source_path is not None and source is not None:
            source.close()

    sha = digest.hexdigest()
    final_path = artifact_dir / f"sha256-{sha}.bin"
    try:
        if final_path.exists():
            temp_path.unlink(missing_ok=True)
        else:
            os.replace(temp_path, final_path)
            try:
                final_path.chmod(0o444)
            except OSError:
                pass
    except OSError as exc:
        fail(f"artifact finalize failed: {exc}", 4)

    truncated = total > args.max_model_bytes
    if truncated:
        tail = b"".join(tail_chunks)
        retained = bytes(head) + tail
    else:
        try:
            retained = final_path.read_bytes()
        except OSError as exc:
            fail(f"cannot read artifact: {exc}", 4)

    retained_bytes = len(retained)
    omitted = max(0, total - retained_bytes)
    header = {
        "schema_version": 1,
        "produced_bytes": total,
        "retained_bytes": retained_bytes,
        "omitted_bytes": omitted,
        "truncated": truncated,
        "capture_complete": True,
        "recoverability": "full-artifact",
        "artifact_path": str(final_path),
        "sha256": sha,
        "head_bytes": len(head) if truncated else retained_bytes,
        "tail_bytes": len(retained) - len(head) if truncated else 0,
        "encoding": args.encoding,
    }
    text = retained.decode(args.encoding, errors="replace")
    if truncated:
        model_view = (
            "[OUTPUT RESIDUAL: TRUNCATED; produced={produced_bytes}B; retained={retained_bytes}B; "
            "omitted={omitted_bytes}B; recoverable={recoverability}; sha256={sha256}; artifact={artifact_path}]\n"
        ).format(**header) + text
    else:
        model_view = (
            "[OUTPUT RESIDUAL: COMPLETE; produced={produced_bytes}B; sha256={sha256}; artifact={artifact_path}]\n"
        ).format(**header) + text

    result = {"residual": header, "model_view": model_view}
    payload = json.dumps(result, ensure_ascii=False, indent=2)
    if args.result_file:
        try:
            Path(args.result_file).write_text(payload + "\n", encoding="utf-8")
        except OSError as exc:
            fail(f"cannot write result file: {exc}", 4)
    print(payload)
    return 0


def verify(args: argparse.Namespace) -> int:
    try:
        doc = json.loads(Path(args.result).read_text(encoding="utf-8"))
        r = doc["residual"]
    except (OSError, json.JSONDecodeError, KeyError, TypeError) as exc:
        fail(f"invalid residual result: {exc}", 3)

    required = [
        "produced_bytes", "retained_bytes", "omitted_bytes", "truncated",
        "capture_complete", "recoverability", "artifact_path", "sha256"
    ]
    missing = [k for k in required if k not in r]
    if missing:
        fail(f"missing residual fields: {', '.join(missing)}", 2)

    if r["produced_bytes"] != r["retained_bytes"] + r["omitted_bytes"]:
        fail("accounting invariant failed: produced != retained + omitted", 2)
    if bool(r["truncated"]) != (r["omitted_bytes"] > 0):
        fail("truncation invariant failed", 2)
    if not r["capture_complete"]:
        fail("capture is incomplete", 2)
    if r["recoverability"] != "full-artifact":
        fail("full artifact recoverability required", 2)

    artifact = Path(r["artifact_path"])
    if not artifact.is_file():
        fail(f"artifact missing: {artifact}", 2)

    h = hashlib.sha256()
    size = 0
    try:
        with artifact.open("rb") as f:
            for chunk in iter(lambda: f.read(CHUNK), b""):
                size += len(chunk)
                h.update(chunk)
    except OSError as exc:
        fail(f"artifact read failed: {exc}", 4)

    if size != r["produced_bytes"]:
        fail(f"artifact size mismatch: {size} != {r['produced_bytes']}", 2)
    if h.hexdigest() != r["sha256"]:
        fail("artifact SHA-256 mismatch", 2)

    print(json.dumps({"status": "verified", "produced_bytes": size, "sha256": h.hexdigest()}))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("capture", help="capture an existing output file or stdin")
    p.add_argument("--input", required=True, help="file path or - for stdin")
    p.add_argument("--artifact-dir", default=".agent-output-artifacts")
    p.add_argument("--max-model-bytes", type=int, default=40000)
    p.add_argument("--head-fraction", type=float, default=0.5)
    p.add_argument("--encoding", default="utf-8")
    p.add_argument("--result-file")
    p.set_defaults(func=capture)

    p = sub.add_parser("verify", help="verify a capture result and artifact")
    p.add_argument("--result", required=True)
    p.set_defaults(func=verify)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
