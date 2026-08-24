#!/usr/bin/env python3
import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REQUIRED = {
    "schema_version", "task_id", "plan_sha256", "workspace_revision",
    "approval_id", "decision", "approved_at", "expires_at",
    "approver_type", "allowed_phases"
}

def load_json(path):
    try:
        value = json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot parse JSON {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value

def parse_time(value, field):
    if not isinstance(value, str) or not value:
        raise ValueError(f"{field} must be a non-empty ISO-8601 string")
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValueError(f"invalid {field}: {value}") from exc
    if dt.tzinfo is None:
        raise ValueError(f"{field} must include a timezone")
    return dt.astimezone(timezone.utc)

def plan_hash(path):
    try:
        return hashlib.sha256(Path(path).read_bytes()).hexdigest()
    except Exception as exc:
        raise ValueError(f"cannot read plan {path}: {exc}") from exc

def validate(receipt, policy, actual_hash, task_id, workspace_revision, phase, now):
    findings=[]
    missing=sorted(REQUIRED-set(receipt))
    if missing:
        findings.append({"code":"MISSING_FIELDS","detail":missing})
        return findings
    if set(receipt)-REQUIRED:
        findings.append({"code":"UNEXPECTED_FIELDS","detail":sorted(set(receipt)-REQUIRED)})
    expected_version=int(policy.get("schema_version",1))
    if receipt.get("schema_version") != expected_version:
        findings.append({"code":"SCHEMA_VERSION_MISMATCH"})
    if receipt.get("decision") != "approved":
        findings.append({"code":"NOT_APPROVED"})
    if receipt.get("task_id") != task_id:
        findings.append({"code":"TASK_ID_MISMATCH"})
    if receipt.get("plan_sha256") != actual_hash:
        findings.append({"code":"PLAN_HASH_MISMATCH"})
    if policy.get("require_workspace_match",True) and receipt.get("workspace_revision") != workspace_revision:
        findings.append({"code":"WORKSPACE_REVISION_MISMATCH"})
    if policy.get("require_human_approver",True) and receipt.get("approver_type") != "human":
        findings.append({"code":"NON_HUMAN_APPROVER"})
    phases=receipt.get("allowed_phases")
    if not isinstance(phases,list) or not phases or any(not isinstance(x,str) or not x for x in phases):
        findings.append({"code":"INVALID_ALLOWED_PHASES"})
    elif policy.get("require_phase_scope",True) and phase not in phases:
        findings.append({"code":"PHASE_NOT_APPROVED"})
    approved=parse_time(receipt.get("approved_at"),"approved_at")
    expires=parse_time(receipt.get("expires_at"),"expires_at")
    if expires < approved:
        findings.append({"code":"INVALID_TIME_ORDER"})
    if approved > now:
        findings.append({"code":"APPROVAL_FROM_FUTURE"})
    max_age=int(policy.get("max_receipt_age_seconds",86400))
    if max_age < 0:
        raise ValueError("max_receipt_age_seconds must be >= 0")
    if (now-approved).total_seconds() > max_age:
        findings.append({"code":"APPROVAL_TOO_OLD"})
    if expires < now:
        findings.append({"code":"APPROVAL_EXPIRED"})
    if not isinstance(receipt.get("approval_id"),str) or not receipt.get("approval_id"):
        findings.append({"code":"INVALID_APPROVAL_ID"})
    h=receipt.get("plan_sha256")
    if not isinstance(h,str) or len(h)!=64 or any(c not in "0123456789abcdef" for c in h):
        findings.append({"code":"INVALID_PLAN_HASH_FORMAT"})
    return findings

def main():
    ap=argparse.ArgumentParser(description="Validate durable plan approval before execution/resume")
    ap.add_argument("--plan",required=True)
    ap.add_argument("--receipt",required=True)
    ap.add_argument("--task-id",required=True)
    ap.add_argument("--workspace-revision",required=True)
    ap.add_argument("--phase",required=True)
    ap.add_argument("--policy",required=True)
    ap.add_argument("--now",help="ISO-8601 verification time; defaults to current UTC time")
    args=ap.parse_args()
    try:
        receipt=load_json(args.receipt)
        policy=load_json(args.policy)
        now=parse_time(args.now,"now") if args.now else datetime.now(timezone.utc)
        actual_hash=plan_hash(args.plan)
        findings=validate(receipt,policy,actual_hash,args.task_id,args.workspace_revision,args.phase,now)
        result={"status":"BLOCKED" if findings else "VALID","plan_sha256":actual_hash,"approval_id":receipt.get("approval_id"),"findings":findings}
        print(json.dumps(result,indent=2))
        return 2 if findings else 0
    except Exception as exc:
        print(f"plan-receipt-guard error: {exc}",file=sys.stderr)
        return 3

if __name__=="__main__":
    raise SystemExit(main())
