#!/usr/bin/env python3
"""Evaluate harmless sandbox boundary observations.

Input JSON:
{
  "metadata": {...},
  "observations": [
    {"name":"local-write","expected":"deny","observed":"deny|allow|unknown","external":false}
  ],
  "external_capabilities": [
    {"name":"remote-executor","reviewed":true,"approved":false}
  ]
}

Exit codes: 0 PASS, 2 FAIL_OPEN, 3 UNKNOWN/invalid, 4 FAIL_CLOSED.
"""
from __future__ import annotations
import json, sys
from pathlib import Path

VALID = {"allow", "deny", "unknown"}

def load(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or not isinstance(data.get("metadata"), dict):
        raise ValueError("metadata object required")
    obs = data.get("observations")
    if not isinstance(obs, list) or not obs:
        raise ValueError("non-empty observations required")
    caps = data.get("external_capabilities", [])
    if not isinstance(caps, list):
        raise ValueError("external_capabilities must be a list")
    return data

def classify(obs: dict) -> tuple[str, str]:
    for k in ("name", "expected", "observed"):
        if k not in obs: raise ValueError(f"observation missing {k}")
    exp, got = obs["expected"], obs["observed"]
    if exp not in {"allow", "deny"} or got not in VALID:
        raise ValueError("invalid expected/observed")
    if got == "unknown": return "UNKNOWN", "effect not proven"
    if exp == "deny" and got == "allow": return "FAIL_OPEN", "expected deny but effect succeeded"
    if exp == "allow" and got == "deny": return "FAIL_CLOSED", "expected allow but effect blocked"
    return "PASS", "effect matches declared policy"

def main() -> int:
    if len(sys.argv) != 2:
        print("usage: evaluate_boundary.py observations.json", file=sys.stderr); return 3
    try:
        data = load(Path(sys.argv[1]))
        rows=[]
        for obs in data["observations"]:
            status, reason = classify(obs)
            rows.append({"name":obs["name"],"status":status,"reason":reason})
        for cap in data.get("external_capabilities", []):
            if not isinstance(cap, dict) or not cap.get("name"):
                raise ValueError("invalid external capability")
            reviewed = cap.get("reviewed") is True
            approved = cap.get("approved") is True
            status = "PASS" if reviewed and approved else "UNKNOWN"
            rows.append({"name":f"external:{cap['name']}","status":status,"reason":"explicit trust decision present" if status=="PASS" else "external executor lacks explicit approved review"})
        statuses={r["status"] for r in rows}
        overall = "FAIL_OPEN" if "FAIL_OPEN" in statuses else "UNKNOWN" if "UNKNOWN" in statuses else "FAIL_CLOSED" if "FAIL_CLOSED" in statuses else "PASS"
        print(json.dumps({"overall":overall,"metadata":data["metadata"],"results":rows}, indent=2))
        return {"PASS":0,"FAIL_OPEN":2,"UNKNOWN":3,"FAIL_CLOSED":4}[overall]
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(json.dumps({"overall":"UNKNOWN","error":str(exc)}), file=sys.stderr); return 3

if __name__ == "__main__":
    raise SystemExit(main())
