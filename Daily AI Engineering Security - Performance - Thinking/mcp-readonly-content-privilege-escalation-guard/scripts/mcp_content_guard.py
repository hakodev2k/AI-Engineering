#!/usr/bin/env python3
import argparse, hashlib, json, sys
from pathlib import Path

def load(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        raise ValueError(f"cannot read {path}: {e}")

def evaluate(event, policy):
    reasons=[]
    text=event.get("content")
    if not isinstance(text, str):
        return {"ok":False,"decision":"block","reasons":["content_not_string"]}

    origin=event.get("origin","unknown")
    trusted=origin in set(policy.get("trusted_origins",[]))
    provenance="trusted" if trusted else "untrusted"

    if len(text)>int(policy.get("max_untrusted_chars",12000)) and not trusted:
        reasons.append("untrusted_content_size_exceeded")

    low=text.casefold()
    for pat in policy.get("deny_patterns",[]):
        if str(pat).casefold() in low:
            reasons.append("suspicious_instruction:"+str(pat))

    requested=set(event.get("requested_tools",[]))
    privileged=set(policy.get("privileged_tools",[]))
    crossing=bool(requested & privileged) and not trusted

    if crossing and not policy.get("allow_untrusted_text_to_authorize_tools",False):
        if event.get("tool_authorization_source") != "trusted-policy":
            reasons.append("untrusted_content_cannot_authorize_privileged_tool")

    if crossing and policy.get("require_human_approval_for_untrusted_to_privileged",True):
        if not event.get("human_approved",False):
            reasons.append("human_approval_required_for_privilege_crossing")

    digest=hashlib.sha256(text.encode("utf-8")).hexdigest()
    ok=not reasons
    return {
      "ok":ok,
      "decision":"allow-data-only" if ok else "quarantine",
      "provenance":provenance,
      "content_sha256":digest,
      "requested_privileged_tools":sorted(requested & privileged),
      "reasons":sorted(set(reasons))
    }

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--event", required=True)
    ap.add_argument("--policy", required=True)
    args=ap.parse_args()
    try:
        result=evaluate(load(args.event), load(args.policy))
    except Exception as e:
        print(str(e), file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3

if __name__=="__main__":
    raise SystemExit(main())
