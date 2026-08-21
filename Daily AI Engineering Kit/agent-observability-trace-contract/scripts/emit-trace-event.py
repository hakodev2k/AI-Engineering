#!/usr/bin/env python3
import argparse, datetime as dt, hashlib, json, re, sys
from pathlib import Path

SENSITIVE = re.compile(r"password|passwd|secret|token|authorization|cookie|private[_-]?key|connection[_-]?string|api[_-]?key|apikey", re.I)

def sanitize(value):
    if isinstance(value, dict):
        out = {}
        for k, v in value.items():
            if SENSITIVE.search(str(k)):
                out[k] = "[REDACTED]"
            else:
                out[k] = sanitize(v)
        return out
    if isinstance(value, list):
        return [sanitize(v) for v in value]
    if isinstance(value, str) and len(value) > 512:
        return value[:509] + "..."
    return value

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--trace", required=True)
    p.add_argument("--event", required=True)
    p.add_argument("--trace-id", required=True)
    p.add_argument("--span-id", required=True)
    p.add_argument("--parent-span-id")
    p.add_argument("--actor", required=True)
    p.add_argument("--status", default="started")
    p.add_argument("--attempt", type=int)
    p.add_argument("--risk", default="low")
    p.add_argument("--side-effect-class")
    p.add_argument("--attributes-json")
    p.add_argument("--evidence-ref", action="append", default=[])
    args = p.parse_args()
    attrs = {}
    if args.attributes_json:
        try:
            attrs = json.loads(Path(args.attributes_json).read_text(encoding="utf-8"))
        except Exception as e:
            print(f"failed to read attributes: {e}", file=sys.stderr); return 2
        if not isinstance(attrs, dict):
            print("attributes JSON must be an object", file=sys.stderr); return 2
    event = {
        "event_version": 1,
        "timestamp": dt.datetime.now(dt.timezone.utc).isoformat(),
        "trace_id": args.trace_id,
        "span_id": args.span_id,
        "parent_span_id": args.parent_span_id,
        "event": args.event,
        "actor": args.actor,
        "status": args.status,
        "attempt": args.attempt,
        "risk": args.risk,
        "side_effect_class": args.side_effect_class,
        "evidence_refs": args.evidence_ref,
        "attributes": sanitize(attrs),
    }
    target = Path(args.trace)
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("a", encoding="utf-8") as f:
        f.write(json.dumps(event, separators=(",", ":"), sort_keys=True) + "\n")
    print(hashlib.sha256(json.dumps(event, sort_keys=True).encode()).hexdigest())
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
