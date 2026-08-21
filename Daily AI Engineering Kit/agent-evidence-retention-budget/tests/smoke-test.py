#!/usr/bin/env python3
import hashlib
import json
import pathlib
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
PY = sys.executable
POLICY = ROOT / "config" / "evidence-retention-policy.json"
VALIDATE = ROOT / "scripts" / "validate-evidence-bundle.py"
APPLY = ROOT / "scripts" / "apply-retention-policy.py"
GATE = ROOT / "scripts" / "evaluate-retention-gate.py"
NOW = "2026-08-17T12:00:00Z"


def sha(ch):
    return "sha256:" + ch * 64


def write(path, obj):
    path.write_text(json.dumps(obj, indent=2) + "\n", encoding="utf-8")


def run(args, expected=0):
    result = subprocess.run([PY, *map(str, args)], capture_output=True, text=True)
    if result.returncode != expected:
        raise AssertionError(f"command failed: {args}\nrc={result.returncode}\nout={result.stdout}\nerr={result.stderr}")
    return result


def bundle(critical=False, secret=False, stale=False):
    importance = "critical" if critical else "high"
    sensitivity = "secret" if secret else "internal"
    observed = "2026-08-17T06:00:00Z" if stale else "2026-08-17T11:50:00Z"
    return {
        "bundle_id": "smoke-bundle",
        "task_id": "smoke-task",
        "created_at": NOW,
        "repository_revision": "a" * 40,
        "claims": [
            {"id": "claim:verified", "status": "verified", "required_evidence_ids": ["ev:verification"]}
        ],
        "evidence": [
            {
                "id": "ev:verification",
                "type": "verification",
                "source": "ci/run/1",
                "observed_at": observed,
                "content_hash": sha("a"),
                "storage_ref": "artifact://ci/run/1/output.txt",
                "context_cost_bytes": 8000,
                "importance": importance,
                "sensitivity": sensitivity,
                "required_for": ["claim:verified"],
                "summary": "Traceable verification summary."
            },
            {
                "id": "ev:low-log",
                "type": "log",
                "source": "ci/run/1/log",
                "observed_at": "2026-08-17T11:49:00Z",
                "content_hash": sha("b"),
                "storage_ref": "artifact://ci/run/1/log.txt",
                "context_cost_bytes": 50000,
                "importance": "low",
                "sensitivity": "internal",
                "required_for": [],
                "summary": "Large non-mandatory log."
            }
        ]
    }


def pipeline(tmp, data, expected_apply=0):
    b = tmp / "bundle.json"
    v = tmp / "validation.json"
    r = tmp / "retention.json"
    write(b, data)
    run([VALIDATE, "--bundle", b, "--policy", POLICY, "--output", v])
    run([APPLY, "--bundle", b, "--validation", v, "--policy", POLICY, "--output", r, "--now", NOW], expected_apply)
    return b, v, r


def main():
    with tempfile.TemporaryDirectory() as td:
        tmp = pathlib.Path(td)

        # 1. Normal high-priority evidence stays in budget; oversized low log is reference-only.
        b, v, r = pipeline(tmp, bundle())
        retention = json.loads(r.read_text(encoding="utf-8"))
        assert retention["status"] == "verified"
        assert retention["estimated_context_bytes"] <= retention["context_budget_bytes"]
        modes = {x["evidence_id"]: x["mode"] for x in retention["decisions"]}
        assert modes["ev:verification"] in {"keep-full", "keep-summary", "reference-only"}
        assert modes["ev:low-log"] in {"reference-only", "exclude-context"}
        out = tmp / "gate.json"
        run([GATE, "--bundle", b, "--validation", v, "--retention", r, "--policy", POLICY,
             "--implementation-owner", "implementation-agent", "--output", out])
        assert json.loads(out.read_text(encoding="utf-8"))["status"] == "verified"

        # 2. Secret evidence is never embedded even when mandatory.
        b2, v2, r2 = pipeline(tmp, bundle(secret=True))
        retention2 = json.loads(r2.read_text(encoding="utf-8"))
        secret_decision = next(x for x in retention2["decisions"] if x["evidence_id"] == "ev:verification")
        assert secret_decision["mode"] == "reference-only"
        assert secret_decision["reason"] == "sensitivity-policy"

        # 3. Stale mandatory evidence blocks budgeting instead of silently passing.
        _, _, stale_retention = pipeline(tmp, bundle(stale=True), expected_apply=1)
        assert json.loads(stale_retention.read_text(encoding="utf-8"))["status"] == "blocked"

        # 4. Critical evidence requires independent fingerprint-bound review; self-review is rejected.
        b4, v4, r4 = pipeline(tmp, bundle(critical=True))
        retention4 = json.loads(r4.read_text(encoding="utf-8"))
        validation4 = json.loads(v4.read_text(encoding="utf-8"))
        review = tmp / "review.json"
        write(review, {
            "status": "approved",
            "reviewer": "implementation-agent",
            "reviewed_at": NOW,
            "bundle_fingerprint": validation4["bundle_fingerprint"],
            "retention_fingerprint": retention4["retention_fingerprint"],
            "findings": []
        })
        out4 = tmp / "gate-critical.json"
        run([GATE, "--bundle", b4, "--validation", v4, "--retention", r4, "--policy", POLICY,
             "--implementation-owner", "implementation-agent", "--review", review, "--output", out4], expected=1)
        assert "self-review-not-allowed" in json.loads(out4.read_text(encoding="utf-8"))["reasons"]

    print("smoke-test: PASS")
    return 0

if __name__ == "__main__":
    sys.exit(main())
