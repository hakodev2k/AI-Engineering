#!/usr/bin/env python3
"""Small durable ledger for side-effecting agent operations.

States: prepared, dispatched, unknown-after-dispatch, confirmed-applied,
confirmed-not-applied, duplicate-detected.
Exit codes: 0 success/eligible, 2 retry blocked or invalid transition, 3 I/O/usage error.
"""
from __future__ import annotations
import argparse, hashlib, json, os, tempfile, time
from pathlib import Path

STATES = {"prepared","dispatched","unknown-after-dispatch","confirmed-applied","confirmed-not-applied","duplicate-detected"}
TRANSITIONS = {
    "prepared": {"dispatched","confirmed-not-applied"},
    "dispatched": {"unknown-after-dispatch","confirmed-applied","confirmed-not-applied"},
    "unknown-after-dispatch": {"confirmed-applied","confirmed-not-applied","duplicate-detected"},
    "confirmed-not-applied": {"dispatched"},
    "confirmed-applied": set(),
    "duplicate-detected": set(),
}

def atomic_write(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix=".side-effects-", dir=str(path.parent))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, sort_keys=True); f.write("\n"); f.flush(); os.fsync(f.fileno())
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp): os.unlink(tmp)

def load(path: Path) -> dict:
    if not path.exists(): return {"version":1,"operations":{}}
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or not isinstance(data.get("operations"), dict): raise ValueError("invalid ledger")
    return data

def intent_hash(intent: str) -> str:
    return hashlib.sha256(intent.strip().encode()).hexdigest()

def main() -> int:
    ap = argparse.ArgumentParser(); sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("prepare"); p.add_argument("--file", required=True); p.add_argument("--key", required=True); p.add_argument("--kind", required=True); p.add_argument("--intent", required=True)
    t = sub.add_parser("transition"); t.add_argument("--file", required=True); t.add_argument("--key", required=True); t.add_argument("--state", required=True, choices=sorted(STATES)); t.add_argument("--evidence", default=""); t.add_argument("--remote-id", default="")
    r = sub.add_parser("retry-check"); r.add_argument("--file", required=True); r.add_argument("--key", required=True); r.add_argument("--idempotent-replay", action="store_true")
    args = ap.parse_args(); path = Path(args.file)
    try:
        data = load(path); ops = data["operations"]
        if args.cmd == "prepare":
            h = intent_hash(args.intent)
            if args.key in ops:
                if ops[args.key].get("intent_hash") != h: print("operation key reused for different intent"); return 2
                print(json.dumps(ops[args.key], indent=2)); return 0
            ops[args.key] = {"kind":args.kind,"intent_hash":h,"state":"prepared","created_at":time.time(),"updated_at":time.time(),"history":[{"state":"prepared","at":time.time()}]}
            atomic_write(path, data); print(json.dumps(ops[args.key], indent=2)); return 0
        if args.key not in ops: print("unknown operation key"); return 3
        op = ops[args.key]
        if args.cmd == "transition":
            cur, nxt = op["state"], args.state
            if nxt != cur and nxt not in TRANSITIONS.get(cur, set()): print(f"invalid transition {cur}->{nxt}"); return 2
            op["state"] = nxt; op["updated_at"] = time.time(); op.setdefault("history", []).append({"state":nxt,"at":time.time(),"evidence":args.evidence})
            if args.remote_id: op["remote_id"] = args.remote_id
            atomic_write(path, data); print(json.dumps(op, indent=2)); return 0
        eligible = op["state"] == "confirmed-not-applied" or (args.idempotent_replay and op["state"] in {"dispatched","unknown-after-dispatch"})
        print(json.dumps({"key":args.key,"state":op["state"],"retry_allowed":eligible}))
        return 0 if eligible else 2
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(str(exc)); return 3

if __name__ == "__main__": raise SystemExit(main())