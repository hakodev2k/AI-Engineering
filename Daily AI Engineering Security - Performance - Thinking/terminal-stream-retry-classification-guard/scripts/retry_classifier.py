#!/usr/bin/env python3
"""Classify model/transport outcomes into bounded retry actions."""
from __future__ import annotations
import argparse, json, sys
from dataclasses import dataclass, asdict

TERMINAL_STOP = {"response.completed", "response.incomplete", "cancelled", "invalid_request", "auth_error"}
TRANSIENT = {"transport_timeout", "connection_reset", "http_502", "http_503", "http_504", "rate_limited"}

@dataclass
class Decision:
    action: str
    reason: str
    delay_seconds: float
    next_attempt: int
    cumulative_wait_seconds: float


def classify(event: str, attempt: int, cumulative_wait: float, *, max_attempts: int = 3,
             max_wait: float = 45.0, retry_after: float | None = None,
             transport: str = "websocket") -> Decision:
    event = event.strip().lower()
    if attempt < 1:
        raise ValueError("attempt must be >= 1")
    if cumulative_wait < 0 or max_wait < 0 or max_attempts < 1:
        raise ValueError("invalid retry budget")
    if event in TERMINAL_STOP:
        return Decision("STOP", f"terminal:{event}", 0.0, attempt, cumulative_wait)
    if event not in TRANSIENT:
        return Decision("STOP", f"unknown-nonretryable:{event}", 0.0, attempt, cumulative_wait)
    if attempt >= max_attempts:
        if transport == "websocket" and event in {"transport_timeout", "connection_reset"}:
            return Decision("FALLBACK", "transport-attempt-budget-exhausted", 0.0, attempt, cumulative_wait)
        return Decision("STOP", "attempt-budget-exhausted", 0.0, attempt, cumulative_wait)
    if event == "rate_limited" and retry_after is not None:
        delay = max(0.0, min(float(retry_after), 30.0))
    else:
        delay = min(2 ** (attempt - 1), 10.0)
    if cumulative_wait + delay > max_wait:
        if transport == "websocket" and event in {"transport_timeout", "connection_reset"}:
            return Decision("FALLBACK", "wait-budget-exhausted", 0.0, attempt, cumulative_wait)
        return Decision("STOP", "wait-budget-exhausted", 0.0, attempt, cumulative_wait)
    return Decision("RETRY", f"transient:{event}", delay, attempt + 1, cumulative_wait + delay)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("event")
    ap.add_argument("--attempt", type=int, default=1)
    ap.add_argument("--cumulative-wait", type=float, default=0.0)
    ap.add_argument("--max-attempts", type=int, default=3)
    ap.add_argument("--max-wait", type=float, default=45.0)
    ap.add_argument("--retry-after", type=float)
    ap.add_argument("--transport", choices=["websocket", "https"], default="websocket")
    args = ap.parse_args()
    try:
        d = classify(args.event, args.attempt, args.cumulative_wait, max_attempts=args.max_attempts,
                     max_wait=args.max_wait, retry_after=args.retry_after, transport=args.transport)
    except ValueError as exc:
        print(json.dumps({"action":"ERROR","error":str(exc)}))
        return 2
    print(json.dumps(asdict(d), indent=2, sort_keys=True))
    return 0 if d.action in {"STOP","FALLBACK"} else 10

if __name__ == "__main__":
    sys.exit(main())
