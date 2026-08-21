#!/usr/bin/env python3
import json
import pathlib
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
PY = sys.executable


def run(*args, expect=0):
    p = subprocess.run([PY, *map(str, args)], cwd=ROOT, capture_output=True, text=True)
    if p.returncode != expect:
        print(p.stdout)
        print(p.stderr, file=sys.stderr)
        raise SystemExit(f"expected exit {expect}, got {p.returncode}: {' '.join(map(str,args))}")
    return p


def main():
    with tempfile.TemporaryDirectory() as td:
        td = pathlib.Path(td)
        diff = td / "diff.json"
        run("scripts/compare-contracts.py", "--baseline", "examples/baseline-contract.json", "--candidate", "examples/candidate-contract.json", "--output", diff)
        data = json.loads(diff.read_text())
        if data["summary"]["breaking_candidates"] < 1:
            raise SystemExit("expected at least one breaking candidate")

        review_block = td / "review-block.json"
        review_block.write_text(json.dumps({
            "schema_version": 1,
            "baseline_ref": "abc1234",
            "candidate_ref": "def5678",
            "reviewer": "smoke-reviewer",
            "decision": "blocked",
            "approval_id": None,
            "changes": [
                {
                    "change_id": c["change_id"],
                    "kind": c["kind"],
                    "classification": "breaking" if c["breaking_candidate"] else "compatible",
                    "evidence": ["smoke evidence"],
                    "consumer_risk": "smoke risk",
                    "deprecation_evidence": []
                } for c in data["changes"]
            ]
        }, indent=2))
        run("scripts/evaluate-compatibility-gate.py", "--diff", diff, "--review", review_block, "--policy", "config/compatibility-policy.json", expect=1)

        review_ok = td / "review-ok.json"
        review = json.loads(review_block.read_text())
        review["decision"] = "reviewed-breaking-approved"
        review["approval_id"] = "HUMAN-APPROVAL-SMOKE"
        for item in review["changes"]:
            if item["classification"] == "breaking":
                item["classification"] = "approved-breaking"
                item["deprecation_evidence"] = ["migration path documented"]
        review_ok.write_text(json.dumps(review, indent=2))
        run("scripts/evaluate-compatibility-gate.py", "--diff", diff, "--review", review_ok, "--policy", "config/compatibility-policy.json", expect=0)

    print("SMOKE TEST PASSED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
