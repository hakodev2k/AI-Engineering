#!/usr/bin/env python3
import argparse, fnmatch, ipaddress, json, sys
from pathlib import Path


def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read policy: {exc}")


def load_events(path):
    events = []
    try:
        with Path(path).open(encoding="utf-8") as fh:
            for number, line in enumerate(fh, 1):
                if not line.strip():
                    continue
                item = json.loads(line)
                dest = item.get("destination")
                if not isinstance(dest, str) or not dest.strip():
                    raise ValueError(f"line {number}: destination must be a non-empty string")
                events.append(item)
    except Exception as exc:
        if isinstance(exc, ValueError):
            raise
        raise ValueError(f"cannot read events: {exc}")
    return events


def matches(destination, pattern):
    d = destination.strip().lower().strip("[]")
    p = pattern.strip().lower()
    try:
        network = ipaddress.ip_network(p, strict=False)
        return ipaddress.ip_address(d) in network
    except ValueError:
        return fnmatch.fnmatchcase(d, p)


def classify(destination, policy):
    approved = policy.get("approved_destinations", [])
    forbidden = policy.get("forbidden_destinations", [])
    if not isinstance(approved, list) or not isinstance(forbidden, list):
        raise ValueError("destination policy entries must be arrays")
    # Explicit named forbids win. Catch-all CIDRs are interpreted only for
    # destinations not explicitly approved, allowing a deny-by-default policy.
    named_forbidden = [p for p in forbidden if p not in ("0.0.0.0/0", "::/0")]
    if any(matches(destination, p) for p in named_forbidden):
        return "forbidden"
    if any(matches(destination, p) for p in approved):
        return "approved"
    if any(matches(destination, p) for p in forbidden):
        return "forbidden"
    return "unknown"


def main():
    ap = argparse.ArgumentParser(description="Attest observed sandbox egress against a fail-closed policy")
    ap.add_argument("--policy", required=True)
    ap.add_argument("--events", required=True)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    try:
        policy = load_json(args.policy)
        events = load_events(args.events)
        if policy.get("require_events", True) and not events:
            raise ValueError("telemetry contains no events")
        decisions = {"approved": 0, "forbidden": 0, "unknown": 0}
        violations = []
        for event in events:
            decision = classify(event["destination"], policy)
            decisions[decision] += 1
            if decision != "approved":
                violations.append({
                    "destination": event["destination"],
                    "decision": decision,
                    "timestamp": event.get("timestamp"),
                    "source": event.get("source"),
                    "transport": event.get("transport")
                })
        status = "PASS" if decisions["forbidden"] == 0 and decisions["unknown"] == 0 else "BLOCK"
        result = {
            "status": status,
            "policy_version": str(policy.get("policy_version", "unknown")),
            "event_count": len(events),
            "decisions": decisions,
            "violations": violations
        }
        Path(args.out).write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        print(json.dumps(result, sort_keys=True))
        return 0 if status == "PASS" else 2
    except (ValueError, json.JSONDecodeError) as exc:
        print(f"attestation error: {exc}", file=sys.stderr)
        return 3
    except OSError as exc:
        print(f"I/O error: {exc}", file=sys.stderr)
        return 4


if __name__ == "__main__":
    sys.exit(main())
