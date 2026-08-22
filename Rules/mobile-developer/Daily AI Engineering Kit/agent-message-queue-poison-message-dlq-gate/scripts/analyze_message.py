#!/usr/bin/env python3
import argparse, json, sys, time, hashlib
from pathlib import Path

SENSITIVE = {"password", "token", "secret", "authorization"}

def redact(value):
    if isinstance(value, dict):
        return {k: ("***REDACTED***" if k.lower() in SENSITIVE else redact(v)) for k, v in value.items()}
    if isinstance(value, list):
        return [redact(v) for v in value]
    return value

def classify(msg, max_attempts, max_age):
    now = int(time.time())
    attempts = int(msg.get("attempt_count", 0))
    created = int(msg.get("created_at_epoch", now))
    missing = [k for k in ("message_id", "correlation_id", "schema_version", "payload") if not msg.get(k)]
    evidence = []
    if missing:
        evidence.append("missing required fields: " + ", ".join(missing))
        return "blocked", "schema", evidence
    if attempts >= max_attempts:
        evidence.append(f"attempt_count {attempts} reached max {max_attempts}")
        return "quarantine", "poison", evidence
    if now - created > max_age:
        evidence.append(f"message age {now-created}s exceeds {max_age}s")
        return "quarantine", "poison", evidence
    err = str(msg.get("last_error", "")).lower()
    transient_terms = ("timeout", "temporarily unavailable", "429", "rate limit", "connection reset")
    business_terms = ("validation", "business rule", "not allowed", "invalid state")
    if any(t in err for t in transient_terms):
        evidence.append("last_error matches transient failure signature")
        return "pass", "transient", evidence
    if any(t in err for t in business_terms):
        evidence.append("last_error matches deterministic business-rule failure")
        return "quarantine", "business-rule", evidence
    if err:
        evidence.append("failure exists but category is not deterministic")
        return "needs-review", "unknown", evidence
    evidence.append("required metadata present and no failure evidence supplied")
    return "pass", "unknown", evidence

def main():
    p = argparse.ArgumentParser()
    p.add_argument("message")
    p.add_argument("--max-attempts", type=int, default=5)
    p.add_argument("--max-age", type=int, default=86400)
    p.add_argument("--out")
    args = p.parse_args()
    try:
        msg = json.loads(Path(args.message).read_text(encoding="utf-8"))
    except Exception as e:
        print(f"input error: {e}", file=sys.stderr); return 2
    status, cls, evidence = classify(msg, args.max_attempts, args.max_age)
    safe = redact(msg)
    fingerprint = hashlib.sha256(json.dumps(safe, sort_keys=True).encode()).hexdigest()[:16]
    result = {
        "status": status,
        "message_id": str(msg.get("message_id", "unknown")),
        "correlation_id": str(msg.get("correlation_id", "")),
        "attempt_count": int(msg.get("attempt_count", 0)),
        "classification": cls,
        "risk": "high" if status in ("quarantine", "blocked") else "medium" if status == "needs-review" else "low",
        "evidence": evidence + [f"redacted_fingerprint={fingerprint}"],
        "recommended_action": "move to DLQ; inspect root cause; replay only after approval" if status == "quarantine" else "fix producer/schema before retry" if status == "blocked" else "collect more evidence before retry" if status == "needs-review" else "retry within bounded policy if processing still required",
        "verification_status": "not-run"
    }
    text = json.dumps(result, indent=2)
    if args.out: Path(args.out).write_text(text + "\n", encoding="utf-8")
    print(text)
    return 1 if status in ("quarantine", "blocked", "needs-review") else 0

if __name__ == "__main__":
    raise SystemExit(main())
