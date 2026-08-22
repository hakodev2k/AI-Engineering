#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

VALID = {"allow", "deny", "unknown", "not-applicable"}

def load(path):
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        raise ValueError(str(e))
    if not isinstance(data, dict) or not isinstance(data.get("layers"), list):
        raise ValueError("input must be an object with a layers array")
    return data

def evaluate(data):
    layers = data["layers"]
    normalized = []
    for i, x in enumerate(layers):
        if not isinstance(x, dict):
            raise ValueError(f"layer {i} must be an object")
        decision = x.get("decision")
        if decision not in VALID:
            raise ValueError(f"layer {i} has invalid decision")
        normalized.append({
            "name": str(x.get("name", f"layer-{i}")),
            "decision": decision,
            "priority": int(x.get("priority", 100)),
            "hard": bool(x.get("hard", False)),
            "reason": str(x.get("reason", "")),
        })
    applicable = [x for x in normalized if x["decision"] != "not-applicable"]
    conflicts = []
    allows = [x for x in applicable if x["decision"] == "allow"]
    denies = [x for x in applicable if x["decision"] == "deny"]
    if allows and denies:
        conflicts.append({"type":"allow-deny-conflict","allow":[x["name"] for x in allows],"deny":[x["name"] for x in denies]})
    hard_denies = sorted((x for x in denies if x["hard"]), key=lambda x: x["priority"])
    if hard_denies:
        winner = hard_denies[0]
        effective = "deny"
    else:
        known = sorted((x for x in applicable if x["decision"] in {"allow","deny"}), key=lambda x: x["priority"])
        unknown = [x for x in applicable if x["decision"] == "unknown"]
        if not known or (unknown and data.get("risk", "high") != "low"):
            winner = None
            effective = "indeterminate"
        else:
            winner = known[0]
            effective = winner["decision"]
    return {"effective_decision":effective,"winning_layer":winner,"conflicts":conflicts,"layers":normalized}

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    a=p.parse_args()
    try:
        result=evaluate(load(a.input))
    except ValueError as e:
        print(json.dumps({"error":str(e)}))
        return 1
    print(json.dumps(result, indent=2))
    if result["effective_decision"] == "allow" and not result["conflicts"]: return 0
    if result["effective_decision"] == "deny": return 2
    return 3
if __name__ == "__main__": sys.exit(main())