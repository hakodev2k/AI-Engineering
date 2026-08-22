#!/usr/bin/env python3
"""Deterministic provenance/quarantine guard for agent memory JSON.

Commands:
  classify --entry entry.json --policy policy.json
  retrieve --store store.json --tenant TENANT --policy policy.json
  revoke --store store.json --source-id ID --policy policy.json --output out.json
  audit --store store.json --policy policy.json

Store format: JSON array or {"memories": [...]}. Exit 0 pass, 2 policy block,
3 invalid input/policy, 4 I/O failure. No network calls; no secrets required.
"""
from __future__ import annotations
import argparse, hashlib, json, re, sys
from pathlib import Path
from typing import Any


def load(path: str) -> Any:
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        raise RuntimeError(str(e)) from e


def save(path: str, value: Any) -> None:
    try:
        Path(path).write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    except OSError as e:
        raise RuntimeError(str(e)) from e


def memories(obj: Any) -> list[dict[str, Any]]:
    if isinstance(obj, list): return obj
    if isinstance(obj, dict) and isinstance(obj.get("memories"), list): return obj["memories"]
    raise ValueError("store must be an array or {memories:[...]}")


def digest(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def patterns(text: str, values: list[str]) -> list[str]:
    low = text.casefold()
    return sorted({p for p in values if p.casefold() in low})


def validate_entry(e: dict[str, Any], p: dict[str, Any]) -> list[str]:
    problems = []
    for f in p.get("required_fields", []):
        if f not in e or e[f] in (None, ""):
            problems.append(f"missing:{f}")
    if e.get("state") and e["state"] not in p.get("allowed_states", []):
        problems.append("invalid:state")
    lineage = e.get("parents", [])
    if lineage is not None and not isinstance(lineage, list):
        problems.append("invalid:parents")
    return problems


def classify(e: dict[str, Any], p: dict[str, Any]) -> dict[str, Any]:
    problems = validate_entry(e, p)
    if problems and p.get("fail_closed_on_missing_provenance", True):
        return {"decision":"quarantined", "reason_codes":problems, "trust_score":0}
    text = str(e.get("content", ""))
    severe = patterns(text, p.get("quarantine_patterns", []))
    restricted = patterns(text, p.get("restricted_patterns", []))
    base = int(p.get("source_trust_scores", {}).get(e.get("source_trust"), 0))
    reasons: list[str] = []
    if severe:
        reasons += ["pattern:quarantine:" + x for x in severe]
        state = "quarantined"
    elif restricted:
        reasons += ["pattern:restricted:" + x for x in restricted]
        state = "restricted"
    else:
        state = "trusted" if base >= int(p.get("minimum_retrieval_trust", 50)) else "restricted"
        if state == "restricted": reasons.append("source:low-trust")
    return {"decision":state,"reason_codes":reasons,"trust_score":base,"content_sha256":digest(text)}


def retrieval(store: list[dict[str, Any]], tenant: str, p: dict[str, Any]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    allowed, blocked = [], []
    min_trust = int(p.get("minimum_retrieval_trust", 50))
    allowed_states = set(p.get("retrieval_allowed_states", []))
    for e in store:
        c = classify(e, p)
        state = e.get("state") or c["decision"]
        reasons = []
        if e.get("tenant") != tenant: reasons.append("tenant-mismatch")
        if state not in allowed_states: reasons.append("state-not-retrievable")
        if c["trust_score"] < min_trust: reasons.append("trust-below-threshold")
        row = {"id":e.get("id"),"state":state,"trust_score":c["trust_score"],"reason_codes":reasons or c["reason_codes"]}
        (allowed if not reasons else blocked).append(row)
    return allowed, blocked


def descendants(store: list[dict[str, Any]], source_id: str) -> set[str]:
    revoked = {str(e.get("id")) for e in store if e.get("source_id") == source_id}
    changed = True
    while changed:
        changed = False
        for e in store:
            eid = str(e.get("id"))
            if eid in revoked: continue
            parents = {str(x) for x in e.get("parents", [])}
            if parents & revoked:
                revoked.add(eid); changed = True
    return revoked


def audit(store: list[dict[str, Any]], p: dict[str, Any]) -> list[str]:
    problems: list[str] = []
    ids: set[str] = set()
    for e in store:
        eid = str(e.get("id", ""))
        if not eid: problems.append("entry-without-id")
        if eid in ids: problems.append(f"duplicate-id:{eid}")
        ids.add(eid)
        problems += [f"{eid}:{x}" for x in validate_entry(e,p)]
        if e.get("content_sha256") and e["content_sha256"] != digest(str(e.get("content",""))):
            problems.append(f"digest-mismatch:{eid}")
        if e.get("state") in {"quarantined","revoked"} and e.get("retrieval_enabled") is True:
            problems.append(f"unsafe-retrieval-flag:{eid}")
    for e in store:
        for parent in e.get("parents", []):
            if str(parent) not in ids: problems.append(f"unknown-parent:{e.get('id')}:{parent}")
    return sorted(set(problems))


def main() -> int:
    ap=argparse.ArgumentParser(); sp=ap.add_subparsers(dest="cmd",required=True)
    c=sp.add_parser("classify"); c.add_argument("--entry",required=True); c.add_argument("--policy",required=True)
    r=sp.add_parser("retrieve"); r.add_argument("--store",required=True); r.add_argument("--tenant",required=True); r.add_argument("--policy",required=True)
    v=sp.add_parser("revoke"); v.add_argument("--store",required=True); v.add_argument("--source-id",required=True); v.add_argument("--policy",required=True); v.add_argument("--output",required=True)
    a=sp.add_parser("audit"); a.add_argument("--store",required=True); a.add_argument("--policy",required=True)
    args=ap.parse_args()
    try:
        p=load(args.policy)
        if args.cmd=="classify":
            out=classify(load(args.entry),p); print(json.dumps(out,indent=2)); return 2 if out["decision"]=="quarantined" else 0
        store=memories(load(args.store))
        if args.cmd=="retrieve":
            ok,bad=retrieval(store,args.tenant,p); print(json.dumps({"allowed":ok,"blocked":bad},indent=2)); return 0
        if args.cmd=="revoke":
            ids=descendants(store,args.source_id)
            for e in store:
                if str(e.get("id")) in ids:
                    e["state"]="revoked"; e["retrieval_enabled"]=False; e.setdefault("reason_codes",[]).append("revoked-by-lineage")
            save(args.output,{"memories":store}); print(json.dumps({"revoked_ids":sorted(ids)},indent=2)); return 0
        probs=audit(store,p); print(json.dumps({"ok":not probs,"problems":probs},indent=2)); return 2 if probs else 0
    except (RuntimeError,ValueError,TypeError) as e:
        print(f"error: {e}",file=sys.stderr); return 3

if __name__=="__main__": raise SystemExit(main())