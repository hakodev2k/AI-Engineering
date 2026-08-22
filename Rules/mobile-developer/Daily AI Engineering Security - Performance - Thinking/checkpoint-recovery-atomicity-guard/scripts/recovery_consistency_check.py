#!/usr/bin/env python3
"""Fail-closed validator for checkpoint recovery snapshots."""
import json, pathlib, sys
VALID_EFFECT_STATES = {"committed", "not_committed", "unknown"}

def load(path):
    try:
        return json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"status":"invalid","error":str(exc)})); raise SystemExit(2)

def main():
    if len(sys.argv) != 2:
        print("usage: recovery_consistency_check.py SNAPSHOT.json", file=sys.stderr); return 2
    data = load(sys.argv[1])
    if not isinstance(data, dict): return 2
    checkpoint, writes, effects = data.get("checkpoint"), data.get("pending_writes", []), data.get("side_effects", [])
    if not isinstance(checkpoint, dict) or not isinstance(writes, list) or not isinstance(effects, list): return 2
    tid = checkpoint.get("transition_id")
    if not isinstance(tid, str) or not tid.strip(): return 2
    errors, unknown = [], []
    for i, w in enumerate(writes):
        if not isinstance(w, dict) or w.get("transition_id") != tid: errors.append(f"pending_write[{i}]:transition_mismatch")
    for i, e in enumerate(effects):
        if not isinstance(e, dict): errors.append(f"side_effect[{i}]:invalid"); continue
        state = e.get("state")
        if state not in VALID_EFFECT_STATES: errors.append(f"side_effect[{i}]:invalid_state")
        if e.get("transition_id") != tid: errors.append(f"side_effect[{i}]:transition_mismatch")
        if state == "unknown": unknown.append(i)
        if state != "unknown" and not e.get("evidence_ref"): errors.append(f"side_effect[{i}]:missing_evidence")
    blocked = bool(errors or unknown)
    print(json.dumps({"status":"blocked" if blocked else "safe","transition_id":tid,"errors":errors,"unknown_side_effect_indexes":unknown,"decision":"block-for-reconciliation" if blocked else "eligible-for-policy-decision"}, indent=2))
    return 3 if blocked else 0

if __name__ == "__main__": raise SystemExit(main())
