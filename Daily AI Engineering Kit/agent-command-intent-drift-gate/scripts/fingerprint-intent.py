#!/usr/bin/env python3
import argparse
import hashlib
import json
import sys
from pathlib import Path


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def normalize(intent, policy):
    data = dict(intent)
    exe = data["executable"].strip()
    if not policy.get("normalization", {}).get("case_sensitive_executable", False):
        exe = exe.lower()
    data["executable"] = exe
    data["arguments"] = [" ".join(x.split()) if policy.get("normalization", {}).get("collapse_whitespace", True) else x for x in data.get("arguments", [])]
    data["target"] = data["target"].strip()
    data["environment"] = data["environment"].strip().lower()
    return data


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--intent", required=True)
    ap.add_argument("--policy", required=True)
    ap.add_argument("--output")
    ns = ap.parse_args()
    try:
        intent = json.load(open(ns.intent, encoding="utf-8"))
        policy = json.load(open(ns.policy, encoding="utf-8"))
        normalized = normalize(intent, policy)
        fingerprint = hashlib.sha256(canonical(normalized).encode("utf-8")).hexdigest()
        result = {"status": "ok", "fingerprint": fingerprint, "normalized_intent": normalized}
        if ns.output:
            Path(ns.output).write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(json.dumps({"status": "ok", "fingerprint": fingerprint}))
        return 0
    except Exception as exc:
        print(json.dumps({"status": "error", "error": str(exc)}))
        return 1


if __name__ == "__main__":
    sys.exit(main())
