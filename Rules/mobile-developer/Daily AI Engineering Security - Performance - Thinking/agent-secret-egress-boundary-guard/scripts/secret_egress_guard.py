#!/usr/bin/env python3
"""Scan/redact payloads for exact registered synthetic/real secret values without logging them."""
import argparse, hashlib, json, pathlib, sys


def load_secrets(path: str) -> dict[str, str]:
    try:
        data = json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read secrets file: {exc}") from exc
    if not isinstance(data, dict) or not data:
        raise ValueError("secrets file must be a non-empty JSON object")
    out: dict[str, str] = {}
    for label, value in data.items():
        if not isinstance(label, str) or not isinstance(value, str) or len(value) < 6:
            raise ValueError("each secret must have a string label and string value of at least 6 characters")
        out[label] = value
    return out


def fingerprint(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()[:12]


def findings(text: str, secrets: dict[str, str]) -> list[dict]:
    result = []
    for label, value in secrets.items():
        count = text.count(value)
        if count:
            result.append({"label": label, "count": count, "length": len(value), "fingerprint": fingerprint(value)})
    return result


def redact(text: str, secrets: dict[str, str]) -> str:
    # Longest first prevents a shorter registered value from partially replacing a longer one.
    for label, value in sorted(secrets.items(), key=lambda kv: len(kv[1]), reverse=True):
        text = text.replace(value, f"[REDACTED:{label}]")
    return text


def main() -> int:
    parser = argparse.ArgumentParser(description="Deterministic exact-value secret egress guard")
    sub = parser.add_subparsers(dest="command", required=True)
    for name in ("scan", "redact"):
        p = sub.add_parser(name)
        p.add_argument("--input", required=True)
        p.add_argument("--secrets-file", required=True)
        if name == "redact":
            p.add_argument("--output", required=True)
    args = parser.parse_args()
    try:
        text = pathlib.Path(args.input).read_text(encoding="utf-8", errors="replace")
        secrets = load_secrets(args.secrets_file)
    except Exception as exc:
        print(json.dumps({"status": "error", "message": str(exc)}), file=sys.stderr)
        return 2

    hits = findings(text, secrets)
    if args.command == "scan":
        print(json.dumps({"status": "blocked" if hits else "pass", "findings": hits}, indent=2))
        return 3 if hits else 0

    sanitized = redact(text, secrets)
    try:
        pathlib.Path(args.output).write_text(sanitized, encoding="utf-8")
    except Exception as exc:
        print(json.dumps({"status": "error", "message": f"cannot write output: {exc}"}), file=sys.stderr)
        return 2
    remaining = findings(sanitized, secrets)
    print(json.dumps({"status": "pass" if not remaining else "blocked", "redacted": hits, "remaining": remaining}, indent=2))
    return 3 if remaining else 0


if __name__ == "__main__":
    raise SystemExit(main())
