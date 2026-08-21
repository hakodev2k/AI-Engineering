#!/usr/bin/env python3
import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise SystemExit(f"missing file: {path}")
    except json.JSONDecodeError as exc:
        raise SystemExit(f"invalid JSON in {path}: {exc}")


def parse_time(value):
    if not value:
        return None
    value = value.replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(value)
    except ValueError:
        return None
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def source_score(source, weights, now):
    authority = int(source.get("authority", 0))
    relevance = int(source.get("relevance", 0))
    corroboration = 100 if source.get("corroborated") else 0
    freshness = 100
    if source.get("dynamic"):
        observed = parse_time(source.get("observed_at"))
        if observed is None:
            freshness = 0
        else:
            age_hours = max(0, (now - observed.astimezone(timezone.utc)).total_seconds() / 3600)
            freshness = max(0, round(100 - min(age_hours, 240) / 240 * 100))
    total_weight = sum(weights.values()) or 1
    return round((
        authority * weights.get("authority", 0) +
        freshness * weights.get("freshness", 0) +
        relevance * weights.get("relevance", 0) +
        corroboration * weights.get("corroboration", 0)
    ) / total_weight)


def evaluate(manifest, policy, now=None):
    now = now or datetime.now(timezone.utc)
    errors, warnings = [], []
    sources = manifest.get("sources", [])
    claims = manifest.get("claims", [])
    allowed = set(policy.get("allowed_source_types", []))
    authoritative = set(policy.get("authoritative_source_types", []))
    blocked_patterns = tuple(policy.get("blocked_source_patterns", []))

    if not sources:
        errors.append("at least one source is required")

    ids = set()
    authoritative_count = 0
    unverified_count = 0
    scores = []
    for source in sources:
        sid = source.get("id")
        if not sid or sid in ids:
            errors.append(f"source id is missing or duplicated: {sid!r}")
            continue
        ids.add(sid)
        stype = source.get("type")
        location = str(source.get("location", ""))
        if stype not in allowed:
            errors.append(f"source {sid} has disallowed type: {stype}")
        if any(pattern in location.lower() for pattern in blocked_patterns):
            errors.append(f"source {sid} matches blocked source pattern")
        if stype in authoritative:
            authoritative_count += 1
        if not source.get("corroborated"):
            unverified_count += 1
        if source.get("dynamic") and policy.get("require_timestamp_for_dynamic_sources") and not parse_time(source.get("observed_at")):
            errors.append(f"dynamic source {sid} requires a valid observed_at timestamp")
        scores.append(source_score(source, policy.get("score_weights", {}), now))

    if authoritative_count < int(policy.get("minimum_authoritative_sources", 0)):
        errors.append("insufficient authoritative sources")
    if unverified_count > int(policy.get("maximum_unverified_sources", 999999)):
        errors.append("too many uncorroborated sources")

    for claim in claims:
        cid = claim.get("id", "<unnamed>")
        refs = claim.get("source_ids", [])
        if policy.get("require_provenance_for_claims") and not refs:
            errors.append(f"claim {cid} has no provenance")
        missing = [ref for ref in refs if ref not in ids]
        if missing:
            errors.append(f"claim {cid} references unknown sources: {', '.join(missing)}")
        if claim.get("confidence") == "high" and len(refs) < 2:
            warnings.append(f"high-confidence claim {cid} has fewer than two sources")

    score = round(sum(scores) / len(scores)) if scores else 0
    if score < int(policy.get("minimum_overall_score", 0)):
        errors.append(f"overall source score {score} is below minimum {policy['minimum_overall_score']}")

    status = "verified" if not errors else "blocked"
    return {"status": status, "score": score, "errors": errors, "warnings": warnings}


def main():
    parser = argparse.ArgumentParser(description="Validate AI context provenance and source trust before agent execution.")
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--policy", type=Path, default=Path("config/trust-policy.json"))
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    manifest = load_json(args.manifest)
    policy = load_json(args.policy)
    result = evaluate(manifest, policy)
    manifest["status"] = result["status"]
    manifest["verification"] = {"score": result["score"], "errors": result["errors"], "warnings": result["warnings"]}
    rendered = json.dumps(manifest, indent=2, ensure_ascii=False) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
    else:
        print(rendered, end="")
    return 0 if result["status"] == "verified" else 2


if __name__ == "__main__":
    sys.exit(main())
