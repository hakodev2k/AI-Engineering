#!/usr/bin/env python3
import json, sys
from pathlib import Path
from datetime import datetime, timezone

REQUIRED = ("session_id", "surface", "canonical_version", "last_durable_turn", "captured_at")

def load(path):
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        raise ValueError(f"{path}: cannot read JSON: {e}")
    missing = [k for k in REQUIRED if k not in data]
    if missing:
        raise ValueError(f"{path}: missing fields: {', '.join(missing)}")
    for key in ("canonical_version", "last_durable_turn"):
        if not isinstance(data[key], int) or data[key] < 0:
            raise ValueError(f"{path}: {key} must be a non-negative integer")
    return data

def lease_active(s):
    expiry = s.get("writer_lease_expires_at")
    if not expiry:
        return s.get("active_writer_id") is not None
    try:
        return datetime.fromisoformat(expiry.replace("Z", "+00:00")) > datetime.now(timezone.utc)
    except Exception:
        return True

def compare(authority, surface):
    mm = []
    if surface["session_id"] != authority["session_id"]:
        return ["session_id"]
    if surface["canonical_version"] < authority["canonical_version"]: mm.append("canonical_version")
    if surface["last_durable_turn"] < authority["last_durable_turn"]: mm.append("last_durable_turn")
    if surface.get("selected_child_id") != authority.get("selected_child_id"): mm.append("selected_child_id")
    aw, sw = authority.get("active_writer_id"), surface.get("active_writer_id")
    if aw and sw and aw != sw and lease_active(authority) and lease_active(surface): mm.append("active_writer_id")
    ar, sr = authority.get("registration_epoch"), surface.get("registration_epoch")
    if ar is not None and sr is not None and sr < ar: mm.append("registration_epoch")
    return mm

def main(argv):
    if len(argv) < 3:
        print("usage: convergence_check.py canonical.json surface.json [surface.json ...]", file=sys.stderr); return 1
    try:
        authority = load(argv[1])
        if authority["surface"] != "canonical": raise ValueError("first snapshot must have surface='canonical'")
        results=[]; blocking=False
        for path in argv[2:]:
            s=load(path); mm=compare(authority,s); blocking |= bool(mm)
            results.append({"surface":s["surface"],"mismatches":mm,"durable_turn_lag":max(0,authority["last_durable_turn"]-s["last_durable_turn"])})
        print(json.dumps({"status":"BLOCK" if blocking else "PASS","results":results}, indent=2))
        return 2 if blocking else 0
    except ValueError as e:
        print(f"error: {e}", file=sys.stderr); return 1

if __name__ == "__main__": raise SystemExit(main(sys.argv))