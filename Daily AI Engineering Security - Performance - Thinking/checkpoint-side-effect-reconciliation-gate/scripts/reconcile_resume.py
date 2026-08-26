#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"cannot_read:{path}:{exc}"}))
        raise SystemExit(2)


def stable_hash(value):
    raw = json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def reconcile(checkpoint, world, ledger, policy):
    reasons = []
    cp_seq = int(checkpoint.get("sequence", -1))
    world_seq = int(world.get("sequence", -1))
    if cp_seq < 0 or world_seq < 0:
        reasons.append("missing_sequence")
    if world_seq > cp_seq:
        reasons.append("world_ahead_of_checkpoint")

    checkpoint_receipts = set(checkpoint.get("completed_operation_ids", []))
    world_receipts = set(world.get("completed_operation_ids", []))
    ledger_ids = {str(x.get("operation_id")) for x in ledger if x.get("status") == "completed"}

    unexplained = sorted(world_receipts - checkpoint_receipts - ledger_ids)
    if unexplained:
        reasons.append("unexplained_world_side_effects:" + ",".join(unexplained))

    expected_fp = checkpoint.get("expected_world_fingerprint")
    actual_fp = world.get("fingerprint") or stable_hash(world.get("state", {}))
    if expected_fp and expected_fp != actual_fp:
        reasons.append("world_fingerprint_mismatch")

    status = "reconciled" if not reasons else "blocked"
    mutation_allowed = status in set(policy.get("allowed_statuses_for_mutation", ["reconciled"]))
    return {
        "ok": mutation_allowed,
        "status": status,
        "mutation_allowed": mutation_allowed,
        "checkpoint_sequence": cp_seq,
        "world_sequence": world_seq,
        "world_fingerprint": actual_fp,
        "reasons": reasons,
        "requires_human_approval": bool(reasons and policy.get("require_human_approval_on_world_ahead", True)),
    }


def main():
    p = argparse.ArgumentParser(description="Reconcile restored agent checkpoint with durable world state.")
    p.add_argument("--checkpoint", required=True)
    p.add_argument("--world", required=True)
    p.add_argument("--ledger", required=True)
    p.add_argument("--policy", required=True)
    args = p.parse_args()
    checkpoint = load_json(args.checkpoint)
    world = load_json(args.world)
    ledger_doc = load_json(args.ledger)
    policy = load_json(args.policy)
    ledger = ledger_doc.get("operations", []) if isinstance(ledger_doc, dict) else ledger_doc
    if not isinstance(ledger, list):
        print(json.dumps({"ok": False, "error": "ledger_must_be_list_or_operations_object"}))
        return 2
    result = reconcile(checkpoint, world, ledger, policy)
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3


if __name__ == "__main__":
    raise SystemExit(main())
