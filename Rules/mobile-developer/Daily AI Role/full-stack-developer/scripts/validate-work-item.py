#!/usr/bin/env python3
import json, sys

REQUIRED = ["id", "objective", "acceptanceCriteria", "affectedLayers", "risk", "owner"]
LAYERS = {"frontend","api","domain","data","integration","infrastructure","observability"}
RISKS = {"low","medium","high","critical"}

def fail(msg, code=1):
    print(f"ERROR: {msg}", file=sys.stderr); raise SystemExit(code)

def main():
    if len(sys.argv) != 2:
        fail("usage: validate-work-item.py <work-item.json>", 2)
    try:
        with open(sys.argv[1], encoding="utf-8") as f: d=json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        fail(f"cannot read/parse input: {e}", 2)
    missing=[k for k in REQUIRED if k not in d]
    if missing: fail("missing required keys: " + ", ".join(missing))
    if not isinstance(d["acceptanceCriteria"], list) or not d["acceptanceCriteria"]: fail("acceptanceCriteria must be non-empty list")
    if not isinstance(d["affectedLayers"], list) or not d["affectedLayers"]: fail("affectedLayers must be non-empty list")
    unknown=set(d["affectedLayers"])-LAYERS
    if unknown: fail("unknown affectedLayers: " + ", ".join(sorted(unknown)))
    if d["risk"] not in RISKS: fail("risk must be low|medium|high|critical")
    if (d.get("destructiveChange") or d.get("risk") == "critical") and not d.get("requiresHumanApproval"):
        fail("destructive/critical work must require human approval")
    if d.get("destructiveChange") and not str(d.get("rollback", "")).strip(): fail("destructive work requires rollback/roll-forward description")
    print("VALID")

if __name__ == "__main__": main()
