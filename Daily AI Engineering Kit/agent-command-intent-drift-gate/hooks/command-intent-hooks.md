# Command Intent Hooks

## Hook: pre-command-plan
**Trigger:** before constructing a write/destructive tool call.  
**Preconditions:** task outcome known; command not executed.  
**Action:** create/update the command intent contract and fingerprint.  
**Command:** `python scripts/fingerprint-intent.py --intent <intent.json> --policy config/intent-policy.json --output <fingerprint.json>`  
**Expected result:** status `ok` and a deterministic fingerprint.  
**Failure behavior:** block planning handoff.  
**Blocks execution:** yes.

## Hook: pre-dispatch-drift-check
**Trigger:** immediately after exact execution arguments/target/environment are materialized.  
**Preconditions:** intent and execution request exist.  
**Action:** compare reviewed intent against exact execution request.  
**Command:** `python scripts/evaluate-command-drift.py --intent <intent.json> --execution <execution.json> --policy config/intent-policy.json --output <decision.json>`  
**Expected result:** `pass`, or `review-required` with a new review path.  
**Failure behavior:** `blocked` stops dispatch; `review-required` pauses for review; runtime error allows one transient retry.  
**Blocks execution:** yes.

## Hook: approval-boundary
**Trigger:** intent maps to an action in `approval_required_actions`.  
**Preconditions:** current intent fingerprint exists.  
**Action:** stop and obtain explicit human approval bound to the exact current intent.  
**Expected result:** approved review/approval evidence references the current intent fingerprint.  
**Failure behavior:** no command dispatch.  
**Blocks execution:** yes.

## Hook: pre-dispatch-final-gate
**Trigger:** immediately before tool invocation.  
**Preconditions:** current intent, execution request, decision and required review exist.  
**Action:** run `scripts/verify-final-gate.py --intent <intent.json> --execution <execution.json> --decision <decision.json> --policy config/intent-policy.json --actor <actor> [--review <review.json>]`.  
**Expected result:** status `verified`.  
**Failure behavior:** stop; do not mutate arguments to bypass the gate.  
**Blocks execution:** yes.

## Hook: post-command-evidence
**Trigger:** after the exact command/tool action returns.  
**Preconditions:** dispatch occurred.  
**Action:** preserve execution timestamp, resolved target, tool result, exit/result status, and observable side-effect evidence. Verify business outcome separately.  
**Expected result:** execution evidence and outcome verification are distinguishable.  
**Failure behavior:** if outcome is unknown, report unknown and reconcile rather than claiming success.  
**Blocks completion:** yes.

## Hook: command-context-change
**Trigger:** executable, arguments, target, environment, adapter, policy, credentials, side-effect classification, or execution plan changes after review.  
**Action:** invalidate previous drift decision/review as applicable and restart from drift evaluation or planning.  
**Failure behavior:** no reuse of stale approval.  
**Blocks execution:** yes.
