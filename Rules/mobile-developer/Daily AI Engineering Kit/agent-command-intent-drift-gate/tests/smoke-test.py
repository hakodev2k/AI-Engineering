#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PY = sys.executable
POLICY = ROOT / "config" / "intent-policy.json"
EVAL = ROOT / "scripts" / "evaluate-command-drift.py"
GATE = ROOT / "scripts" / "verify-final-gate.py"


def write(path, value):
    path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


def run(*args):
    return subprocess.run([PY, *map(str, args)], text=True, capture_output=True)


def decision(tmp, intent, execution):
    ip = tmp / "intent.json"; ep = tmp / "execution.json"; dp = tmp / "decision.json"
    write(ip, intent); write(ep, execution)
    result = run(EVAL, "--intent", ip, "--execution", ep, "--policy", POLICY, "--output", dp)
    return result, ip, ep, dp


def base_intent(risk="medium", approval_action=None):
    return {
        "version":"1.0","intent_id":"intent-1","actor_id":"implementer",
        "created_at_utc":"2026-08-17T15:00:00Z","executable":"dotnet",
        "arguments":["test","App.sln","--configuration","Release"],
        "target":"App.sln","environment":"staging","side_effect":"read-only",
        "risk":risk,"approval_action":approval_action,"constraints":[]
    }


def execution_from(intent):
    return {
        "version":"1.0","intent_id":intent["intent_id"],"requested_at_utc":"2026-08-17T15:01:00Z",
        "executable":intent["executable"],"arguments":list(intent["arguments"]),
        "target":intent["target"],"environment":intent["environment"],"side_effect":intent["side_effect"]
    }


def main():
    with tempfile.TemporaryDirectory() as d:
        tmp = Path(d)

        # Exact match passes and final gate verifies without review at medium risk.
        intent = base_intent(); execution = execution_from(intent)
        r, ip, ep, dp = decision(tmp, intent, execution)
        assert r.returncode == 0, r.stderr + r.stdout
        gate = run(GATE, "--intent", ip, "--execution", ep, "--decision", dp, "--policy", POLICY, "--actor", "implementer")
        assert gate.returncode == 0 and '"status": "verified"' in gate.stdout, gate.stdout

        # Added argument is deterministic blocking drift.
        execution2 = execution_from(intent); execution2["arguments"].append("--no-restore")
        r, *_ = decision(tmp, intent, execution2)
        assert r.returncode == 2 and '"status": "blocked"' in r.stdout, r.stdout

        # Target drift is blocked.
        execution3 = execution_from(intent); execution3["target"] = "Other.sln"
        r, *_ = decision(tmp, intent, execution3)
        assert r.returncode == 2, r.stdout

        # Argument reordering without addition/removal requires review rather than passing silently.
        execution4 = execution_from(intent); execution4["arguments"] = ["test","App.sln","Release","--configuration"]
        r, *_ = decision(tmp, intent, execution4)
        assert r.returncode == 3 and '"status": "review-required"' in r.stdout, r.stdout

        # High-risk self review is rejected.
        high = base_intent(risk="high"); high_exec = execution_from(high)
        r, ip, ep, dp = decision(tmp, high, high_exec); assert r.returncode == 0
        decision_data = json.loads(dp.read_text(encoding="utf-8"))
        review = {
            "version":"1.0","status":"approved","reviewer_id":"implementer","reviewer_type":"agent",
            "reviewed_at_utc":"2026-08-17T15:02:00Z","intent_fingerprint":decision_data["intent_fingerprint"],
            "approval_action":None,"findings":[]
        }
        rp = tmp / "review.json"; write(rp, review)
        gate = run(GATE, "--intent", ip, "--execution", ep, "--decision", dp, "--policy", POLICY, "--review", rp, "--actor", "implementer")
        assert gate.returncode == 2 and "self-review-forbidden" in gate.stdout, gate.stdout

        # Dangerous action requires a human approval bound to the exact action.
        dangerous = base_intent(risk="critical", approval_action="production-deployment")
        dangerous["side_effect"] = "remote-write"
        dangerous_exec = execution_from(dangerous)
        r, ip, ep, dp = decision(tmp, dangerous, dangerous_exec); assert r.returncode == 0
        dd = json.loads(dp.read_text(encoding="utf-8"))
        agent_review = {
            "version":"1.0","status":"approved","reviewer_id":"verifier","reviewer_type":"agent",
            "reviewed_at_utc":"2026-08-17T15:03:00Z","intent_fingerprint":dd["intent_fingerprint"],
            "approval_action":"production-deployment","findings":[]
        }
        rp = tmp / "agent-review.json"; write(rp, agent_review)
        gate = run(GATE, "--intent", ip, "--execution", ep, "--decision", dp, "--policy", POLICY, "--review", rp, "--actor", "implementer")
        assert gate.returncode == 2 and "human-approval-required" in gate.stdout, gate.stdout
        human_review = dict(agent_review, reviewer_id="human-owner", reviewer_type="human")
        rp2 = tmp / "human-review.json"; write(rp2, human_review)
        gate = run(GATE, "--intent", ip, "--execution", ep, "--decision", dp, "--policy", POLICY, "--review", rp2, "--actor", "implementer")
        assert gate.returncode == 0 and '"status": "verified"' in gate.stdout, gate.stdout

    print("smoke-test: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
