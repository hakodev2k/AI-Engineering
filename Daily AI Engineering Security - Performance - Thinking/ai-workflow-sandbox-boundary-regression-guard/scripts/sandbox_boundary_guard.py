#!/usr/bin/env python3
import argparse, json, re, sys
from pathlib import Path


def read_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc


def version_tuple(value):
    if isinstance(value, list) and all(isinstance(x, int) for x in value):
        return tuple(value)
    if not isinstance(value, str):
        raise ValueError("version must be a string or integer list")
    m = re.match(r"^v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$", value.strip())
    if not m:
        raise ValueError(f"unsupported version format: {value}")
    return tuple(int(x) for x in m.groups())


def evaluate(inventory, policy):
    violations = []
    components = inventory.get("components")
    if not isinstance(components, list) or not components:
        return {"ok": False, "violations": ["components_missing_or_empty"]}

    minimum = policy.get("minimum_versions", {})
    for item in components:
        name = str(item.get("name", "")).casefold()
        version = item.get("version")
        if name in minimum:
            try:
                if version_tuple(version) < version_tuple(minimum[name]):
                    violations.append(f"known_vulnerable_version:{name}:{version}")
            except ValueError:
                if policy.get("block_on_unknown_version", True):
                    violations.append(f"unknown_version:{name}:{version}")

        custom = bool(item.get("custom_code_enabled", False))
        controls = set(item.get("controls", []))
        capabilities = set(item.get("capabilities", []))
        if custom:
            for required in policy.get("required_controls_for_custom_code", []):
                if required not in controls:
                    violations.append(f"missing_control:{name}:{required}")
        for forbidden in policy.get("forbidden_capabilities", []):
            if forbidden in capabilities:
                violations.append(f"forbidden_capability:{name}:{forbidden}")

    return {"ok": not violations, "violations": sorted(set(violations)), "component_count": len(components)}


def main():
    ap = argparse.ArgumentParser(description="Validate AI/workflow sandbox boundary inventory without executing exploit payloads.")
    ap.add_argument("--inventory", required=True)
    ap.add_argument("--policy", required=True)
    args = ap.parse_args()
    try:
        result = evaluate(read_json(args.inventory), read_json(args.policy))
        print(json.dumps(result, indent=2, sort_keys=True))
        return 0 if result["ok"] else 3
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
