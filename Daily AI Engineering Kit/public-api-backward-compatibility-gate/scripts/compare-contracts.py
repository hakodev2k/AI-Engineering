#!/usr/bin/env python3
import argparse
import json
import pathlib
import sys

BREAKING_KEYS = {
    "removed-path", "removed-operation", "removed-property", "required-property-added",
    "type-narrowed", "enum-value-removed", "serialization-name-changed",
    "public-member-removed", "public-signature-changed"
}


def pointer(parts):
    return "/" + "/".join(str(p).replace("~", "~0").replace("/", "~1") for p in parts)


def classify_key(path_parts, before, after, removed=False, added=False):
    p = "/".join(map(str, path_parts)).lower()
    if removed:
        if "/paths/" in f"/{p}/" and len(path_parts) <= 2:
            return "removed-path"
        if any(x in p for x in ["properties", "fields", "members"]):
            return "removed-property"
        if "enum" in p:
            return "enum-value-removed"
        return "removed-property"
    if added and "required" in p:
        return "required-property-added"
    if not added and not removed and isinstance(before, str) and isinstance(after, str):
        if path_parts and str(path_parts[-1]).lower() in {"type", "format"} and before != after:
            return "type-narrowed"
    return "changed-value" if not added and not removed else "added-value"


def walk(before, after, parts, changes):
    if isinstance(before, dict) and isinstance(after, dict):
        for k in sorted(before.keys() - after.keys()):
            kind = classify_key(parts + [k], before[k], None, removed=True)
            changes.append({"path": pointer(parts + [k]), "kind": kind, "before": before[k], "after": None})
        for k in sorted(after.keys() - before.keys()):
            kind = classify_key(parts + [k], None, after[k], added=True)
            changes.append({"path": pointer(parts + [k]), "kind": kind, "before": None, "after": after[k]})
        for k in sorted(before.keys() & after.keys()):
            walk(before[k], after[k], parts + [k], changes)
        return
    if isinstance(before, list) and isinstance(after, list):
        if before == after:
            return
        # Treat scalar-list removals specially (common for enum/required).
        if all(not isinstance(x, (dict, list)) for x in before + after):
            removed = [x for x in before if x not in after]
            added = [x for x in after if x not in before]
            for x in removed:
                kind = "enum-value-removed" if "enum" in "/".join(map(str, parts)).lower() else "removed-value"
                changes.append({"path": pointer(parts), "kind": kind, "before": x, "after": None})
            for x in added:
                kind = "required-property-added" if "required" in "/".join(map(str, parts)).lower() else "added-value"
                changes.append({"path": pointer(parts), "kind": kind, "before": None, "after": x})
            return
    if before != after:
        changes.append({"path": pointer(parts), "kind": classify_key(parts, before, after), "before": before, "after": after})


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--baseline", required=True)
    ap.add_argument("--candidate", required=True)
    ap.add_argument("--output", required=True)
    args = ap.parse_args()
    try:
        baseline = json.loads(pathlib.Path(args.baseline).read_text(encoding="utf-8"))
        candidate = json.loads(pathlib.Path(args.candidate).read_text(encoding="utf-8"))
    except Exception as e:
        print(f"ERROR loading contract JSON: {e}", file=sys.stderr)
        return 2
    changes = []
    walk(baseline, candidate, [], changes)
    for i, c in enumerate(changes, 1):
        c["change_id"] = f"chg-{i:04d}"
        c["breaking_candidate"] = c["kind"] in BREAKING_KEYS
    out = {"schema_version": 1, "changes": changes, "summary": {
        "total": len(changes),
        "breaking_candidates": sum(1 for c in changes if c["breaking_candidate"])
    }}
    out_path = pathlib.Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(out, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(f"OK wrote {len(changes)} changes to {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
