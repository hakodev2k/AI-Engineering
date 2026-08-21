#!/usr/bin/env python3
import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone

ALLOWED_IMPORTANCE = {"low", "medium", "high", "critical"}
ALLOWED_SENSITIVITY = {"public", "internal", "confidential", "personal-sensitive", "credential", "secret"}
ALLOWED_CLAIM_STATUS = {"fact", "hypothesis", "decision", "executed", "verified", "blocked", "open"}


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def parse_dt(value):
    if not isinstance(value, str):
        raise ValueError("timestamp must be a string")
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)


def main():
    p = argparse.ArgumentParser(description="Validate an evidence bundle without reading source evidence content.")
    p.add_argument("--bundle", required=True)
    p.add_argument("--policy", required=True)
    p.add_argument("--output", required=True)
    args = p.parse_args()

    try:
        bundle = load_json(args.bundle)
        policy = load_json(args.policy)
    except Exception as exc:
        print(f"input-error: {exc}", file=sys.stderr)
        return 2

    errors, warnings = [], []
    for key in ("bundle_id", "task_id", "created_at", "claims", "evidence"):
        if key not in bundle:
            errors.append(f"missing bundle field: {key}")

    evidence = bundle.get("evidence", [])
    claims = bundle.get("claims", [])
    if not isinstance(evidence, list) or not isinstance(claims, list):
        errors.append("claims and evidence must be arrays")
        evidence, claims = [], []

    ids = set()
    evidence_by_id = {}
    for index, item in enumerate(evidence):
        prefix = f"evidence[{index}]"
        if not isinstance(item, dict):
            errors.append(f"{prefix} must be an object")
            continue
        required = ["id", "type", "source", "observed_at", "content_hash", "storage_ref", "context_cost_bytes", "importance", "sensitivity", "required_for"]
        for key in required:
            if key not in item:
                errors.append(f"{prefix} missing {key}")
        eid = item.get("id")
        if not eid:
            continue
        if eid in ids:
            errors.append(f"duplicate evidence id: {eid}")
        ids.add(eid)
        evidence_by_id[eid] = item
        if item.get("importance") not in ALLOWED_IMPORTANCE:
            errors.append(f"{eid}: invalid importance")
        if item.get("sensitivity") not in ALLOWED_SENSITIVITY:
            errors.append(f"{eid}: invalid sensitivity")
        cost = item.get("context_cost_bytes")
        if not isinstance(cost, int) or cost < 0:
            errors.append(f"{eid}: context_cost_bytes must be a non-negative integer")
        content_hash = item.get("content_hash", "")
        if not isinstance(content_hash, str) or not content_hash.startswith("sha256:") or len(content_hash) != 71:
            errors.append(f"{eid}: content_hash must be sha256:<64 hex>")
        else:
            try:
                int(content_hash[7:], 16)
            except ValueError:
                errors.append(f"{eid}: content_hash is not hexadecimal")
        try:
            observed = parse_dt(item.get("observed_at"))
            if observed > datetime.now(timezone.utc):
                warnings.append(f"{eid}: observed_at is in the future")
        except Exception as exc:
            errors.append(f"{eid}: invalid observed_at: {exc}")
        if not isinstance(item.get("required_for", []), list):
            errors.append(f"{eid}: required_for must be an array")

    claim_ids = set()
    required_references = set()
    mandatory_claim_statuses = set(policy.get("retention", {}).get("mandatory_claim_statuses", []))
    for index, claim in enumerate(claims):
        prefix = f"claims[{index}]"
        if not isinstance(claim, dict):
            errors.append(f"{prefix} must be an object")
            continue
        cid = claim.get("id")
        status = claim.get("status")
        req = claim.get("required_evidence_ids")
        if not cid:
            errors.append(f"{prefix} missing id")
            continue
        if cid in claim_ids:
            errors.append(f"duplicate claim id: {cid}")
        claim_ids.add(cid)
        if status not in ALLOWED_CLAIM_STATUS:
            errors.append(f"{cid}: invalid claim status")
        if not isinstance(req, list):
            errors.append(f"{cid}: required_evidence_ids must be an array")
            req = []
        for eid in req:
            if eid not in evidence_by_id:
                errors.append(f"{cid}: references missing evidence {eid}")
            if status in mandatory_claim_statuses:
                required_references.add(eid)

    for eid, item in evidence_by_id.items():
        for cid in item.get("required_for", []):
            if cid not in claim_ids:
                warnings.append(f"{eid}: required_for unknown claim {cid}")

    canonical = json.dumps(bundle, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    result = {
        "status": "blocked" if errors else "verified",
        "bundle_id": bundle.get("bundle_id"),
        "bundle_fingerprint": "sha256:" + hashlib.sha256(canonical).hexdigest(),
        "required_evidence_ids": sorted(required_references),
        "errors": errors,
        "warnings": warnings,
    }
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
        f.write("\n")
    if errors:
        for err in errors:
            print(err, file=sys.stderr)
        return 1
    print(result["bundle_fingerprint"])
    return 0

if __name__ == "__main__":
    sys.exit(main())
