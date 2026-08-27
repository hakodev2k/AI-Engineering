#!/usr/bin/env python3
import argparse, json, re
from pathlib import Path

META = re.compile(r"[;&|`$<>\n\r]")

def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read JSON {path}: {exc}")

def evaluate(event, policy):
    reasons = []
    for key in ("server_id", "transport", "executable", "argv"):
        if key not in event:
            reasons.append(f"missing:{key}")
    if reasons:
        return {"ok": False, "decision": "block", "reasons": reasons}
    if event["transport"] != "stdio":
        return {"ok": False, "decision": "block", "reasons": ["transport_not_stdio"]}
    if not isinstance(event["executable"], str) or not event["executable"]:
        reasons.append("invalid_executable")
    if not isinstance(event["argv"], list) or not all(isinstance(x, str) for x in event["argv"]):
        reasons.append("argv_must_be_string_array")
    if reasons:
        return {"ok": False, "decision": "block", "reasons": reasons}
    server = policy.get("servers", {}).get(event["server_id"])
    if not server:
        return {"ok": False, "decision": "block", "reasons": ["unknown_server_id"]}
    if event["executable"] != server.get("executable"):
        reasons.append("executable_mismatch")
    argv = event["argv"]
    required = server.get("required_prefix", [])
    if argv[:len(required)] != required:
        reasons.append("argv_prefix_mismatch")
    extra = argv[len(required):] if len(argv) >= len(required) else []
    if len(extra) > int(server.get("max_extra_args", 0)):
        reasons.append("too_many_extra_args")
    forbidden = {str(x).casefold() for x in policy.get("forbidden_flags", [])}
    for arg in argv:
        if arg.casefold() in forbidden:
            reasons.append(f"forbidden_flag:{arg}")
        if policy.get("deny_shell_metacharacters", True) and META.search(arg):
            reasons.append("shell_metacharacter_detected")
    try:
        rex = re.compile(server.get("extra_arg_regex", r"^$"))
    except re.error:
        return {"ok": False, "decision": "block", "reasons": ["invalid_policy_regex"]}
    for arg in extra:
        if not rex.fullmatch(arg):
            reasons.append("extra_arg_not_allowed")
    if reasons:
        return {"ok": False, "decision": "block", "server_id": event["server_id"], "normalized": {"executable": event["executable"], "argv": argv}, "reasons": sorted(set(reasons))}
    return {"ok": True, "decision": "allow_spawn", "server_id": event["server_id"], "normalized": {"executable": event["executable"], "argv": argv}, "constraints": ["shell=false", "exact-server-contract"]}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--event", required=True)
    ap.add_argument("--policy", required=True)
    args = ap.parse_args()
    try:
        result = evaluate(load_json(args.event), load_json(args.policy))
    except ValueError as exc:
        print(json.dumps({"ok": False, "decision": "block", "reasons": [str(exc)]}))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3

if __name__ == "__main__":
    raise SystemExit(main())
