#!/usr/bin/env python3
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "coordination_gate.py"
CONFIG = ROOT / "config" / "policy.json"


def run(events: list[dict]) -> subprocess.CompletedProcess[str]:
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".jsonl", delete=False) as f:
        for event in events:
            f.write(json.dumps(event) + "\n")
        path = Path(f.name)
    try:
        return subprocess.run(
            [sys.executable, str(SCRIPT), "--config", str(CONFIG), "--input", str(path)],
            text=True,
            capture_output=True,
            check=False,
        )
    finally:
        path.unlink(missing_ok=True)


def event(destination: str, *, agent: str = "a1", shared: bool = True, write: bool = True, approved: bool = False) -> dict:
    return {
        "timestamp": "2026-09-06T09:00:00Z",
        "agent_id": agent,
        "run_id": "run-1",
        "operation": "write" if write else "read",
        "destination": destination,
        "shared_mutable": shared,
        "purpose": "evaluation-artifact",
        "human_approved": approved,
    }


def main() -> int:
    cases = []
    cases.append(("approved channel allows declared write", run([event("https://internal.example.invalid/agent-coordination/run-1")]).returncode == 0))
    cases.append(("unknown shared write blocks", run([event("https://public.example.invalid/wiki/page")]).returncode == 2))
    cases.append(("unknown shared write with human approval allows", run([event("https://public.example.invalid/wiki/page", approved=True)]).returncode == 0))
    cases.append(("read-only observation does not create shared state", run([event("https://public.example.invalid/wiki/page", write=False)]).returncode == 0))

    many = [event("https://internal.example.invalid/agent-coordination/run-1", agent=f"a{i}") for i in range(6)]
    cases.append(("cross-agent convergence blocks", run(many).returncode == 2))

    failed = [name for name, ok in cases if not ok]
    for name, ok in cases:
        print(("PASS" if ok else "FAIL") + " - " + name)
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
