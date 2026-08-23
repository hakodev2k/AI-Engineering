#!/usr/bin/env python3
import json
import subprocess
import sys
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "observation_budget.py"


def main():
    events = [
        {"type": "dom", "page": "a", "content": "x" * 1000},
        {"type": "dom", "page": "a", "content": "x" * 1000},
        {"type": "screenshot", "page": "a", "content": "y" * 6000},
        {"type": "dom", "page": "b", "content": "z" * 6000, "required_full": True},
    ]
    payload = "\n".join(json.dumps(x) for x in events) + "\n"
    p = subprocess.run(
        [sys.executable, str(SCRIPT), "--event-byte-budget", "5000", "--task-byte-budget", "10000"],
        input=payload, text=True, capture_output=True,
    )
    assert p.returncode == 0, p.stderr
    report = json.loads(p.stdout)
    rows = report["events"]
    assert rows[0]["decision"] == "admit"
    assert rows[1]["decision"] == "reuse" and rows[1]["duplicate"] is True
    assert rows[2]["decision"] == "target_or_delta"
    assert rows[3]["decision"] == "admit" and rows[3]["required_full"] is True
    assert report["summary"]["estimated_byte_savings"] >= 7000
    print("browser observation budget regression passed")


if __name__ == "__main__":
    main()
