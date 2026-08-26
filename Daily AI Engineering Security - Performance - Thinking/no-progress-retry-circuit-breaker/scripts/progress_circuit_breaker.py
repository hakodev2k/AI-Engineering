#!/usr/bin/env python3
"""Deterministic retry/no-progress circuit breaker for agent attempt ledgers."""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

QUALIFYING_PROGRESS = {"file_change", "test_state_change", "checkpoint", "new_evidence", "tool_result_changed"}

def load(path: str) -> list[dict]:
    rows = []
    try:
        for i, line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(), 1):
            if not line.strip():
                continue
            obj = json.loads(line)
            for key in ("retry_key", "attempt", "failure_signature", "events", "tokens"):
                if key not in obj:
                    raise ValueError(f"line {i}: missing {key}")
            rows.append(obj)
    except Exception as exc:
        if isinstance(exc, ValueError): raise
        raise ValueError(f"cannot read ledger: {exc}") from exc
    return rows

def evaluate(rows: list[dict], max_identical_failures: int = 2, max_no_progress_attempts: int = 2,
             max_tokens_per_key: int = 200000) -> dict:
    grouped: dict[str, list[dict]] = {}
    for row in rows:
        if not isinstance(row["attempt"], int) or row["attempt"] < 1:
            raise ValueError("attempt must be a positive integer")
        if not isinstance(row["tokens"], int) or row["tokens"] < 0:
            raise ValueError("tokens must be a non-negative integer")
        if not isinstance(row["events"], list):
            raise ValueError("events must be a list")
        grouped.setdefault(str(row["retry_key"]), []).append(row)
    blocks=[]
    for key, attempts in grouped.items():
        attempts=sorted(attempts,key=lambda x:x["attempt"])
        tokens=sum(a["tokens"] for a in attempts)
        progress=[bool(QUALIFYING_PROGRESS & set(a["events"])) for a in attempts]
        no_progress_streak=0
        max_streak=0
        for p in progress:
            no_progress_streak = 0 if p else no_progress_streak + 1
            max_streak=max(max_streak,no_progress_streak)
        sig_counts={}
        for a in attempts:
            sig=str(a["failure_signature"])
            if sig:
                sig_counts[sig]=sig_counts.get(sig,0)+1
        repeated=max(sig_counts.values(), default=0)
        reasons=[]
        if repeated > max_identical_failures: reasons.append("identical_failure_budget_exceeded")
        if max_streak > max_no_progress_attempts: reasons.append("no_progress_attempt_budget_exceeded")
        if tokens > max_tokens_per_key: reasons.append("token_budget_exceeded")
        if reasons:
            blocks.append({"retry_key":key,"reasons":reasons,"attempts":len(attempts),"tokens":tokens,
                           "max_no_progress_streak":max_streak,"max_identical_failure_count":repeated})
    return {"status":"block" if blocks else "pass","blocked_keys":blocks,"keys_evaluated":len(grouped)}

def main() -> int:
    ap=argparse.ArgumentParser()
    ap.add_argument("ledger")
    ap.add_argument("--max-identical-failures",type=int,default=2)
    ap.add_argument("--max-no-progress-attempts",type=int,default=2)
    ap.add_argument("--max-tokens-per-key",type=int,default=200000)
    a=ap.parse_args()
    try:
        result=evaluate(load(a.ledger),a.max_identical_failures,a.max_no_progress_attempts,a.max_tokens_per_key)
    except ValueError as exc:
        print(str(exc),file=sys.stderr); return 2
    print(json.dumps(result,indent=2,sort_keys=True))
    return 0 if result["status"]=="pass" else 3

if __name__=="__main__":
    raise SystemExit(main())
