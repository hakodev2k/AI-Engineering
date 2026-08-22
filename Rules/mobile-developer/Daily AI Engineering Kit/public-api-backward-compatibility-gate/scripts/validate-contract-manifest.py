#!/usr/bin/env python3
import argparse
import hashlib
import json
import pathlib
import re
import sys

SHA_RE = re.compile(r"^[0-9a-fA-F]{7,64}$")
HASH_RE = re.compile(r"^[0-9a-f]{64}$")
ALLOWED_TYPES = {"openapi", "json-contract", "public-dotnet", "event", "webhook", "other"}
ALLOWED_STATUS = {"baseline-captured", "candidate-captured", "reviewed", "verified"}


def sha256(path: pathlib.Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--manifest", required=True)
    p.add_argument("--verify-files", action="store_true")
    args = p.parse_args()

    manifest_path = pathlib.Path(args.manifest)
    if not manifest_path.is_file():
        print(f"ERROR manifest not found: {manifest_path}", file=sys.stderr)
        return 2

    try:
        data = json.loads(manifest_path.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"ERROR invalid JSON: {e}", file=sys.stderr)
        return 2

    errors = []
    if data.get("schema_version") != 1:
        errors.append("schema_version must be 1")
    for key in ["contract_id", "ref", "commit_sha", "contract_type", "artifacts", "status"]:
        if key not in data:
            errors.append(f"missing required field: {key}")
    if data.get("contract_type") not in ALLOWED_TYPES:
        errors.append("unsupported contract_type")
    if not SHA_RE.match(str(data.get("commit_sha", ""))):
        errors.append("commit_sha must be 7-64 hexadecimal chars")
    if data.get("status") not in ALLOWED_STATUS:
        errors.append("invalid status")

    artifacts = data.get("artifacts")
    if not isinstance(artifacts, list) or not artifacts:
        errors.append("artifacts must be a non-empty array")
    else:
        seen = set()
        for i, item in enumerate(artifacts):
            if not isinstance(item, dict):
                errors.append(f"artifacts[{i}] must be object")
                continue
            path = item.get("path")
            digest = item.get("sha256")
            if not isinstance(path, str) or not path:
                errors.append(f"artifacts[{i}].path required")
                continue
            if path in seen:
                errors.append(f"duplicate artifact path: {path}")
            seen.add(path)
            if not isinstance(digest, str) or not HASH_RE.match(digest):
                errors.append(f"artifacts[{i}].sha256 must be lowercase sha256")
            if args.verify_files:
                target = (manifest_path.parent / path).resolve()
                if not target.is_file():
                    errors.append(f"artifact missing: {path}")
                elif HASH_RE.match(str(digest)) and sha256(target) != digest:
                    errors.append(f"artifact hash mismatch: {path}")

    if errors:
        for e in errors:
            print(f"ERROR {e}", file=sys.stderr)
        return 1

    print(f"OK contract manifest valid: {manifest_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
