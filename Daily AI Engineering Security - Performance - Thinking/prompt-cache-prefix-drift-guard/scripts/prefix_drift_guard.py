#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

MAX_CHANGED_PREFIX_BLOCKS = 0
MAX_ESTIMATED_RECACHE_TOKENS = 100000


def load(path):
    try:
        obj = json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(obj, dict) or not isinstance(obj.get("blocks"), list):
        raise ValueError(f"{path}: expected object with blocks[]")
    return obj


def digest(block):
    if not isinstance(block, dict):
        raise ValueError("each block must be an object")
    kind, content = block.get("kind"), block.get("content")
    if not isinstance(kind, str) or not isinstance(content, str):
        raise ValueError("each block requires string kind and content")
    return hashlib.sha256((kind + "\0" + content).encode("utf-8")).hexdigest()


def compare(before, after, approved=False):
    b = [digest(x) for x in before["blocks"]]
    a = [digest(x) for x in after["blocks"]]
    common = 0
    for x, y in zip(b, a):
        if x != y:
            break
        common += 1
    changed = max(len(b), len(a)) - common
    estimate = int(after.get("estimated_input_tokens", 0))
    exposure = estimate if changed else 0
    over = changed > MAX_CHANGED_PREFIX_BLOCKS or exposure > MAX_ESTIMATED_RECACHE_TOKENS
    blocked = over and not approved
    return {
        "ok": not blocked,
        "decision": "block" if blocked else ("approved_drift" if changed else "stable"),
        "common_prefix_blocks": common,
        "changed_prefix_blocks": changed,
        "first_changed_block": common if changed else None,
        "estimated_recache_tokens": exposure,
        "before_block_hashes": b,
        "after_block_hashes": a,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--before", required=True)
    parser.add_argument("--after", required=True)
    parser.add_argument("--approved", action="store_true")
    args = parser.parse_args()
    try:
        result = compare(load(args.before), load(args.after), args.approved)
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())
