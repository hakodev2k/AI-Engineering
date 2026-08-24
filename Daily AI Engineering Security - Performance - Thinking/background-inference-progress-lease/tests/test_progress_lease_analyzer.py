#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path
SCRIPT = Path(__file__).parents[1] / "scripts" / "progress_lease_analyzer.py"

def run(rows, *args):
    with tempfile.NamedTemporaryFile("w", delete=False, suffix=".jsonl", encoding="utf-8") as f:
        for row in rows:
            f.write(json.dumps(row) + "\n")
        name = f.name
    return subprocess.run([sys.executable, str(SCRIPT), name, *args], text=True, capture_output=True)

def rec(i, progress="1", owner="active", fp=None, tokens=100):
    return {"timestamp":i,"worker_id":"w1","owner_id":"o1","purpose":"memory","request_fingerprint":fp or f"f{i}","progress_version":progress,"input_tokens":tokens,"owner_state":owner}

def main():
    progressing = [rec(i, progress=str(i)) for i in range(1,5)]
    assert run(progressing).returncode == 0
    stalled = [rec(i, progress="1", fp="same") for i in range(1,6)]
    p = run(stalled, "--max-no-progress", "2", "--max-duplicate-fingerprint", "2")
    assert p.returncode == 2 and "no_progress" in p.stdout and "duplicate_fingerprint" in p.stdout
    terminal = [rec(1, owner="completed")]
    p = run(terminal)
    assert p.returncode == 2 and "owner_terminal" in p.stdout
    over_budget = [rec(i, progress=str(i), tokens=1000) for i in range(1,4)]
    p = run(over_budget, "--max-input-tokens", "1500")
    assert p.returncode == 2 and "token_budget" in p.stdout
    print("ok")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
