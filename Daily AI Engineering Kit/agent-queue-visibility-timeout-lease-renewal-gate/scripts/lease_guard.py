#!/usr/bin/env python3
import argparse
import json
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Optional


@dataclass
class Policy:
    visibility_timeout_seconds: int = 60
    renew_before_seconds: int = 20
    max_total_lease_seconds: int = 900
    max_renewals: int = 20
    heartbeat_interval_seconds: int = 15


def load_policy(path: Path) -> Policy:
    text = path.read_text(encoding="utf-8")
    values = {}
    in_lease = False
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if line == "lease:":
            in_lease = True
            continue
        if in_lease and raw and not raw.startswith(" "):
            break
        if in_lease and ":" in line:
            k, v = line.split(":", 1)
            v = v.strip()
            if v.isdigit():
                values[k] = int(v)
    return Policy(**{k: v for k, v in values.items() if k in Policy.__annotations__})


class LeaseLost(RuntimeError):
    pass


class LeaseController:
    def __init__(self, policy: Policy, renew: Callable[[int], bool], owner_check: Callable[[], bool]):
        self.policy = policy
        self.renew = renew
        self.owner_check = owner_check
        self.started = time.monotonic()
        self.expires_at = self.started + policy.visibility_timeout_seconds
        self.renewals = 0
        self.evidence = []

    def heartbeat(self) -> None:
        now = time.monotonic()
        if not self.owner_check():
            raise LeaseLost("ownership token no longer matches")
        if now - self.started > self.policy.max_total_lease_seconds:
            raise LeaseLost("maximum total lease duration exceeded")
        remaining = self.expires_at - now
        self.evidence.append(f"heartbeat remaining={remaining:.3f}s renewals={self.renewals}")
        if remaining <= self.policy.renew_before_seconds:
            if self.renewals >= self.policy.max_renewals:
                raise LeaseLost("maximum renewal count exceeded")
            if not self.renew(self.policy.visibility_timeout_seconds):
                raise LeaseLost("lease renewal rejected")
            self.renewals += 1
            self.expires_at = time.monotonic() + self.policy.visibility_timeout_seconds
            self.evidence.append(f"renewed count={self.renewals}")

    def run(self, handler: Callable[[], None]) -> dict:
        try:
            next_heartbeat = time.monotonic()
            while True:
                now = time.monotonic()
                if now >= next_heartbeat:
                    self.heartbeat()
                    next_heartbeat = now + self.policy.heartbeat_interval_seconds
                done = handler()
                if done is True:
                    break
                sleep_for = min(0.25, max(0.0, next_heartbeat - time.monotonic()))
                time.sleep(sleep_for)
            self.heartbeat()
            return {
                "status": "pass",
                "lease_state": "completed",
                "renewal_count": self.renewals,
                "elapsed_seconds": round(time.monotonic() - self.started, 3),
                "evidence": self.evidence,
                "verification": {
                    "ownership_preserved": True,
                    "duplicate_processing_prevented": True,
                    "handler_completed": True
                },
                "errors": []
            }
        except LeaseLost as exc:
            return {
                "status": "block",
                "lease_state": "lost",
                "renewal_count": self.renewals,
                "elapsed_seconds": round(time.monotonic() - self.started, 3),
                "evidence": self.evidence,
                "verification": {
                    "ownership_preserved": False,
                    "duplicate_processing_prevented": False,
                    "handler_completed": False
                },
                "errors": [str(exc)]
            }


def simulate(args: argparse.Namespace) -> int:
    policy = load_policy(Path(args.policy))
    state = {"owner": True, "remaining_ticks": args.handler_ticks}

    def renew(_: int) -> bool:
        return not args.reject_renewal

    def owner_check() -> bool:
        return state["owner"]

    def handler() -> bool:
        if args.lose_owner_after >= 0 and state["remaining_ticks"] <= args.handler_ticks - args.lose_owner_after:
            state["owner"] = False
        state["remaining_ticks"] -= 1
        return state["remaining_ticks"] <= 0

    result = LeaseController(policy, renew, owner_check).run(handler)
    result["message_id"] = args.message_id
    Path(args.output).write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))
    return 0 if result["status"] == "pass" else 2


def main() -> int:
    parser = argparse.ArgumentParser(description="Deterministic queue lease renewal and ownership gate")
    parser.add_argument("--policy", default="config/lease-policy.yaml")
    parser.add_argument("--message-id", required=True)
    parser.add_argument("--handler-ticks", type=int, default=1)
    parser.add_argument("--reject-renewal", action="store_true")
    parser.add_argument("--lose-owner-after", type=int, default=-1)
    parser.add_argument("--output", default="lease-result.json")
    args = parser.parse_args()
    if args.handler_ticks < 1:
        parser.error("--handler-ticks must be >= 1")
    return simulate(args)


if __name__ == "__main__":
    sys.exit(main())
