#!/usr/bin/env python3
import json
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POLICY = ROOT / "config" / "test-data-safety-policy.json"
VALIDATOR = ROOT / "scripts" / "validate-safety-manifest.py"
GATE = ROOT / "scripts" / "evaluate-isolation-gate.py"
TEMPLATE = ROOT / "templates" / "safety-manifest.example.json"
REVIEW = ROOT / "examples" / "isolation-review.example.json"


def run(*args):
    return subprocess.run(args, capture_output=True, text=True)


def main():
    good = run("python", str(VALIDATOR), "--manifest", str(TEMPLATE), "--policy", str(POLICY))
    assert good.returncode == 0, good.stdout + good.stderr

    verified = run("python", str(GATE), "--manifest", str(TEMPLATE), "--review", str(REVIEW), "--policy", str(POLICY))
    assert verified.returncode == 0, verified.stdout + verified.stderr

    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        manifest = json.loads(TEMPLATE.read_text(encoding="utf-8"))
        manifest["fixture"]["provenance"] = "production-derived"
        blocked_manifest = td / "blocked.json"
        blocked_manifest.write_text(json.dumps(manifest), encoding="utf-8")
        blocked = run("python", str(VALIDATOR), "--manifest", str(blocked_manifest), "--policy", str(POLICY))
        assert blocked.returncode == 2, blocked.stdout + blocked.stderr

        review = json.loads(REVIEW.read_text(encoding="utf-8"))
        review["cross_boundary_changes"] = ["shared-user-42 changed"]
        bad_review = td / "bad-review.json"
        bad_review.write_text(json.dumps(review), encoding="utf-8")
        leakage = run("python", str(GATE), "--manifest", str(TEMPLATE), "--review", str(bad_review), "--policy", str(POLICY))
        assert leakage.returncode == 2, leakage.stdout + leakage.stderr

    print("smoke-test: PASS")


if __name__ == "__main__":
    main()
