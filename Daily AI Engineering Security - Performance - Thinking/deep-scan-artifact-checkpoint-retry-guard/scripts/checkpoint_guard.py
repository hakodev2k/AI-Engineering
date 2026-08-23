#!/usr/bin/env python3
"""Validate required scan artifacts and gate expensive retry decisions."""
from __future__ import annotations
import argparse, hashlib, json, sys
from pathlib import Path


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def checkpoint(root: Path, scan_id: str, revision: str, phase: str, required: list[str]) -> tuple[int, dict]:
    artifacts, missing = {}, []
    for rel in required:
        p = (root / rel).resolve()
        try:
            p.relative_to(root.resolve())
        except ValueError:
            return 64, {"status":"invalid_input","error":f"artifact escapes root: {rel}"}
        if not p.is_file() or p.stat().st_size == 0:
            missing.append(rel)
        else:
            artifacts[rel] = {"sha256":sha256(p), "bytes":p.stat().st_size}
    payload = {"schema_version":1,"scan_id":scan_id,"revision":revision,"phase":phase,"status":"valid" if not missing else "blocked","artifacts":artifacts,"missing":missing}
    return (0 if not missing else 2), payload


def retry_gate(scope: str, terminal_failure: bool, approved: bool, quota_remaining: float, min_quota: float, same_failure_count: int) -> tuple[int, dict]:
    reasons=[]
    allowed=True
    if terminal_failure and scope == "full" and not approved:
        allowed=False; reasons.append("full retry after terminal failure requires explicit approval")
    if quota_remaining < min_quota:
        allowed=False; reasons.append("remaining quota below policy threshold")
    if same_failure_count >= 2:
        allowed=False; reasons.append("same deterministic failure repeated twice")
    return (0 if allowed else 3), {"status":"allowed" if allowed else "blocked","scope":scope,"reasons":reasons}


def main() -> int:
    p=argparse.ArgumentParser()
    sub=p.add_subparsers(dest="cmd", required=True)
    c=sub.add_parser("checkpoint")
    c.add_argument("--root", required=True); c.add_argument("--scan-id", required=True); c.add_argument("--revision", required=True); c.add_argument("--phase", required=True); c.add_argument("--required", action="append", default=[]); c.add_argument("--out")
    r=sub.add_parser("retry")
    r.add_argument("--scope", choices=["worker","phase","full"], required=True); r.add_argument("--terminal-failure", action="store_true"); r.add_argument("--approved", action="store_true"); r.add_argument("--quota-remaining", type=float, default=100.0); r.add_argument("--min-quota", type=float, default=10.0); r.add_argument("--same-failure-count", type=int, default=0)
    a=p.parse_args()
    if a.cmd == "checkpoint":
        root=Path(a.root).resolve()
        if not root.is_dir() or not a.required:
            result=(64,{"status":"invalid_input","error":"existing root and at least one --required are required"})
        else:
            result=checkpoint(root,a.scan_id,a.revision,a.phase,a.required)
        code,payload=result
        text=json.dumps(payload,indent=2,sort_keys=True)
        if a.out and code in (0,2):
            Path(a.out).write_text(text+"\n",encoding="utf-8")
        print(text)
        return code
    if not (0 <= a.quota_remaining <= 100 and 0 <= a.min_quota <= 100) or a.same_failure_count < 0:
        print(json.dumps({"status":"invalid_input"})); return 64
    code,payload=retry_gate(a.scope,a.terminal_failure,a.approved,a.quota_remaining,a.min_quota,a.same_failure_count)
    print(json.dumps(payload,indent=2,sort_keys=True)); return code

if __name__ == "__main__":
    raise SystemExit(main())