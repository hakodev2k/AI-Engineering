#!/usr/bin/env python3
import copy
import hashlib
import json
import pathlib
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
POLICY = ROOT / "config" / "traceability-policy.json"


def canonical(obj):
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def fp(obj):
    return hashlib.sha256(canonical(obj)).hexdigest()


def run(script, *args):
    p = subprocess.run([sys.executable, str(SCRIPTS / script), *map(str, args)], text=True, capture_output=True)
    try:
        payload = json.loads(p.stdout) if p.stdout.strip() else None
    except json.JSONDecodeError:
        payload = p.stdout
    return p.returncode, payload, p.stderr


def write(path, obj):
    path.write_text(json.dumps(obj, indent=2), encoding="utf-8")


def main():
    plan = {
        "version":"1.0", "task_id":"smoke", "actor":"impl", "repository_revision":"base",
        "plan_items":[{
            "id":"p1", "intent":"change service", "acceptance_criteria":["service returns expected result"],
            "allowed_paths":["src/**", "tests/**"], "risk":"low", "risk_categories":[], "requires_approval":False
        }]
    }
    with tempfile.TemporaryDirectory() as td:
        d = pathlib.Path(td); plan_path=d/"plan.json"; manifest_path=d/"manifest.json"; validation_path=d/"validation.json"; review_path=d/"review.json"
        write(plan_path, plan)
        manifest = {
            "version":"1.0", "task_id":"smoke", "actor":"impl", "plan_fingerprint":fp(plan),
            "base_revision":"base", "head_revision":"head",
            "changes":[{
                "path":"src/Service.cs", "status":"modified", "content_fingerprint":"a"*64,
                "plan_item_ids":["p1"], "acceptance_criteria":["service returns expected result"],
                "reason":"implements p1", "risk_categories":[], "approval_id":None
            }],
            "plan_item_status":[{"id":"p1", "status":"implemented", "evidence":["unit tests passed"]}]
        }
        write(manifest_path, manifest)
        rc, validation, err = run("validate-traceability.py", plan_path, manifest_path, POLICY)
        assert rc == 0 and validation["status"] == "verified", (rc, validation, err)
        write(validation_path, validation)
        rc, final, err = run("evaluate-final-gate.py", plan_path, manifest_path, validation_path)
        assert rc == 0 and final["status"] == "verified", (rc, final, err)

        unmapped = copy.deepcopy(manifest); unmapped["changes"][0]["plan_item_ids"] = []
        write(manifest_path, unmapped)
        rc, result, _ = run("validate-traceability.py", plan_path, manifest_path, POLICY)
        assert rc == 5 and any(x.startswith("unmapped-change:") for x in result["errors"]), result

        outside = copy.deepcopy(manifest); outside["changes"][0]["path"] = "infra/prod.tf"
        write(manifest_path, outside)
        rc, result, _ = run("validate-traceability.py", plan_path, manifest_path, POLICY)
        assert rc == 5 and any(x.startswith("path-outside-plan-scope:") for x in result["errors"]), result

        high = copy.deepcopy(plan); high["plan_items"][0]["risk"] = "high"
        write(plan_path, high)
        high_manifest = copy.deepcopy(manifest); high_manifest["plan_fingerprint"] = fp(high)
        write(manifest_path, high_manifest)
        rc, validation, _ = run("validate-traceability.py", plan_path, manifest_path, POLICY)
        assert rc == 0, validation
        write(validation_path, validation)
        review = {"version":"1.0", "reviewer":"impl", "actor":"impl", "plan_fingerprint":fp(high), "manifest_fingerprint":fp(high_manifest), "verdict":"approve", "findings":[]}
        write(review_path, review)
        rc, final, _ = run("evaluate-final-gate.py", plan_path, manifest_path, validation_path, review_path)
        assert rc == 5 and "high-risk-self-review" in final["reasons"], final

    print("smoke-test: passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
