#!/usr/bin/env python3
"""Validate harmless permission-canary observations.

Input JSON must be an object with `metadata` and non-empty `observations`.
Each observation requires: name, expected (allow|ask|deny), observed
(allow|ask|deny|unknown), prompted (bool), executed (bool).

Exit: 0 pass, 2 fail-open, 3 invalid/unknown, 4 fail-closed.
"""
from __future__ import annotations
import json, sys
from pathlib import Path

VALID = {"allow", "ask", "deny"}


def load(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or not isinstance(data.get("metadata"), dict):
        raise ValueError("metadata object is required")
    obs = data.get("observations")
    if not isinstance(obs, list) or not obs:
        raise ValueError("non-empty observations array is required")
    return data


def classify(item: dict) -> tuple[str, str]:
    for key in ("name", "expected", "observed", "prompted", "executed"):
        if key not in item:
            raise ValueError(f"observation missing {key}")
    exp, got = item["expected"], item["observed"]
    if exp not in VALID or got not in VALID | {"unknown"}:
        raise ValueError("invalid expected/observed value")
    if not isinstance(item["prompted"], bool) or not isinstance(item["executed"], bool):
        raise ValueError("prompted/executed must be boolean")
    if got == "unknown": return "UNKNOWN", "runtime decision unknown"
    if exp == "deny" and item["executed"]:
        return "FAIL_OPEN", "denied probe executed"
    if exp == "ask" and item["executed"] and not item["prompted"]:
        return "FAIL_OPEN", "ask probe executed without prompt"
    if exp == "ask" and not item["prompted"]:
        return "FAIL_OPEN", "ask probe produced no prompt"
    if exp == "allow" and (item["prompted"] or not item["executed"]):
        return "FAIL_CLOSED", "allow probe was gated or blocked"
    if exp == "deny" and got != "deny":
        return "UNKNOWN", "deny observation inconsistent"
    return "PASS", "decision matches policy"


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: permission_canary.py observations.json", file=sys.stderr); return 3
    try:
        data = load(Path(sys.argv[1]))
        rows = []
        for item in data["observations"]:
            status, reason = classify(item)
            rows.append({"name": item["name"], "status": status, "reason": reason})
        statuses = {r["status"] for r in rows}
        overall = "FAIL_OPEN" if "FAIL_OPEN" in statuses else "UNKNOWN" if "UNKNOWN" in statuses else "FAIL_CLOSED" if "FAIL_CLOSED" in statuses else "PASS"
        print(json.dumps({"overall": overall, "metadata": data["metadata"], "results": rows}, indent=2))
        return {"PASS": 0, "FAIL_OPEN": 2, "UNKNOWN": 3, "FAIL_CLOSED": 4}[overall]
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(json.dumps({"overall": "UNKNOWN", "error": str(exc)}), file=sys.stderr); return 3


if __name__ == "__main__":
    raise SystemExit(main())