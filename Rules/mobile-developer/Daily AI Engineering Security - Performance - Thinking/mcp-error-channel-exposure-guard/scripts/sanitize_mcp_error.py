#!/usr/bin/env python3
"""Create a bounded model-safe MCP error envelope from a raw error JSON object."""
import argparse, json, pathlib, re, sys, uuid

FORBIDDEN_PATTERNS = [
    re.compile(r"(?im)^\s*(authorization|cookie|set-cookie)\s*:\s*.+$"),
    re.compile(r"(?i)bearer\s+[A-Za-z0-9._~+/-]{8,}"),
    re.compile(r"(?m)^\s*Traceback \(most recent call last\):"),
    re.compile(r"(?m)^\s*File \"[^\"]+\", line \d+"),
]

SAFE_CODES = {"validation_error", "not_found", "unauthorized", "forbidden", "rate_limited", "timeout", "dependency_error", "internal_error"}

def read_json(path):
    try: return json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"invalid JSON: {exc}", file=sys.stderr); raise SystemExit(2)

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True); p.add_argument("--output", required=True)
    p.add_argument("--secrets-file"); p.add_argument("--max-message-chars", type=int, default=240)
    args = p.parse_args()
    if args.max_message_chars < 32 or args.max_message_chars > 2000: return 2
    raw = read_json(args.input)
    if not isinstance(raw, dict): return 2
    secrets = {}
    if args.secrets_file:
        secrets = read_json(args.secrets_file)
        if not isinstance(secrets, dict): return 2
    raw_text = json.dumps(raw, ensure_ascii=False)
    unsafe = []
    for label, value in secrets.items():
        if isinstance(value, str) and value and value in raw_text: unsafe.append(f"registered_secret:{label}")
    for rx in FORBIDDEN_PATTERNS:
        if rx.search(raw_text): unsafe.append(f"pattern:{rx.pattern[:30]}")
    code = raw.get("public_code", "internal_error")
    if code not in SAFE_CODES: code = "internal_error"
    message = raw.get("safe_message")
    if not isinstance(message, str) or not message.strip():
        message = "The tool could not complete the request."
    message = message.strip()[:args.max_message_chars]
    # Never use arbitrary raw exception text as the safe message.
    for value in secrets.values():
        if isinstance(value, str) and value: message = message.replace(value, "[REDACTED]")
    for rx in FORBIDDEN_PATTERNS: message = rx.sub("[REDACTED]", message)
    correlation_id = raw.get("correlation_id")
    if not isinstance(correlation_id, str) or not correlation_id.strip(): correlation_id = str(uuid.uuid4())
    envelope = {"isError": True, "code": code, "message": message, "retryable": bool(raw.get("retryable", False)), "correlation_id": correlation_id}
    pathlib.Path(args.output).write_text(json.dumps(envelope, ensure_ascii=False, indent=2), encoding="utf-8")
    if unsafe:
        print(json.dumps({"status":"blocked","unsafe":unsafe,"output":args.output})); return 3
    print(json.dumps({"status":"safe","output":args.output})); return 0

if __name__ == "__main__": raise SystemExit(main())
