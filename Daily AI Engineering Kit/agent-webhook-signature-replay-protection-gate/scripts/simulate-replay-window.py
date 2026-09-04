#!/usr/bin/env python3
import argparse
import hashlib
import hmac
import json


def in_window(timestamp: int, now: int, window: int) -> bool:
    return abs(now - timestamp) <= window


def replay_key(event_id: str, signature: str) -> str:
    material = f"{event_id}\n{signature}".encode("utf-8")
    return hashlib.sha256(material).hexdigest()


def constant_time_equal(a: str, b: str) -> bool:
    return hmac.compare_digest(a.encode("utf-8"), b.encode("utf-8"))


def main():
    ap = argparse.ArgumentParser(description="Simulate freshness and stable replay-key behavior without external state.")
    ap.add_argument("--timestamp", required=True, type=int)
    ap.add_argument("--now", required=True, type=int)
    ap.add_argument("--window-seconds", required=True, type=int)
    ap.add_argument("--event-id", default="fixture-event")
    ap.add_argument("--signature", default="fixture-signature")
    args = ap.parse_args()
    if args.window_seconds < 0:
        raise SystemExit("window-seconds must be non-negative")
    key1 = replay_key(args.event_id, args.signature)
    key2 = replay_key(args.event_id, args.signature)
    result = {
        "fresh": in_window(args.timestamp, args.now, args.window_seconds),
        "age_seconds": abs(args.now - args.timestamp),
        "replay_key": key1,
        "replay_key_stable": constant_time_equal(key1, key2)
    }
    print(json.dumps(result, indent=2))
    raise SystemExit(0 if result["fresh"] and result["replay_key_stable"] else 2)


if __name__ == "__main__":
    main()
