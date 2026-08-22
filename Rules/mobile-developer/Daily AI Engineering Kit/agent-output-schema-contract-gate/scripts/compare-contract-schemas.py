#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def type_set(schema):
    t = schema.get("type")
    if isinstance(t, list): return set(t)
    if isinstance(t, str): return {t}
    return set()


def walk(base, cand, path="$", findings=None):
    findings = findings if findings is not None else []
    btypes, ctypes = type_set(base), type_set(cand)
    if btypes and ctypes and btypes != ctypes:
        findings.append({"kind":"type_change","path":path,"baseline":sorted(btypes),"candidate":sorted(ctypes)})

    benum, cenum = base.get("enum"), cand.get("enum")
    if isinstance(benum, list) and isinstance(cenum, list):
        removed = sorted(set(map(str, benum)) - set(map(str, cenum)))
        added = sorted(set(map(str, cenum)) - set(map(str, benum)))
        if removed: findings.append({"kind":"enum_narrowing","path":path,"removed":removed})
        if added: findings.append({"kind":"enum_expansion","path":path,"added":added})

    if base.get("format") != cand.get("format") and (base.get("format") or cand.get("format")):
        findings.append({"kind":"format_change","path":path,"baseline":base.get("format"),"candidate":cand.get("format")})

    if "null" in btypes and "null" not in ctypes:
        findings.append({"kind":"nullable_to_nonnullable","path":path})

    if isinstance(base.get("properties"), dict) or isinstance(cand.get("properties"), dict):
        bp, cp = base.get("properties", {}), cand.get("properties", {})
        br, cr = set(base.get("required", [])), set(cand.get("required", []))
        for key in sorted(set(bp) - set(cp)):
            findings.append({"kind":"removed_property","path":f"{path}.{key}"})
        for key in sorted(set(cp) - set(bp)):
            findings.append({"kind":"optional_property_addition" if key not in cr else "new_required_property","path":f"{path}.{key}"})
        for key in sorted(cr - br):
            if key in bp:
                findings.append({"kind":"new_required_property","path":f"{path}.{key}"})
        for key in sorted(set(bp) & set(cp)):
            walk(bp[key], cp[key], f"{path}.{key}", findings)

    if base.get("additionalProperties", True) is not False and cand.get("additionalProperties", True) is False:
        findings.append({"kind":"additional_properties_restriction","path":path})
    return findings


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--baseline", required=True)
    ap.add_argument("--candidate", required=True)
    ap.add_argument("--policy", required=True)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    try:
        base, cand, policy = load(a.baseline), load(a.candidate), load(a.policy)
    except Exception as e:
        print(json.dumps({"status":"error","error":str(e)})); sys.exit(2)
    findings = walk(base, cand)
    breaking = set(k for k,v in policy.get("breaking_rules",{}).items() if v)
    migration = set(k for k,v in policy.get("migration_rules",{}).items() if v)
    kinds = {f["kind"] for f in findings}
    if kinds & breaking: status = "breaking"
    elif kinds & migration: status = "migration-required"
    else: status = "compatible"
    report = {
        "status": status,
        "baseline_schema_sha256": sha(a.baseline),
        "candidate_schema_sha256": sha(a.candidate),
        "findings": findings
    }
    Path(a.out).write_text(json.dumps(report, indent=2)+"\n", encoding="utf-8")
    print(json.dumps(report, indent=2))
    sys.exit(0)

if __name__ == "__main__": main()
