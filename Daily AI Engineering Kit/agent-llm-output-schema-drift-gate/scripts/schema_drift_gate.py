#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

BREAKING = {"field_removed", "required_added", "type_changed", "enum_narrowed"}


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def compare(old, new, path="$", findings=None):
    findings = findings if findings is not None else []
    ot, nt = old.get("type"), new.get("type")
    if ot and nt and ot != nt:
        findings.append({"kind":"type_changed","path":path,"from":ot,"to":nt})
        return findings
    if ot == "object" or "properties" in old or "properties" in new:
        op, np = old.get("properties", {}), new.get("properties", {})
        orq, nrq = set(old.get("required", [])), set(new.get("required", []))
        for name in sorted(op.keys() - np.keys()):
            findings.append({"kind":"field_removed","path":f"{path}.{name}"})
        for name in sorted(nrq - orq):
            findings.append({"kind":"required_added","path":f"{path}.{name}"})
        for name in sorted(op.keys() & np.keys()):
            compare(op[name], np[name], f"{path}.{name}", findings)
    oe, ne = old.get("enum"), new.get("enum")
    if isinstance(oe, list) and isinstance(ne, list):
        removed = sorted(set(map(str, oe)) - set(map(str, ne)))
        if removed:
            findings.append({"kind":"enum_narrowed","path":path,"removed":removed})
        added = sorted(set(map(str, ne)) - set(map(str, oe)))
        if added:
            findings.append({"kind":"enum_expanded","path":path,"added":added})
    return findings


def validate_samples(schema, samples):
    try:
        import jsonschema
    except ImportError:
        return [{"kind":"tool_error","path":"$","message":"jsonschema package is required for --samples"}]
    errors = []
    validator = jsonschema.Draft202012Validator(schema)
    for i, sample in enumerate(samples):
        for err in validator.iter_errors(sample):
            loc = ".".join(map(str, err.absolute_path)) or "$"
            errors.append({"kind":"sample_invalid","path":f"sample[{i}].{loc}","message":err.message})
    return errors


def main():
    ap = argparse.ArgumentParser(description="Detect breaking drift between two JSON Schemas and optionally validate samples.")
    ap.add_argument("--baseline", required=True)
    ap.add_argument("--candidate", required=True)
    ap.add_argument("--samples", help="JSON array or JSONL file with candidate outputs")
    ap.add_argument("--out", default="schema-drift-result.json")
    args = ap.parse_args()
    try:
        baseline, candidate = load(args.baseline), load(args.candidate)
        findings = compare(baseline, candidate)
        if args.samples:
            p = Path(args.samples)
            text = p.read_text(encoding="utf-8").strip()
            samples = json.loads(text) if text.startswith("[") else [json.loads(x) for x in text.splitlines() if x.strip()]
            findings.extend(validate_samples(candidate, samples))
        breaking = [f for f in findings if f["kind"] in BREAKING]
        invalid = [f for f in findings if f["kind"] in {"sample_invalid","tool_error"}]
        status = "block" if breaking or invalid else ("warn" if findings else "pass")
        result = {"status":status,"breaking_count":len(breaking),"finding_count":len(findings),"findings":findings}
        Path(args.out).write_text(json.dumps(result, indent=2), encoding="utf-8")
        print(json.dumps(result, indent=2))
        return 2 if status == "block" else 0
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"schema-drift-gate error: {exc}", file=sys.stderr)
        return 3

if __name__ == "__main__":
    raise SystemExit(main())
