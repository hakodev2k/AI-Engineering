#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

def load_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"cannot_read:{exc}"}))
        raise SystemExit(2)

def evaluate(ledger, policy):
    reasons=[]
    cycle=int(ledger.get("cycle",-1))
    if cycle < 0:
        return {"ok": False, "decision": "stop", "reasons": ["invalid_cycle"]}
    criteria=ledger.get("criteria")
    history=ledger.get("history")
    if not isinstance(criteria,list) or not isinstance(history,list):
        return {"ok": False, "decision": "stop", "reasons": ["invalid_ledger_shape"]}
    statuses={str(c.get("id")): c.get("status") for c in criteria if c.get("id")}
    failed={cid for cid,status in statuses.items() if status=="failed"}
    terminal=set(policy.get("terminal_statuses",["passed","waived","blocked"]))
    remaining=sum(1 for status in statuses.values() if status not in terminal)
    if cycle > int(policy.get("max_cycles",8)):
        reasons.append("max_cycles_exceeded")
    max_new=int(policy.get("max_new_work_items_per_cycle",2))
    max_no_progress=int(policy.get("max_no_progress_cycles",2))
    no_progress=0
    prev_remaining=None
    for row in sorted(history, key=lambda x: int(x.get("cycle",-1))):
        rem=int(row.get("remaining",-1))
        new=int(row.get("new_work_items",0))
        progress=int(row.get("progress_events",0))
        if rem < 0 or new < 0 or progress < 0:
            reasons.append("invalid_history_value")
            continue
        if new > max_new:
            reasons.append(f"new_work_cap_exceeded:cycle={row.get('cycle')}")
        if new > 0:
            ids=set(map(str,row.get("new_work_criterion_ids",[])))
            if policy.get("require_failed_criterion_for_new_work",True) and not (ids & failed):
                reasons.append(f"unjustified_new_work:cycle={row.get('cycle')}")
        no_progress = no_progress + 1 if progress == 0 else 0
        if no_progress > max_no_progress:
            reasons.append(f"no_progress_limit_exceeded:cycle={row.get('cycle')}")
        if prev_remaining is not None and rem > prev_remaining and new == 0:
            reasons.append(f"remaining_increased_without_new_work:cycle={row.get('cycle')}")
        prev_remaining=rem
    if prev_remaining is not None and remaining > prev_remaining:
        reasons.append("current_remaining_exceeds_last_recorded")
    all_terminal = bool(statuses) and all(status in terminal for status in statuses.values())
    if all_terminal and not reasons:
        return {"ok": True, "decision": "complete", "remaining": 0, "reasons": [], "snapshot_required": False}
    if reasons:
        return {"ok": False, "decision": "publish_snapshot_and_stop" if policy.get("require_snapshot_on_stop",True) else "stop", "remaining": remaining, "reasons": sorted(set(reasons)), "snapshot_required": bool(policy.get("require_snapshot_on_stop",True))}
    return {"ok": True, "decision": "continue_bounded", "remaining": remaining, "reasons": [], "snapshot_required": False}

def main():
    parser=argparse.ArgumentParser(description="Detect non-converging long-running agent work.")
    parser.add_argument("--ledger", required=True)
    parser.add_argument("--policy", required=True)
    args=parser.parse_args()
    result=evaluate(load_json(args.ledger), load_json(args.policy))
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3

if __name__=="__main__":
    raise SystemExit(main())
