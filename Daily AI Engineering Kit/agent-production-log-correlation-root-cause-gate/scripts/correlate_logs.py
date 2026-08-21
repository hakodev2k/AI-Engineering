#!/usr/bin/env python3
import argparse
import hashlib
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

SECRET_KEYS = {"authorization", "cookie", "password", "secret", "api_key", "access_token"}
CORRELATION_KEYS = ["trace_id", "request_id", "correlation_id", "operation_id"]
ABNORMAL_LEVELS = {"error", "fatal", "critical"}


def parse_ts(value: str) -> datetime:
    if value.endswith("Z"):
        value = value[:-1] + "+00:00"
    dt = datetime.fromisoformat(value)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def redact(value):
    if isinstance(value, dict):
        out = {}
        for k, v in value.items():
            if k.lower() in SECRET_KEYS:
                out[k] = "[REDACTED]"
            else:
                out[k] = redact(v)
        return out
    if isinstance(value, list):
        return [redact(v) for v in value]
    return value


def read_events(paths):
    events = []
    for path in paths:
        p = Path(path)
        if not p.exists() or not p.is_file():
            raise FileNotFoundError(path)
        text = p.read_text(encoding="utf-8")
        try:
            parsed = json.loads(text)
            rows = parsed if isinstance(parsed, list) else [parsed]
        except json.JSONDecodeError:
            rows = []
            for idx, line in enumerate(text.splitlines(), start=1):
                if not line.strip():
                    continue
                try:
                    rows.append(json.loads(line))
                except json.JSONDecodeError as exc:
                    raise ValueError(f"{path}:{idx}: invalid JSON: {exc}") from exc
        for row in rows:
            if not isinstance(row, dict):
                continue
            row = redact(row)
            row["_source"] = str(p)
            events.append(row)
    return events


def choose_key(events, requested_key, requested_value):
    if requested_key and requested_value:
        return requested_key, requested_value
    for key in CORRELATION_KEYS:
        values = [str(e.get(key)) for e in events if e.get(key) not in (None, "")]
        if values:
            return key, values[0]
    return None, None


def normalize(events, key, value, start, end):
    out = []
    for e in events:
        ts_raw = e.get("timestamp") or e.get("time") or e.get("@timestamp")
        if not ts_raw:
            continue
        try:
            ts = parse_ts(str(ts_raw))
        except Exception:
            continue
        if ts < start or ts > end:
            continue
        if key and value is not None and str(e.get(key)) != str(value):
            continue
        level = str(e.get("level") or e.get("severity") or "info").lower()
        msg = str(e.get("message") or e.get("msg") or "")
        abnormal = level in ABNORMAL_LEVELS or bool(re.search(r"\b(exception|failed|timeout|error)\b", msg, re.I))
        raw_id = f"{e.get('_source')}|{ts.isoformat()}|{e.get('service','unknown')}|{msg}"
        event_id = hashlib.sha256(raw_id.encode()).hexdigest()[:16]
        corr = {k: e.get(k) for k in CORRELATION_KEYS if e.get(k) not in (None, "")}
        out.append({
            "id": event_id,
            "timestamp_utc": ts.isoformat().replace("+00:00", "Z"),
            "original_timestamp": str(ts_raw),
            "source": e.get("_source", "unknown"),
            "service": str(e.get("service") or e.get("app") or "unknown"),
            "level": level,
            "message": msg,
            "abnormal": abnormal,
            "correlation": corr,
        })
    out.sort(key=lambda x: x["timestamp_utc"])
    return out


def main():
    ap = argparse.ArgumentParser(description="Correlate redacted production log exports without production writes.")
    ap.add_argument("--input", nargs="+", required=True)
    ap.add_argument("--start", required=True, help="ISO-8601 start")
    ap.add_argument("--end", required=True, help="ISO-8601 end")
    ap.add_argument("--key")
    ap.add_argument("--value")
    ap.add_argument("--output", default="artifacts/log-correlation-evidence.json")
    args = ap.parse_args()

    try:
        start, end = parse_ts(args.start), parse_ts(args.end)
        if end <= start:
            raise ValueError("end must be after start")
        events = read_events(args.input)
        key, value = choose_key(events, args.key, args.value)
        normalized = normalize(events, key, value, start, end)
        first = next((e["id"] for e in normalized if e["abnormal"]), None)
        status = "ready" if normalized and first else "inconclusive"
        result = {
            "status": status,
            "incident": {
                "window_start_utc": start.isoformat().replace("+00:00", "Z"),
                "window_end_utc": end.isoformat().replace("+00:00", "Z"),
                "primary_key": key,
                "primary_value": value,
            },
            "events": normalized,
            "first_abnormal_event": first,
            "hypotheses": [],
            "missing_sources": [],
        }
        out = Path(args.output)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"wrote {len(normalized)} events to {out}")
        return 0 if status == "ready" else 2
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
