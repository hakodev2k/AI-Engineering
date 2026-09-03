#!/usr/bin/env python3
import argparse, hashlib, json, sys, time
from pathlib import Path

REQUIRED = {"action", "target", "side_effect", "trust_zone"}

def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        raise ValueError(f"cannot read {path}: {e}")

def fingerprint(op):
    missing = REQUIRED - set(op)
    if missing:
        raise ValueError("missing operation fields: " + ",".join(sorted(missing)))
    canonical = {k: str(op[k]).strip().lower() for k in sorted(REQUIRED)}
    raw = json.dumps(canonical, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(raw.encode()).hexdigest(), canonical

def equivalent(a, b, cfg):
    if a["action"] != b["action"] or a["target"] != b["target"]:
        return False
    levels = cfg["side_effect_levels"]
    zones = cfg["trust_zones"]
    return levels.get(b["side_effect"], 999) >= levels.get(a["side_effect"], 999) and zones.get(b["trust_zone"], 999) >= zones.get(a["trust_zone"], 999)

def main():
    p = argparse.ArgumentParser(description="Block cross-surface re-execution of policy-denied operations")
    p.add_argument("--policy", required=True)
    p.add_argument("--ledger", required=True)
    p.add_argument("--operation", required=True)
    p.add_argument("--approval")
    args = p.parse_args()
    try:
        cfg, ledger, op = load(args.policy), load(args.ledger), load(args.operation)
        _, normalized = fingerprint(op)
        now = int(time.time())
        approval = load(args.approval) if args.approval else None
        for record in ledger.get("denials", []):
            created = int(record.get("created_at", 0))
            if created and now - created > int(cfg.get("denial_ttl_seconds", 3600)):
                continue
            denied = record.get("operation")
            if not isinstance(denied, dict):
                if cfg.get("fail_closed_on_missing_provenance", True):
                    print(json.dumps({"decision":"block","reason":"malformed_denial_provenance"}))
                    return 2
                continue
            _, denied_norm = fingerprint(denied)
            if equivalent(denied_norm, normalized, cfg):
                if approval and approval.get("approved") is True and approval.get("trust_zone") == normalized["trust_zone"] and approval.get("operation_target", "").lower() == normalized["target"]:
                    print(json.dumps({"decision":"allow","reason":"explicit_cross_zone_approval"}))
                    return 0
                print(json.dumps({"decision":"block","reason":"active_equivalent_policy_denial","matched_denial":record.get("id")}))
                return 3
        print(json.dumps({"decision":"allow","reason":"no_matching_active_denial"}))
        return 0
    except Exception as e:
        print(json.dumps({"decision":"block","reason":"gate_error","error":str(e)}), file=sys.stderr)
        return 2

if __name__ == "__main__":
    raise SystemExit(main())
