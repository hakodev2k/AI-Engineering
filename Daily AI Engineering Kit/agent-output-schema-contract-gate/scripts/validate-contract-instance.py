#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path


def fail(msg, code=2):
    print(json.dumps({"status": "invalid", "error": msg}))
    sys.exit(code)


def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        fail(f"cannot load {path}: {e}")


def check(instance, schema, path="$", errors=None):
    errors = errors if errors is not None else []
    t = schema.get("type")
    if isinstance(t, list):
        allowed = t
    elif t:
        allowed = [t]
    else:
        allowed = []

    def matches(v, typ):
        return {
            "object": isinstance(v, dict),
            "array": isinstance(v, list),
            "string": isinstance(v, str),
            "integer": isinstance(v, int) and not isinstance(v, bool),
            "number": isinstance(v, (int, float)) and not isinstance(v, bool),
            "boolean": isinstance(v, bool),
            "null": v is None,
        }.get(typ, True)

    if allowed and not any(matches(instance, typ) for typ in allowed):
        errors.append(f"{path}: expected {allowed}, got {type(instance).__name__}")
        return errors

    if "enum" in schema and instance not in schema["enum"]:
        errors.append(f"{path}: value {instance!r} not in enum")

    if isinstance(instance, dict):
        required = schema.get("required", [])
        for key in required:
            if key not in instance:
                errors.append(f"{path}: missing required property {key}")
        props = schema.get("properties", {})
        for key, value in instance.items():
            if key in props:
                check(value, props[key], f"{path}.{key}", errors)
            elif schema.get("additionalProperties") is False:
                errors.append(f"{path}: unexpected property {key}")
    elif isinstance(instance, list) and isinstance(schema.get("items"), dict):
        for i, value in enumerate(instance):
            check(value, schema["items"], f"{path}[{i}]", errors)
    elif isinstance(instance, str):
        if len(instance) < schema.get("minLength", 0):
            errors.append(f"{path}: shorter than minLength")
    return errors


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--schema", required=True)
    ap.add_argument("--instance", required=True)
    args = ap.parse_args()
    schema, instance = load(args.schema), load(args.instance)
    errors = check(instance, schema)
    out = {"status": "valid" if not errors else "invalid", "errors": errors}
    print(json.dumps(out, indent=2))
    sys.exit(0 if not errors else 1)


if __name__ == "__main__":
    main()
