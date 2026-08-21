#!/usr/bin/env python3
"""Minimal instrumentation pattern for benchmark_startup.py.

Integrate equivalent calls in the real client; this file is runnable and only
illustrates the event contract, not an MCP implementation.
"""

import json
import sys
import time
from dataclasses import dataclass, field

PREFIX = "MCP_STARTUP_EVENT "


@dataclass
class StartupClock:
    started: float = field(default_factory=time.monotonic)

    def emit(self, event: str, **fields):
        payload = {
            "event": event,
            "elapsed_ms": round((time.monotonic() - self.started) * 1000.0, 3),
            **fields,
        }
        print(PREFIX + json.dumps(payload, sort_keys=True), flush=True)


def main() -> int:
    clock = StartupClock()
    clock.emit("process_start")

    # Core application initialization. Replace with actual initialization.
    time.sleep(0.02)
    clock.emit("core_ready")
    clock.emit("first_prompt_accepted")

    # Optional background MCP initialization happens after core readiness.
    clock.emit("initializer_count", count=1, server="example-background")
    time.sleep(0.03)
    clock.emit("mcp_ready", server="example-background")
    clock.emit("initializer_count", count=0, server="example-background")
    clock.emit("fully_ready")

    # A real benchmark that exercises a first turn should emit this only after
    # receiving the first useful agent result.
    clock.emit("first_useful_turn")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
