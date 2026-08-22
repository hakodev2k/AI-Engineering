#!/usr/bin/env python3
import argparse, fnmatch, json, sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML is required: python -m pip install pyyaml", file=sys.stderr)
    sys.exit(3)


def load_yaml(path):
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def validate(req):
    errors = []
    required = ["change_id", "flag_key", "environment", "action", "current_percentage", "target_percentage", "rollback", "security_weakening", "approval"]
    for key in required:
        if key not in req:
            errors.append(f"missing required field: {key}")
    if errors:
        return errors
    if req["action"] not in {"create", "update", "rollout", "rollback", "delete"}:
        errors.append("invalid action")
    for key in ("current_percentage", "target_percentage"):
        if not isinstance(req[key], int) or isinstance(req[key], bool) or not 0 <= req[key] <= 100:
            errors.append(f"{key} must be integer 0..100")
    if not isinstance(req["rollback"], dict) or "available" not in req["rollback"]:
        errors.append("rollback.available is required")
    if not isinstance(req["security_weakening"], bool):
        errors.append("security_weakening must be boolean")
    return errors


def approval_required(req, policy):
    protected = req["environment"].lower() in {x.lower() for x in policy.get("protected_environments", [])}
    threshold = int(policy.get("max_unapproved_percentage", 0))
    reasons = []
    if protected and req["target_percentage"] > req["current_percentage"] and req["target_percentage"] > threshold:
        reasons.append("protected exposure increase above threshold")
    rules = policy.get("require_approval_for", {})
    if rules.get("global_enable", True) and protected and req["target_percentage"] == 100 and req["current_percentage"] < 100:
        reasons.append("global enable")
    if rules.get("flag_delete", True) and req["action"] == "delete":
        reasons.append("flag delete")
    if rules.get("rollback_removal", True) and not req["rollback"].get("available", False):
        reasons.append("rollback unavailable")
    if rules.get("security_weakening", True) and req["security_weakening"]:
        reasons.append("security weakening")
    return reasons


def approval_matches(req):
    a = req.get("approval")
    if not isinstance(a, dict):
        return False
    return all([
        a.get("change_id") == req.get("change_id"),
        a.get("flag_key") == req.get("flag_key"),
        a.get("environment") == req.get("environment"),
        a.get("target_percentage") == req.get("target_percentage"),
        bool(a.get("approved_by")),
    ])


def find_flag(repo, flag_key, globs, ignored):
    hits = []
    for p in repo.rglob("*"):
        if not p.is_file():
            continue
        rel = p.relative_to(repo).as_posix()
        if any(fnmatch.fnmatch(rel, pat) for pat in ignored):
            continue
        if globs and not any(fnmatch.fnmatch(rel, pat) for pat in globs):
            continue
        try:
            if flag_key in p.read_text(encoding="utf-8", errors="ignore"):
                hits.append(rel)
        except OSError:
            pass
    return sorted(hits)


def main():
    ap = argparse.ArgumentParser(description="Validate feature-flag rollout requests against repository policy.")
    ap.add_argument("--config", required=True)
    ap.add_argument("--request", required=True)
    ap.add_argument("--repo-root", default=".")
    args = ap.parse_args()
    try:
        policy = load_yaml(args.config)
        req = load_json(args.request)
    except (OSError, ValueError, yaml.YAMLError) as e:
        print(f"ERROR: {e}", file=sys.stderr); return 2
    errors = validate(req)
    if errors:
        for e in errors: print(f"ERROR: {e}", file=sys.stderr)
        return 2
    reasons = approval_required(req, policy)
    if reasons and not approval_matches(req):
        print("BLOCKED: explicit matching approval required: " + "; ".join(reasons), file=sys.stderr)
        return 4
    repo = Path(args.repo_root).resolve()
    if not repo.is_dir():
        print("ERROR: repo root does not exist", file=sys.stderr); return 2
    hits = find_flag(repo, req["flag_key"], policy.get("flag_file_globs", []), policy.get("ignored_paths", []))
    if req["action"] != "create" and not hits:
        print("BLOCKED: flag key not found in configured flag files", file=sys.stderr)
        return 5
    if req["action"] == "delete" and hits:
        print("INFO: deletion request still has flag-file references; verifier must ensure code references are removed safely")
    print(f"PASS: flag={req['flag_key']} environment={req['environment']} files={len(hits)} approval_required={bool(reasons)}")
    for h in hits: print(f"  {h}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
