#!/usr/bin/env python3
"""Analyze MCP OAuth client events and recommend bounded provider-aware recovery.

Each JSONL event requires: server, event. Supported events:
connect_failure, timeout, lock_error, provider_recreated, success.
Optional: timestamp, latency_ms, error, provider_generation.
"""
from __future__ import annotations
import argparse, json, sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any

EVENTS = {"connect_failure", "timeout", "lock_error", "provider_recreated", "success"}

@dataclass
class ServerState:
    provider_generation: int = 0
    consecutive_failures: int = 0
    consecutive_timeouts: int = 0
    transport_retries: int = 0
    provider_recreations: int = 0
    circuit_open: bool = False
    last_action: str = "observe"
    successes: int = 0
    failures: int = 0
    total_latency_ms: float = 0.0
    latency_samples: int = 0

    @property
    def mean_latency_ms(self):
        return round(self.total_latency_ms / self.latency_samples, 3) if self.latency_samples else None

def load_policy(path: Path) -> dict[str, Any]:
    try: data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc: raise ValueError(f"cannot load policy: {exc}") from exc
    for key in ("max_transport_retries", "max_provider_recreations", "poison_timeout_threshold"):
        if not isinstance(data.get(key), int) or data[key] < 0: raise ValueError(f"invalid {key}")
    if not isinstance(data.get("lock_error_markers", []), list): raise ValueError("lock_error_markers must be a list")
    return data

def is_lock_poison(event: dict[str, Any], policy: dict[str, Any]) -> bool:
    if event.get("event") == "lock_error": return True
    error = str(event.get("error", "")).lower()
    return any(str(marker).lower() in error for marker in policy.get("lock_error_markers", []))

def process_event(state: ServerState, event: dict[str, Any], policy: dict[str, Any]) -> str:
    kind = event.get("event")
    if kind not in EVENTS: raise ValueError(f"unsupported event: {kind}")
    latency = event.get("latency_ms")
    if latency is not None:
        if not isinstance(latency, (int, float)) or latency < 0: raise ValueError("latency_ms must be non-negative")
        state.total_latency_ms += float(latency); state.latency_samples += 1
    if kind == "success":
        state.successes += 1; state.consecutive_failures = 0; state.consecutive_timeouts = 0; state.transport_retries = 0; state.circuit_open = False; state.last_action = "healthy"; return state.last_action
    if kind == "provider_recreated":
        state.provider_recreations += 1; state.provider_generation += 1; state.consecutive_failures = 0; state.consecutive_timeouts = 0; state.transport_retries = 0; state.circuit_open = False; state.last_action = "retry_transport"; return state.last_action
    state.failures += 1; state.consecutive_failures += 1
    if kind == "timeout": state.consecutive_timeouts += 1
    poisoned = is_lock_poison(event, policy) or state.consecutive_timeouts >= policy["poison_timeout_threshold"]
    if poisoned:
        if state.provider_recreations < policy["max_provider_recreations"]:
            state.last_action = "recreate_provider"; return state.last_action
        state.circuit_open = True; state.last_action = "open_circuit"; return state.last_action
    if state.transport_retries < policy["max_transport_retries"]:
        state.transport_retries += 1; state.last_action = "retry_transport"; return state.last_action
    if state.provider_recreations < policy["max_provider_recreations"]:
        state.last_action = "recreate_provider"; return state.last_action
    state.circuit_open = True; state.last_action = "open_circuit"; return state.last_action

def analyze(events: list[dict[str, Any]], policy: dict[str, Any]) -> dict[str, Any]:
    states: dict[str, ServerState] = {}; timeline = []
    for index, event in enumerate(events):
        if not isinstance(event, dict) or not isinstance(event.get("server"), str) or not event["server"]:
            raise ValueError(f"event {index} requires non-empty server")
        server = event["server"]; state = states.setdefault(server, ServerState())
        action = process_event(state, event, policy)
        timeline.append({"index": index, "server": server, "event": event.get("event"), "action": action, "provider_generation": state.provider_generation})
    return {"servers": {name: {**asdict(state), "mean_latency_ms": state.mean_latency_ms} for name, state in states.items()}, "timeline": timeline}

def read_jsonl(path: Path) -> list[dict[str, Any]]:
    events = []
    try:
        for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            if not line.strip(): continue
            value = json.loads(line)
            if not isinstance(value, dict): raise ValueError(f"line {number} must be object")
            events.append(value)
    except (OSError, json.JSONDecodeError) as exc: raise ValueError(f"cannot read trace: {exc}") from exc
    return events

def main() -> int:
    p = argparse.ArgumentParser(); p.add_argument("trace", type=Path); p.add_argument("--policy", type=Path, required=True); p.add_argument("--output", type=Path); args = p.parse_args()
    try: result = analyze(read_jsonl(args.trace), load_policy(args.policy))
    except ValueError as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr); return 4
    encoded = json.dumps(result, indent=2, sort_keys=True)
    if args.output:
        try: args.output.write_text(encoded + "\n", encoding="utf-8")
        except OSError as exc:
            print(json.dumps({"error": f"cannot write output: {exc}"}), file=sys.stderr); return 4
    else: print(encoded)
    return 2 if any(s["circuit_open"] for s in result["servers"].values()) else 0

if __name__ == "__main__": raise SystemExit(main())
