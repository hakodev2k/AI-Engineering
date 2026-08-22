#!/usr/bin/env python3
import argparse, fnmatch, json, sys
from pathlib import Path


def load(path):
    try: return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        print(f"ERROR: cannot read {path}: {e}", file=sys.stderr); raise


def in_scope(path, patterns):
    return any(fnmatch.fnmatch(path, p) or path.startswith(p.rstrip("*") .rstrip("/")) for p in patterns)


def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--record",required=True); ap.add_argument("--diff",required=True); ap.add_argument("--policy",required=True); a=ap.parse_args()
    try: r,d,p=load(a.record),load(a.diff),load(a.policy)
    except Exception: return 2
    errors=[]
    for k in ["task","baseline_ref","allowed_scope","requirements","evidence","changes","review"]:
        if k not in r: errors.append(f"missing record field: {k}")
    if errors:
        print(json.dumps({"status":"invalid","errors":errors},indent=2)); return 1
    if r["baseline_ref"] != d.get("baseline_ref"): errors.append("baseline_ref mismatch")
    diff_paths={x.get("path") for x in d.get("files",[]) if x.get("path")}
    mapped_paths={x.get("path") for x in r.get("changes",[]) if x.get("path")}
    for path in sorted(diff_paths-mapped_paths): errors.append(f"unmapped changed path: {path}")
    for path in sorted(mapped_paths-diff_paths): errors.append(f"recorded path not present in current diff: {path}")
    req_ids={x.get("id") for x in r.get("requirements",[])}; ev_ids={x.get("id") for x in r.get("evidence",[])}
    required=p.get("required_change_fields",[])
    for c in r.get("changes",[]):
        path=c.get("path","<unknown>")
        for f in required:
            if f not in c: errors.append(f"{path}: missing {f}")
        if not in_scope(path,r.get("allowed_scope",[])): errors.append(f"{path}: outside allowed scope")
        if not c.get("rationale","" ).strip(): errors.append(f"{path}: empty rationale")
        if not c.get("requirement_ids") and not c.get("evidence_ids"): errors.append(f"{path}: no requirement/evidence mapping")
        for x in c.get("requirement_ids",[]):
            if x not in req_ids: errors.append(f"{path}: unknown requirement id {x}")
        for x in c.get("evidence_ids",[]):
            if x not in ev_ids: errors.append(f"{path}: unknown evidence id {x}")
        if not c.get("verification_checks"): errors.append(f"{path}: no verification checks")
        for v in c.get("verification_checks",[]):
            if not v.get("id") or not v.get("owner") or not v.get("status"): errors.append(f"{path}: malformed verification check")
    if r.get("diff_sha256") and r.get("diff_sha256") != d.get("diff_sha256"): errors.append("diff hash mismatch; provenance is stale")
    out={"status":"valid" if not errors else "invalid","errors":errors,"changed_paths":len(diff_paths)}
    print(json.dumps(out,indent=2)); return 0 if not errors else 1

if __name__=="__main__": raise SystemExit(main())
