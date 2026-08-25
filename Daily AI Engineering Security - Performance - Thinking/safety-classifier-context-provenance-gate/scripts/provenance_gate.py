#!/usr/bin/env python3
"""Deterministic provenance envelope and safety-decision reconciler."""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path
from typing import Any

VALID_TRUST = {"trusted_control", "user", "untrusted"}
VALID_STATUS = {"allow", "reject", "unavailable"}
VALID_DECISIONS = {"allow", "manual_review", "block"}

def canonical_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def load_json(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot load JSON {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data

def envelope_segments(segments: list[dict[str, Any]]) -> list[dict[str, Any]]:
    out = []
    for idx, segment in enumerate(segments):
        if not isinstance(segment, dict):
            raise ValueError(f"segment {idx} must be an object")
        content, origin, trust = segment.get("content"), segment.get("origin"), segment.get("trust")
        if not isinstance(content, str) or not isinstance(origin, str):
            raise ValueError(f"segment {idx} requires string content and origin")
        if trust not in VALID_TRUST:
            raise ValueError(f"segment {idx} trust must be one of {sorted(VALID_TRUST)}")
        digest = canonical_hash(content)
        out.append({"id": f"seg-{idx:04d}-{digest[:12]}", "origin": origin, "trust": trust, "sha256": digest, "content": content})
    return out

def reconcile(payload: dict[str, Any], policy: dict[str, Any]) -> dict[str, Any]:
    action, segments, classifier = payload.get("action"), payload.get("segments"), payload.get("classifier")
    retry_count = payload.get("retry_count", 0)
    if not isinstance(action, dict) or not isinstance(segments, list) or not isinstance(classifier, dict):
        raise ValueError("action, segments, and classifier are required")
    if not isinstance(retry_count, int) or retry_count < 0:
        raise ValueError("retry_count must be a non-negative integer")
    action_name, risk = action.get("name"), action.get("risk")
    if not isinstance(action_name, str) or not isinstance(risk, str):
        raise ValueError("action.name and action.risk must be strings")
    env = envelope_segments(segments)
    by_id = {s["id"]: s for s in env}
    status = classifier.get("status")
    if status not in VALID_STATUS:
        raise ValueError(f"classifier.status must be one of {sorted(VALID_STATUS)}")
    max_retries = policy.get("max_identical_retries", 1)
    if not isinstance(max_retries, int) or max_retries < 0:
        raise ValueError("max_identical_retries must be non-negative")
    flagged = classifier.get("flagged_segment_ids", [])
    if not isinstance(flagged, list) or not all(isinstance(x, str) for x in flagged):
        raise ValueError("classifier.flagged_segment_ids must be a list of strings")
    unknown = [sid for sid in flagged if sid not in by_id]
    if unknown:
        raise ValueError(f"classifier referenced unknown segment ids: {unknown}")
    reasons = []
    if status == "allow":
        decision = "allow"; reasons.append("CLASSIFIER_ALLOW")
    elif status == "unavailable":
        decision = policy.get("classifier_unavailable", {}).get(risk, "block")
        if decision not in VALID_DECISIONS:
            raise ValueError(f"invalid unavailable fallback for {risk}: {decision}")
        reasons += ["CLASSIFIER_UNAVAILABLE", f"FALLBACK_{decision.upper()}"]
    else:
        flagged_segments = [by_id[sid] for sid in flagged]
        if not flagged_segments:
            decision = "block"; reasons += ["CLASSIFIER_REJECT", "NO_FLAGGED_PROVENANCE"]
        elif any(s["trust"] in {"user", "untrusted"} for s in flagged_segments):
            decision = "block"; reasons += ["CLASSIFIER_REJECT", "UNTRUSTED_OR_USER_CONTENT_FLAGGED"]
        else:
            decision = "manual_review"; reasons += ["CLASSIFIER_REJECT", "TRUSTED_CONTROL_CONTENT_FLAGGED"]
    if status == "reject" and retry_count > max_retries:
        reasons.append("RETRY_BUDGET_EXHAUSTED")
    fingerprint = canonical_hash(json.dumps({"action": action, "segments": [{"id": s["id"], "sha256": s["sha256"], "trust": s["trust"], "origin": s["origin"]} for s in env], "classifier_status": status, "flagged": flagged}, sort_keys=True, separators=(",", ":")))
    return {"decision": decision, "reason_codes": reasons, "action": {"name": action_name, "risk": risk}, "segments": env, "classifier": {"status": status, "flagged_segment_ids": flagged, "decision_id": classifier.get("decision_id")}, "retry_count": retry_count, "max_identical_retries": max_retries, "evidence_fingerprint": fingerprint}

def main() -> int:
    p = argparse.ArgumentParser(); p.add_argument("input", type=Path); p.add_argument("--policy", type=Path, required=True); p.add_argument("--output", type=Path); args = p.parse_args()
    try:
        result = reconcile(load_json(args.input), load_json(args.policy))
    except ValueError as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr); return 4
    encoded = json.dumps(result, indent=2, sort_keys=True)
    if args.output:
        try: args.output.write_text(encoded + "\n", encoding="utf-8")
        except OSError as exc:
            print(json.dumps({"error": f"cannot write output: {exc}"}), file=sys.stderr); return 4
    else: print(encoded)
    return {"allow": 0, "manual_review": 2, "block": 3}[result["decision"]]

if __name__ == "__main__":
    raise SystemExit(main())
