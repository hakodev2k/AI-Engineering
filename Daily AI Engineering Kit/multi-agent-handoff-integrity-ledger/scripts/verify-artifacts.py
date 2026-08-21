#!/usr/bin/env python3
import argparse
import hashlib
import json
import sys
from pathlib import Path


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def main():
    parser = argparse.ArgumentParser(description="Verify file artifacts referenced by a handoff record.")
    parser.add_argument("--record", required=True)
    parser.add_argument("--repo-root", default=".")
    args = parser.parse_args()

    record_path = Path(args.record)
    repo_root = Path(args.repo_root).resolve()

    try:
        record = json.loads(record_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"ERROR: record not found: {record_path}", file=sys.stderr)
        return 2
    except json.JSONDecodeError as exc:
        print(f"ERROR: invalid JSON: {exc}", file=sys.stderr)
        return 2

    failures = []
    checked = 0
    for i, artifact in enumerate(record.get("artifacts", [])):
        if not isinstance(artifact, dict) or artifact.get("kind") != "file":
            continue
        rel = artifact.get("path_or_ref")
        expected = artifact.get("sha256")
        if not rel or not expected:
            failures.append(f"artifacts[{i}] missing path_or_ref or sha256")
            continue
        path = (repo_root / rel).resolve()
        try:
            path.relative_to(repo_root)
        except ValueError:
            failures.append(f"artifacts[{i}] escapes repo root: {rel}")
            continue
        if not path.is_file():
            failures.append(f"artifacts[{i}] file missing: {rel}")
            continue
        actual = sha256_file(path)
        checked += 1
        if actual.lower() != expected.lower():
            failures.append(f"artifacts[{i}] fingerprint mismatch: {rel} expected={expected} actual={actual}")

    if failures:
        for failure in failures:
            print(f"FAIL: {failure}")
        return 1

    print(f"PASS: verified {checked} file artifact(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
