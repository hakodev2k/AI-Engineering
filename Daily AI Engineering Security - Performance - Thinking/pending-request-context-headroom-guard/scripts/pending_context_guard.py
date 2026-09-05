#!/usr/bin/env python3
"""Deterministic projected-next-request context admission guard."""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path


def positive_int(name: str, value: object, allow_zero: bool = False) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise ValueError(f"{name} must be an integer")
    minimum = 0 if allow_zero else 1
    if value < minimum:
        raise ValueError(f"{name} must be >= {minimum}")
    return value


def load_config(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"config not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError("config must be a JSON object")
    window = positive_int("context_window", data.get("context_window"))
    reserve = positive_int("reserved_output_tokens", data.get("reserved_output_tokens", 0), True)
    margin = positive_int("uncertainty_margin_tokens", data.get("uncertainty_margin_tokens", 0), True)
    threshold = data.get("compact_at_utilization", 0.85)
    if isinstance(threshold, bool) or not isinstance(threshold, (int, float)) or not (0 < threshold < 1):
        raise ValueError("compact_at_utilization must be between 0 and 1")
    if reserve + margin >= window:
        raise ValueError("reserves must be smaller than context_window")
    return {"context_window": window, "reserved_output_tokens": reserve,
            "uncertainty_margin_tokens": margin, "compact_at_utilization": float(threshold)}


def decide(cfg: dict, history: int, pending: int, tool: int) -> dict:
    for name, value in (("history", history), ("pending", pending), ("tool", tool)):
        positive_int(name, value, True)
    projected_input = history + pending + tool
    hard_usable = cfg["context_window"] - cfg["reserved_output_tokens"] - cfg["uncertainty_margin_tokens"]
    compact_limit = int(hard_usable * cfg["compact_at_utilization"])
    utilization = projected_input / hard_usable
    if projected_input > hard_usable:
        decision, code = "BLOCK", 4
    elif projected_input >= compact_limit:
        decision, code = "COMPACT", 3
    else:
        decision, code = "SEND", 0
    return {"decision": decision, "exit_code": code, "projected_input_tokens": projected_input,
            "hard_usable_tokens": hard_usable, "compact_limit_tokens": compact_limit,
            "projected_utilization": round(utilization, 6)}


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--config", required=True)
    p.add_argument("--history", type=int, required=True)
    p.add_argument("--pending", type=int, default=0)
    p.add_argument("--tool", type=int, default=0)
    args = p.parse_args()
    try:
        result = decide(load_config(Path(args.config)), args.history, args.pending, args.tool)
    except (OSError, ValueError) as exc:
        print(json.dumps({"decision": "ERROR", "error": str(exc)}))
        return 1
    print(json.dumps(result, sort_keys=True))
    return result["exit_code"]


if __name__ == "__main__":
    sys.exit(main())
