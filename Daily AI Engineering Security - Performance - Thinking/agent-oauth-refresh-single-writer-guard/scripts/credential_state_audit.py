#!/usr/bin/env python3
"""Audit redacted OAuth lifecycle events for refresh/generation invariants.

Input is JSON Lines. This tool rejects fields that look like raw credentials.
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

SECRET_MARKERS = ("access_token", "refresh_token", "client_secret", "authorization", "bearer")


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def contains_secretish_key(value: Any) -> bool:
    if isinstance(value, dict):
        for k, v in value.items():
            lk = str(k).lower()
            if any(m in lk for m in SECRET_MARKERS) or lk == "token":
                return True
            if contains_secretish_key(v):
                return True
    elif isinstance(value, list):
        return any(contains_secretish_key(v) for v in value)
    return False


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("events")
    ap.add_argument("--policy", required=True)
    args = ap.parse_args()

    policy = load_json(Path(args.policy))
    max_attempts = int(policy.get("max_refresh_attempts", 2))
    violations: list[str] = []
    active_refresh: dict[str, tuple[str, int]] = {}
    last_generation: dict[str, int] = {}
    refresh_starts = defaultdict(int)
    event_count = 0

    for lineno, line in enumerate(Path(args.events).read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        event_count += 1
        try:
            e = json.loads(line)
        except json.JSONDecodeError as exc:
            violations.append(f"line {lineno}: invalid JSON: {exc}")
            continue
        if not isinstance(e, dict):
            violations.append(f"line {lineno}: event is not an object")
            continue
        if contains_secretish_key(e):
            violations.append(f"line {lineno}: secret-like field present")
            continue

        kind = e.get("event")
        cid = str(e.get("credential_id", ""))
        gen = e.get("generation")
        owner = str(e.get("owner", ""))
        if not cid:
            violations.append(f"line {lineno}: missing credential_id")
            continue
        if not isinstance(gen, int) or gen < 0:
            violations.append(f"line {lineno}: invalid generation")
            continue

        previous = last_generation.get(cid)
        if previous is not None and kind == "refresh_commit" and gen <= previous:
            violations.append(f"line {lineno}: non-monotonic commit generation {gen} <= {previous}")

        if kind == "refresh_start":
            refresh_starts[(cid, gen)] += 1
            if refresh_starts[(cid, gen)] > max_attempts:
                violations.append(f"line {lineno}: refresh retry budget exceeded for {cid} generation {gen}")
            current = active_refresh.get(cid)
            if current is not None and current != (owner, gen):
                violations.append(f"line {lineno}: overlapping refresh owners for {cid}")
            active_refresh[cid] = (owner, gen)
        elif kind in ("refresh_commit", "refresh_abort"):
            active_refresh.pop(cid, None)
            if kind == "refresh_commit":
                last_generation[cid] = gen
        elif kind == "child_request":
            child_id = str(e.get("child_id", ""))
            current = last_generation.get(cid)
            if current is not None and gen < current:
                violations.append(f"line {lineno}: stale child request {child_id} generation {gen} < {current}")

    if active_refresh:
        violations.append("unclosed refresh operations: " + ",".join(sorted(active_refresh)))

    summary = {
        "ok": not violations,
        "events": event_count,
        "credentials": len(set(last_generation) | {k[0] for k in refresh_starts}),
        "committed_generations": last_generation,
        "refresh_attempt_groups": len(refresh_starts),
        "violations": violations,
    }
    print(json.dumps(summary, indent=2, sort_keys=True))
    return 0 if not violations else 1


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(json.dumps({"ok": False, "error": str(exc)}), file=sys.stderr)
        raise SystemExit(2)
