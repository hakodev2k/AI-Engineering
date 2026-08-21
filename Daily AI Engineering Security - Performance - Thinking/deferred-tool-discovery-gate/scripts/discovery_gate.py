#!/usr/bin/env python3
"""Gate terminal capability decisions on bounded deferred-tool discovery.

Exit codes: 0 allow, 2 discovery required, 3 review/input error.
"""
from __future__ import annotations
import argparse, json, re, sys
from pathlib import Path

TERMINAL = {"decline", "ask-user", "workaround", "fallback"}

def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s.lower()).strip()

def csvset(s: str) -> set[str]:
    return {x.strip() for x in s.split(",") if x.strip()}

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--registry", required=True)
    ap.add_argument("--task", required=True)
    ap.add_argument("--decision", required=True, choices=sorted(TERMINAL))
    ap.add_argument("--loaded", default="")
    ap.add_argument("--searched", default="")
    args = ap.parse_args()
    try:
        data = json.loads(Path(args.registry).read_text(encoding="utf-8"))
        caps = data.get("capabilities")
        if not isinstance(caps, list):
            raise ValueError("registry.capabilities must be a list")
        loaded, searched = csvset(args.loaded), csvset(args.searched)
        task = norm(args.task)
        matched = []
        for c in caps:
            cid = c.get("id")
            intents = c.get("intents", [])
            if not isinstance(cid, str) or not isinstance(intents, list):
                raise ValueError("invalid capability entry")
            if any(norm(str(i)) in task for i in intents):
                matched.append(cid)
        unresolved = [c for c in matched if c not in loaded and c not in searched]
        result = {
            "decision": "discover" if unresolved else "allow",
            "matched_capabilities": matched,
            "unresolved_capabilities": unresolved,
            "searched": sorted(searched),
            "loaded": sorted(loaded)
        }
        print(json.dumps(result, sort_keys=True))
        return 2 if unresolved else 0
    except (OSError, ValueError, json.JSONDecodeError) as e:
        print(json.dumps({"decision":"review","error":str(e)}), file=sys.stderr)
        return 3

if __name__ == "__main__":
    raise SystemExit(main())
