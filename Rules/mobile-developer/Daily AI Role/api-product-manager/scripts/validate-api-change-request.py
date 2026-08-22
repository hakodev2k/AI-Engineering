#!/usr/bin/env python3
import json, sys
from pathlib import Path

REQUIRED = ["title","consumer","problem","desired_outcome","proposed_change","risk_level","breaking_change","success_metrics"]
RISKS = {"low","medium","high","critical"}

def fail(msg, code=1):
    print(f"ERROR: {msg}", file=sys.stderr)
    raise SystemExit(code)

def main():
    if len(sys.argv) != 2:
        fail("usage: validate-api-change-request.py <request.json>", 2)
    p = Path(sys.argv[1])
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        fail(str(e), 2)
    missing = [k for k in REQUIRED if k not in data]
    if missing:
        fail("missing required fields: " + ", ".join(missing))
    if data["risk_level"] not in RISKS:
        fail("risk_level must be low|medium|high|critical")
    if not isinstance(data["breaking_change"], bool):
        fail("breaking_change must be boolean")
    metrics = data["success_metrics"]
    if not isinstance(metrics, list) or not metrics or not all(isinstance(x,str) and x.strip() for x in metrics):
        fail("success_metrics must be a non-empty string array")
    for k in ["title","consumer","problem","desired_outcome","proposed_change"]:
        if not isinstance(data[k], str) or not data[k].strip():
            fail(f"{k} must be a non-empty string")
    print("OK: API change request is structurally valid")

if __name__ == "__main__":
    main()
