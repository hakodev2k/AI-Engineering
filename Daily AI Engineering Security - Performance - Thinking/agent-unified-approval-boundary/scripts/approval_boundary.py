#!/usr/bin/env python3
import argparse, hashlib, json, sys, time, hmac
from pathlib import Path

SECRET = b"development-only-uab-key"


def stable(obj):
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def arg_hash(args):
    return hashlib.sha256(stable(args).encode()).hexdigest()


def op_digest(req):
    core = {
        "actor": req.get("actor"),
        "parent_task": req.get("parent_task"),
        "capability": req.get("capability"),
        "target": req.get("target"),
        "arguments_sha256": arg_hash(req.get("arguments", {})),
    }
    return hashlib.sha256(stable(core).encode()).hexdigest(), core


def classify(req):
    cap = req.get("capability", "unknown")
    if not cap or cap == "unknown": return "unknown"
    if cap.startswith(("production.", "identity.", "credential.")): return "production_change" if cap.startswith("production.") else "credential_or_identity"
    if cap in {"filesystem.delete_recursive", "remote.shell_destructive"}: return "destructive_local"
    if cap.startswith(("external.", "remote.write", "repository.write")): return "external_write"
    if cap.startswith(("read.", "filesystem.read", "search.")): return "read_only"
    if cap.startswith(("filesystem.write", "local.add")): return "additive_local"
    return req.get("risk", "unknown")


def load(path):
    with open(path, encoding="utf-8") as f: return json.load(f)


def sign(payload):
    raw = stable(payload).encode()
    return hmac.new(SECRET, raw, hashlib.sha256).hexdigest()


def verify_token(token, core):
    if not isinstance(token, dict) or token.get("sig") != sign(token.get("payload", {})): return False
    p = token["payload"]
    if p.get("expires_at", 0) < int(time.time()): return False
    for k in ("actor", "parent_task", "capability", "target", "arguments_sha256"):
        if p.get(k) != core.get(k): return False
    return True


def decide(policy, req):
    required = ["actor", "parent_task", "capability", "target"]
    if any(not req.get(x) for x in required): return {"decision":"DENY", "reason":"missing_identity_or_operation_field"}
    digest, core = op_digest(req)
    risk = classify(req)
    action = policy.get("risk_levels", {}).get(risk, policy.get("default_decision", "deny"))
    result = {"operation_digest": digest, "risk": risk}
    if action == "allow": result.update(decision="ALLOW", reason="policy_allow")
    elif action == "deny": result.update(decision="DENY", reason="policy_deny")
    elif verify_token(req.get("approval_token"), core): result.update(decision="ALLOW", reason="valid_scoped_approval")
    else: result.update(decision="REQUIRE_APPROVAL", reason="approval_required")
    return result


def make_token(req, ttl):
    _, core = op_digest(req)
    payload = dict(core)
    payload["expires_at"] = int(time.time()) + ttl
    return {"payload": payload, "sig": sign(payload)}


def cmd_inventory(args):
    reg = load(args.registry)
    bad=[]
    for a in reg.get("adapters", []):
        side = a.get("side_effecting", True)
        ok = (not side) or a.get("mediated") is True
        print(json.dumps({"name":a.get("name"),"transport":a.get("transport"),"capability":a.get("capability"),"covered":ok}))
        if not ok: bad.append(a.get("name"))
    return 2 if bad else 0


def main():
    p=argparse.ArgumentParser()
    sp=p.add_subparsers(dest="cmd", required=True)
    d=sp.add_parser("decide"); d.add_argument("--policy", required=True); d.add_argument("--request", required=True)
    t=sp.add_parser("token"); t.add_argument("--request", required=True); t.add_argument("--ttl", type=int, default=300)
    i=sp.add_parser("inventory"); i.add_argument("--registry", required=True)
    a=p.parse_args()
    try:
        if a.cmd=="decide": print(json.dumps(decide(load(a.policy), load(a.request)), indent=2)); return 0
        if a.cmd=="token": print(json.dumps(make_token(load(a.request), a.ttl), indent=2)); return 0
        return cmd_inventory(a)
    except (OSError, ValueError, json.JSONDecodeError) as e:
        print(json.dumps({"decision":"DENY","reason":"boundary_error","error":str(e)}), file=sys.stderr); return 2

if __name__ == "__main__": raise SystemExit(main())
