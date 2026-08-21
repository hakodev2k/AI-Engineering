# Hook — Pre Wait Budget Check

## Trigger
Before issuing or scheduling another status poll for a long-running process/session.

## Preconditions
Current process state, poll count, no-progress count, last wait interval, estimated input tokens per model poll, accumulated wait-token estimate, progress/terminal event flags, and deliverable-completion flag are available.

## Action
Run:

`python scripts/wait_budget_guard.py wait-state.json --policy config/wait-policy.json --strict`

This hook belongs outside the model reasoning loop when possible. Its purpose is to decide deterministically whether another wait is allowed and when it should occur.

## Expected result
Exit `0` with one of `wait_runtime`, `collect_result`, or `resume_model`. Output includes next wait duration, budget counters, and reasons.

## Failure behavior
- Exit `2`: invalid state/config; block automatic polling and reconcile state.
- Exit `3`: budget exhausted or unsafe continuation; block automatic polling and escalate/reconcile.
- Unexpected error: do not enter an unbounded polling fallback.

## Blocking
Yes for another automatic poll. The hook does not automatically kill the process. Cancellation remains governed by policy and required human approval.

## Verification
Test terminal, progress, no-progress, budget-exhaustion, and post-deliverable scenarios. A terminal event must result in `collect_result` and never another wait.
