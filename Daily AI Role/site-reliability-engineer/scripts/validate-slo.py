#!/usr/bin/env python3
import json
import sys
from pathlib import Path

REQUIRED = ["service", "owner", "sli", "objective", "window", "measurement_source", "error_budget_policy"]

def fail(msg: str, code: int = 2) -> None:
    print(f"ERROR: {msg}", file=sys.stderr)
    raise SystemExit(code)

def main() -> None:
    if len(sys.argv) != 2:
        fail("usage: validate-slo.py <slo.json>")
    path = Path(sys.argv[1])
    if not path.is_file():
        fail(f"file not found: {path}")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"invalid JSON: {exc}")
    missing = [k for k in REQUIRED if k not in data]
    if missing:
        fail("missing required keys: " + ", ".join(missing))
    obj = data["objective"]
    if not isinstance(obj, (int, float)) or isinstance(obj, bool) or not (0 < obj <= 1):
        fail("objective must be a number in (0, 1]")
    sli = data["sli"]
    if not isinstance(sli, dict) or not all(sli.get(k) for k in ("name", "good_event", "valid_event")):
        fail("sli requires non-empty name, good_event, valid_event")
    print(f"OK: {data['service']} objective={obj:.6f} window={data['window']}")

if __name__ == "__main__":
    main()
