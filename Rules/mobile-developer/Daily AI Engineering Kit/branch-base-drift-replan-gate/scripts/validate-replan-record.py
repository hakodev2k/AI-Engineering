#!/usr/bin/env python3
import argparse, json, re, sys
from pathlib import Path

SHA_RE = re.compile(r"^[0-9a-fA-F]{40,64}$")
ALLOWED_DISPOSITIONS = {"unchanged", "revalidate", "replan", "blocked"}
ALLOWED_ASSUMPTION = {"current", "revalidate", "invalid", "open-question"}
ALLOWED_RISK = {"low", "medium", "high"}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("record")
    ns = ap.parse_args()
    errors = []
    try:
        d = json.loads(Path(ns.record).read_text(encoding="utf-8"))
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr); return 2
    for key in ["version", "plan_id", "plan_revision", "repository", "refs", "planned_scope", "assumptions", "steps", "tests", "risk"]:
        if key not in d: errors.append(f"missing {key}")
    if not isinstance(d.get("plan_revision"), int) or d.get("plan_revision", 0) < 1: errors.append("plan_revision must be >= 1")
    refs = d.get("refs", {})
    for key in ["target_ref", "head_ref", "target_sha", "head_sha", "merge_base_sha"]:
        if not refs.get(key): errors.append(f"missing refs.{key}")
    for key in ["target_sha", "head_sha", "merge_base_sha"]:
        if refs.get(key) and not SHA_RE.match(str(refs[key])): errors.append(f"invalid refs.{key}")
    paths = d.get("planned_scope", {}).get("paths")
    if not isinstance(paths, list) or not paths or any(not isinstance(x, str) or not x.strip() for x in paths): errors.append("planned_scope.paths must contain non-empty strings")
    if d.get("risk") not in ALLOWED_RISK: errors.append("invalid risk")
    for a in d.get("assumptions", []):
        if not isinstance(a, dict) or not a.get("id") or not a.get("statement") or a.get("status") not in ALLOWED_ASSUMPTION: errors.append("invalid assumption entry")
    ids = set()
    for s in d.get("steps", []):
        if not isinstance(s, dict) or not s.get("id") or not s.get("summary") or s.get("disposition") not in ALLOWED_DISPOSITIONS: errors.append("invalid step entry"); continue
        if s["id"] in ids: errors.append(f"duplicate step id {s['id']}")
        ids.add(s["id"])
    if not isinstance(d.get("tests"), list): errors.append("tests must be an array")
    if errors:
        for e in errors: print(f"ERROR: {e}", file=sys.stderr)
        return 2
    print("valid")
    return 0

if __name__ == "__main__": raise SystemExit(main())
