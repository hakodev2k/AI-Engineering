#!/usr/bin/env python3
import argparse, json, sys
from collections import defaultdict

def load(path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data.get("required_controls"), list) or not data["required_controls"]:
        raise ValueError("required_controls must be a non-empty list")
    if not isinstance(data.get("paths"), list) or not data["paths"]:
        raise ValueError("paths must be a non-empty list")
    return data

def analyze(data):
    required = data["required_controls"]
    violations = []
    by_resource = defaultdict(list)
    for i, path in enumerate(data["paths"]):
        missing_fields = [k for k in ("name", "protected_resource", "mutates", "controls") if k not in path]
        if missing_fields:
            for key in missing_fields:
                violations.append({"path": f"index:{i}", "control": key, "reason": "missing_field"})
            continue
        if not path["mutates"]:
            continue
        by_resource[path["protected_resource"]].append(path["name"])
        controls = path["controls"]
        if not isinstance(controls, dict):
            violations.append({"path": path["name"], "control": "controls", "reason": "must_be_object"})
            continue
        for control in required:
            if controls.get(control) is not True:
                violations.append({"path": path["name"], "resource": path["protected_resource"], "control": control, "reason": "required_control_not_enforced"})
    resources = [{"protected_resource": r, "mutation_paths": sorted(p), "path_count": len(p)} for r, p in sorted(by_resource.items())]
    return {"status": "pass" if not violations else "fail", "violations": violations, "resources": resources}

def main():
    p = argparse.ArgumentParser(description="Check authorization-control parity across protected mutation paths")
    p.add_argument("config")
    p.add_argument("--output")
    args = p.parse_args()
    try:
        result = analyze(load(args.config))
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    text = json.dumps(result, indent=2, sort_keys=True)
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(text + "\n")
    else:
        print(text)
    return 0 if result["status"] == "pass" else 1

if __name__ == "__main__":
    raise SystemExit(main())
