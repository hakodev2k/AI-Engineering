#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path


def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc


def artifact_hash(item):
    h = item.get("sha256")
    if h:
        return str(h).lower()
    payload = item.get("payload")
    if payload is None:
        return None
    if not isinstance(payload, str):
        payload = json.dumps(payload, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def check(policy, manifest, ledger):
    thread = manifest.get("thread_id")
    parent = manifest.get("parent_thread_id")
    items = manifest.get("artifacts", [])
    if not isinstance(thread, str) or not isinstance(items, list):
        return 3, {"decision": "block", "reason": "invalid_manifest"}
    if policy.get("fail_closed_on_missing_lineage") and manifest.get("is_child") and not parent:
        return 3, {"decision": "block", "reason": "missing_parent_lineage"}
    max_inline = int(policy["max_inline_bytes_per_artifact"])
    max_replays = int(policy["max_replays_per_artifact_per_thread"])
    max_child = int(policy["max_inherited_inline_bytes_per_child"])
    max_thread = int(policy["max_total_inline_bytes_per_thread"])
    require_hash = int(policy["require_hash_for_payload_bytes"])
    inherited = 0
    total = 0
    violations = []
    references = []
    counts = ledger.get("counts", {}) if isinstance(ledger, dict) else {}
    for idx, item in enumerate(items):
        if not isinstance(item, dict):
            return 3, {"decision": "block", "reason": "invalid_artifact", "index": idx}
        size = int(item.get("inline_bytes", 0))
        total += size
        if item.get("inherited"):
            inherited += size
        h = artifact_hash(item)
        if size >= require_hash and not h:
            violations.append({"index": idx, "reason": "missing_hash"})
            continue
        if size > max_inline:
            references.append({"index": idx, "sha256": h, "reason": "artifact_inline_budget"})
        if h:
            replay_count = int(counts.get(f"{thread}:{h}", 0))
            if replay_count >= max_replays and size > 0:
                references.append({"index": idx, "sha256": h, "reason": "replay_budget"})
    if inherited > max_child:
        violations.append({"reason": "child_inherited_budget", "bytes": inherited})
    if total > max_thread:
        violations.append({"reason": "thread_inline_budget", "bytes": total})
    if violations:
        return 2, {"decision": "block", "violations": violations, "references": references}
    if references:
        decision = "reference" if policy.get("allow_reference_rehydration") else "block"
        return 2, {"decision": decision, "references": references}
    return 0, {"decision": "allow", "inline_bytes": total, "inherited_inline_bytes": inherited}


def main():
    p = argparse.ArgumentParser(description="Check multimodal inline-payload replay budgets")
    sub = p.add_subparsers(dest="cmd", required=True)
    c = sub.add_parser("check")
    c.add_argument("--policy", required=True)
    c.add_argument("--manifest", required=True)
    c.add_argument("--ledger", required=True)
    args = p.parse_args()
    try:
        code, result = check(load(args.policy), load(args.manifest), load(args.ledger))
    except (ValueError, KeyError, TypeError) as exc:
        code, result = 3, {"decision": "block", "reason": "input_error", "error": str(exc)}
    print(json.dumps(result, sort_keys=True))
    return code


if __name__ == "__main__":
    sys.exit(main())
