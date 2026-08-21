#!/usr/bin/env python3
"""Compare two JSON configuration snapshots without exposing secret values."""
import argparse
import json
import re
import sys
from pathlib import Path

DEFAULT_SECRET_PATTERNS = [
    "password", "secret", "token", "apikey", "api_key",
    "connectionstring", "connection_string", "privatekey", "private_key"
]


def load_json(path: Path):
    try:
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}")
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}")


def flatten(value, prefix=""):
    result = {}
    if isinstance(value, dict):
        for key in sorted(value):
            path = f"{prefix}.{key}" if prefix else str(key)
            result.update(flatten(value[key], path))
    elif isinstance(value, list):
        for index, item in enumerate(value):
            result.update(flatten(item, f"{prefix}[{index}]"))
        if not value:
            result[prefix] = []
    else:
        result[prefix] = value
    return result


def sensitive(path, patterns):
    normalized = re.sub(r"[^a-z0-9_]", "", path.lower())
    return any(re.sub(r"[^a-z0-9_]", "", p.lower()) in normalized for p in patterns)


def visible(value, is_sensitive):
    return "<redacted>" if is_sensitive else value


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--expected", required=True)
    parser.add_argument("--actual", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--policy")
    args = parser.parse_args()

    try:
        expected_path, actual_path = Path(args.expected), Path(args.actual)
        expected = flatten(load_json(expected_path))
        actual = flatten(load_json(actual_path))
        patterns = DEFAULT_SECRET_PATTERNS
        if args.policy:
            policy = load_json(Path(args.policy))
            patterns = policy.get("secret_name_patterns", patterns)

        differences = []
        for key in sorted(set(expected) | set(actual)):
            is_sensitive = sensitive(key, patterns)
            if key not in expected:
                differences.append({"path": key, "kind": "unexpected", "sensitive": is_sensitive,
                                    "actual": visible(actual[key], is_sensitive)})
            elif key not in actual:
                differences.append({"path": key, "kind": "missing", "sensitive": is_sensitive,
                                    "expected": visible(expected[key], is_sensitive)})
            elif expected[key] != actual[key]:
                differences.append({"path": key, "kind": "changed", "sensitive": is_sensitive,
                                    "expected": visible(expected[key], is_sensitive),
                                    "actual": visible(actual[key], is_sensitive)})

        report = {
            "status": "drift-detected" if differences else "clean",
            "expected_source": str(expected_path),
            "actual_source": str(actual_path),
            "differences": differences,
            "verification": {"secrets_redacted": True, "unintended_changes_checked": False},
            "errors": []
        }
        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"{report['status']}: {len(differences)} difference(s); report={output}")
        return 2 if differences else 0
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 3


if __name__ == "__main__":
    sys.exit(main())
