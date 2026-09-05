#!/usr/bin/env python3
from __future__ import annotations
import argparse,json,sys
from datetime import datetime,timezone
from pathlib import Path


def load(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as e:
        raise ValueError(f"missing file: {path}") from e
    except json.JSONDecodeError as e:
        raise ValueError(f"invalid JSON in {path}: {e}") from e


def dt(value: str) -> datetime:
    try:
        x=datetime.fromisoformat(value.replace("Z","+00:00"))
    except Exception as e:
        raise ValueError(f"invalid datetime: {value}") from e
    if x.tzinfo is None:
        raise ValueError(f"datetime must include timezone: {value}")
    return x.astimezone(timezone.utc)


def validate(reg, policy, now):
    if not isinstance(reg,dict) or not isinstance(reg.get("quarantines"),list):
        raise ValueError("registry must contain quarantines array")
    if not isinstance(policy,dict) or not isinstance(policy.get("max_quarantine_days"),int):
        raise ValueError("policy missing max_quarantine_days")
    allowed=set(policy.get("allowed_statuses",[]))
    seen=set(); findings=[]; active=resolved=0
    for q in reg["quarantines"]:
        if not isinstance(q,dict): raise ValueError("quarantine entry must be object")
        required=("test_id","owner","reason","evidence","created_at","expires_at","status")
        missing=[k for k in required if not q.get(k)]
        if missing: raise ValueError(f"entry missing fields: {missing}")
        tid=q["test_id"]
        if tid in seen: findings.append({"kind":"duplicate_test_id","test_id":tid,"detail":"test_id appears more than once"})
        seen.add(tid)
        if q["status"] not in allowed: findings.append({"kind":"invalid_status","test_id":tid,"detail":f"status {q['status']} not allowed"})
        created,expires=dt(q["created_at"]),dt(q["expires_at"])
        if expires <= created: findings.append({"kind":"invalid_window","test_id":tid,"detail":"expires_at must be after created_at"})
        days=(expires-created).total_seconds()/86400
        if days > policy["max_quarantine_days"]:
            findings.append({"kind":"window_too_long","test_id":tid,"detail":f"quarantine window {days:.2f} days exceeds {policy['max_quarantine_days']}"})
        if q["status"]=="active":
            active+=1
            if expires <= now: findings.append({"kind":"expired","test_id":tid,"detail":f"expired at {q['expires_at']}"})
            if policy.get("require_owner",True) and not q["owner"].strip(): findings.append({"kind":"missing_owner","test_id":tid,"detail":"active quarantine requires owner"})
            if policy.get("require_evidence",True) and not q["evidence"].strip(): findings.append({"kind":"missing_evidence","test_id":tid,"detail":"active quarantine requires evidence"})
        else: resolved+=1
    return {"status":"fail" if findings else "pass","summary":{"active":active,"resolved":resolved,"blocking":len(findings)},"findings":findings}


def main():
    p=argparse.ArgumentParser(description="Validate flaky-test quarantine lifecycle")
    p.add_argument("--registry",required=True,type=Path)
    p.add_argument("--policy",required=True,type=Path)
    p.add_argument("--report",required=True,type=Path)
    p.add_argument("--now",help="ISO-8601 override for deterministic CI/tests")
    a=p.parse_args()
    try:
        now=dt(a.now) if a.now else datetime.now(timezone.utc)
        report=validate(load(a.registry),load(a.policy),now)
    except ValueError as e:
        print(f"validation error: {e}",file=sys.stderr); return 2
    a.report.parent.mkdir(parents=True,exist_ok=True)
    a.report.write_text(json.dumps(report,indent=2,sort_keys=True)+"\n",encoding="utf-8")
    if report["status"]=="fail":
        print(f"quarantine gate failed: {report['summary']['blocking']} blocking finding(s)",file=sys.stderr); return 1
    print(f"quarantine gate passed: {report['summary']}"); return 0

if __name__=="__main__": raise SystemExit(main())
