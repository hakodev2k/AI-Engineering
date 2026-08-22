#!/usr/bin/env python3
import argparse, hashlib, json, pathlib, sys

REQUIRED = ["handoff_id","producer","consumer","task","status","risk","facts","hypotheses","decisions","evidence","open_questions","artifacts","verification"]
VALID_STATUS = {"ready","blocked","failed","verified"}
VALID_VERIFICATION = {"not-run","passed","failed","blocked"}
HIGH_RISK = {"production","security","database","infrastructure","secrets","breaking-api"}

def sha256_file(path: pathlib.Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def fail(errors):
    for e in errors:
        print(f"ERROR: {e}", file=sys.stderr)
    return 2

def validate(data, root: pathlib.Path, verify_files: bool, independent_verifier: str | None):
    errors = []
    for key in REQUIRED:
        if key not in data:
            errors.append(f"missing required field: {key}")
    if errors:
        return errors
    if data["status"] not in VALID_STATUS:
        errors.append(f"invalid status: {data['status']}")
    if not isinstance(data["facts"], list) or not isinstance(data["hypotheses"], list):
        errors.append("facts and hypotheses must be arrays")
    evidence_ids = {e.get("id") for e in data.get("evidence", []) if isinstance(e, dict)}
    for i, fact in enumerate(data.get("facts", [])):
        refs = fact.get("evidence_ids", []) if isinstance(fact, dict) else []
        if data["status"] in {"ready","verified"} and not refs:
            errors.append(f"fact[{i}] has no evidence_ids for {data['status']} handoff")
        for ref in refs:
            if ref not in evidence_ids:
                errors.append(f"fact[{i}] references unknown evidence id: {ref}")
    unsupported = 0
    for hyp in data.get("hypotheses", []):
        if isinstance(hyp, dict) and not hyp.get("evidence_ids"):
            unsupported += 1
    if unsupported > 3:
        errors.append(f"unsupported hypotheses exceed limit: {unsupported} > 3")
    verification = data.get("verification", {})
    vstatus = verification.get("status")
    if vstatus not in VALID_VERIFICATION:
        errors.append(f"invalid verification.status: {vstatus}")
    if data["status"] == "verified" and vstatus != "passed":
        errors.append("status=verified requires verification.status=passed")
    if data["status"] == "ready" and not data.get("evidence"):
        errors.append("status=ready requires at least one evidence item")
    risk = set(data.get("risk", []))
    if risk & HIGH_RISK and data["status"] == "verified":
        producer = data.get("producer")
        verifier = independent_verifier or verification.get("verifier")
        if not verifier or verifier == producer:
            errors.append("high-risk verified handoff requires an independent verifier")
    for i, artifact in enumerate(data.get("artifacts", [])):
        if not isinstance(artifact, dict):
            errors.append(f"artifact[{i}] must be an object")
            continue
        path = artifact.get("path", "")
        digest = artifact.get("sha256", "")
        if len(digest) != 64:
            errors.append(f"artifact[{i}] sha256 must be 64 hex characters")
            continue
        if verify_files and path.startswith("file:"):
            local = root / path[5:]
            if not local.is_file():
                errors.append(f"artifact[{i}] file not found: {local}")
            elif sha256_file(local).lower() != digest.lower():
                errors.append(f"artifact[{i}] digest mismatch: {local}")
    return errors

def main():
    p = argparse.ArgumentParser(description="Validate cross-agent handoff integrity without mutating repository state.")
    p.add_argument("handoff", help="handoff JSON file")
    p.add_argument("--root", default=".", help="repository root for file: artifact verification")
    p.add_argument("--verify-files", action="store_true")
    p.add_argument("--independent-verifier")
    args = p.parse_args()
    path = pathlib.Path(args.handoff)
    if not path.is_file():
        return fail([f"handoff not found: {path}"])
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        return fail([f"invalid JSON: {exc}"])
    errors = validate(data, pathlib.Path(args.root), args.verify_files, args.independent_verifier)
    if errors:
        return fail(errors)
    print(json.dumps({"status":"passed","handoff_id":data["handoff_id"],"producer":data["producer"],"consumer":data["consumer"],"verification":data["verification"]["status"]}, indent=2))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
