#!/usr/bin/env python3
import json, subprocess, sys, tempfile, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "resource_snapshot.py"

def run(*args):
    return subprocess.run([sys.executable, str(SCRIPT), *args], capture_output=True, text=True)

def main():
    r = run("--match", "definitely-no-such-process-name-9f2d7c")
    assert r.returncode == 0, r.stderr
    data = json.loads(r.stdout)
    assert data["count"] == 0
    assert data["rss_bytes"] == 0
    assert data["processes"] == []

    r = run()
    assert r.returncode == 0, r.stderr
    data = json.loads(r.stdout)
    assert isinstance(data["count"], int) and data["count"] >= 1
    assert isinstance(data["processes"], list)
    assert all("pid" in p and "ppid" in p and "rss_bytes" in p for p in data["processes"])
    print("PASS")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
