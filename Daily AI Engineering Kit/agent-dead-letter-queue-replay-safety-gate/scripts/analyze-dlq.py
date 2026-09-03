#!/usr/bin/env python3
import argparse
import json
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


def first_present(obj, names):
    for name in names:
        if name in obj and obj[name] not in (None, ""):
            return obj[name]
    return None


def parse_time(value):
    if value is None:
        return None
    text = str(value).replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(text)
    except ValueError:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def main():
    p = argparse.ArgumentParser(description="Analyze exported DLQ messages without mutating a queue")
    p.add_argument("--input", required=True)
    p.add_argument("--config", required=True)
    p.add_argument("--output", required=True)
    args = p.parse_args()

    try:
        data = json.loads(Path(args.input).read_text(encoding="utf-8"))
        cfg = json.loads(Path(args.config).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    messages = data.get("messages") if isinstance(data, dict) else data
    if not isinstance(messages, list):
        print("error: input must be a JSON array or object containing messages[]", file=sys.stderr)
        return 2

    now = datetime.now(timezone.utc)
    seen = set()
    findings = []
    classes = Counter()

    for index, msg in enumerate(messages):
        if not isinstance(msg, dict):
            findings.append({"index": index, "severity": "block", "finding": "message is not an object"})
            continue
        mid = first_present(msg, cfg["message_id_fields"])
        failure = first_present(msg, cfg["failure_fields"])
        tenant = first_present(msg, cfg["tenant_id_fields"])
        ts_raw = first_present(msg, cfg["timestamp_fields"])
        ts = parse_time(ts_raw)
        age_hours = (now - ts).total_seconds() / 3600 if ts else None
        if mid is None:
            findings.append({"index": index, "severity": "block", "finding": "missing message identity"})
        elif str(mid) in seen:
            findings.append({"index": index, "message_id": str(mid), "severity": "block", "finding": "duplicate message identity in export"})
        else:
            seen.add(str(mid))
        classification = str(failure) if failure is not None else "unknown"
        classes[classification] += 1
        if classification == "unknown" and cfg.get("block_unknown_failure_class", True):
            findings.append({"index": index, "message_id": str(mid) if mid else None, "severity": "block", "finding": "unknown failure classification"})
        if classification in set(cfg.get("permanent_failure_classes", [])):
            findings.append({"index": index, "message_id": str(mid) if mid else None, "severity": "block", "finding": f"permanent failure class: {classification}"})
        if age_hours is not None and age_hours > float(cfg["max_age_hours_without_approval"]):
            findings.append({"index": index, "message_id": str(mid) if mid else None, "severity": "approval", "finding": f"message age {age_hours:.1f}h exceeds threshold"})
        if tenant is None:
            findings.append({"index": index, "message_id": str(mid) if mid else None, "severity": "review", "finding": "tenant identity not present in exported envelope"})

    result = {
        "message_count": len(messages),
        "failure_classes": dict(classes),
        "finding_count": len(findings),
        "findings": findings,
    }
    Path(args.output).write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2, sort_keys=True))
    return 1 if any(f["severity"] == "block" for f in findings) else 0


if __name__ == "__main__":
    raise SystemExit(main())
