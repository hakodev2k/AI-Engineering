#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CAPTURE = ROOT / "scripts" / "capture-branch-baseline.py"
VALIDATE = ROOT / "scripts" / "validate-replan-record.py"
DRIFT = ROOT / "scripts" / "evaluate-branch-drift.py"
GATE = ROOT / "scripts" / "evaluate-replan-gate.py"
POLICY = ROOT / "config" / "drift-policy.json"


def run(args, cwd=None, ok=(0,)):
    p = subprocess.run(args, cwd=cwd, text=True, capture_output=True)
    if p.returncode not in ok:
        raise AssertionError(f"command failed {args}\nrc={p.returncode}\nout={p.stdout}\nerr={p.stderr}")
    return p


def git(repo, *args):
    return run(["git", "-C", str(repo), *args]).stdout.strip()


def write_json(path, value):
    path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


def main():
    with tempfile.TemporaryDirectory() as td:
        repo = Path(td) / "repo"
        repo.mkdir()
        git(repo, "init")
        git(repo, "config", "user.email", "test@example.com")
        git(repo, "config", "user.name", "Test")
        (repo / "src/orders").mkdir(parents=True)
        (repo / "tests/orders").mkdir(parents=True)
        (repo / "src/orders/order-service.cs").write_text("class OrderService {}\n", encoding="utf-8")
        (repo / "tests/orders/order-tests.cs").write_text("class OrderTests {}\n", encoding="utf-8")
        git(repo, "add", ".")
        git(repo, "commit", "-m", "base")
        default_branch = git(repo, "branch", "--show-current")
        git(repo, "checkout", "-b", "feature")
        (repo / "src/orders/order-service.cs").write_text("class OrderService { int X = 1; }\n", encoding="utf-8")
        git(repo, "add", ".")
        git(repo, "commit", "-m", "feature")

        plan = Path(td) / "plan.json"
        baseline = Path(td) / "baseline.json"
        drift = Path(td) / "drift.json"
        gate = Path(td) / "gate.json"
        write_json(plan, {
            "plan_id": "p1", "plan_revision": 1,
            "planned_scope": {"paths": ["src/orders/**"], "components": ["orders"]},
            "assumptions": [{"id": "a1", "statement": "orders baseline current", "status": "current", "evidence": ["src/orders/order-service.cs"]}],
            "steps": [{"id": "s1", "summary": "edit orders", "disposition": "unchanged", "affected_by": [], "evidence": ["src/orders/order-service.cs"]}],
            "tests": ["tests/orders/**"], "risk": "medium"
        })
        run([sys.executable, str(CAPTURE), "--repo", str(repo), "--target", default_branch, "--head", "feature", "--plan", str(plan), "--output", str(baseline)])
        run([sys.executable, str(VALIDATE), str(baseline)])
        run([sys.executable, str(DRIFT), "--repo", str(repo), "--record", str(baseline), "--policy", str(POLICY), "--output", str(drift)])
        assert json.loads(drift.read_text())["status"] == "fresh"
        run([sys.executable, str(GATE), "--record", str(baseline), "--drift", str(drift), "--policy", str(POLICY), "--output", str(gate)])
        assert json.loads(gate.read_text())["status"] == "verified"

        # Advance target branch inside planned scope: stale baseline must no longer pass.
        git(repo, "checkout", default_branch)
        (repo / "src/orders/order-controller.cs").write_text("class OrderController {}\n", encoding="utf-8")
        git(repo, "add", ".")
        git(repo, "commit", "-m", "target moved")
        git(repo, "checkout", "feature")
        run([sys.executable, str(DRIFT), "--repo", str(repo), "--record", str(baseline), "--policy", str(POLICY), "--output", str(drift)], ok=(3,))
        report = json.loads(drift.read_text())
        assert report["status"] in {"replan-required", "review-required"}
        assert "src/orders/order-controller.cs" in report["direct_overlap"]
        run([sys.executable, str(GATE), "--record", str(baseline), "--drift", str(drift), "--policy", str(POLICY), "--output", str(gate)], ok=(4,))
        assert json.loads(gate.read_text())["status"] == "blocked"

        # High-risk target movement must request independent review.
        git(repo, "checkout", default_branch)
        (repo / ".github/workflows").mkdir(parents=True)
        (repo / ".github/workflows/ci.yml").write_text("name: ci\n", encoding="utf-8")
        git(repo, "add", ".")
        git(repo, "commit", "-m", "change workflow")
        git(repo, "checkout", "feature")
        run([sys.executable, str(DRIFT), "--repo", str(repo), "--record", str(baseline), "--policy", str(POLICY), "--output", str(drift)], ok=(3,))
        report = json.loads(drift.read_text())
        assert report["status"] == "review-required"
        assert "high-risk-overlap" in report["review_reasons"]

    print("smoke test passed")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
