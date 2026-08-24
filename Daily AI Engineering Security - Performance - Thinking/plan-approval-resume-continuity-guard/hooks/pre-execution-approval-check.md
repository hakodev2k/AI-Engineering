# Hook: Pre-Execution Approval Continuity Check

## Trigger
Before the first side effect after plan approval and before every resumed execution phase after a lifecycle transition.

## Preconditions
Current plan file, durable receipt, task ID, workspace revision, intended phase, and policy are available.

## Action
Run the deterministic receipt guard. Never substitute conversation history for a missing receipt.

## Script/command
`python scripts/plan_receipt_guard.py --plan PLAN.md --receipt RECEIPT.json --task-id TASK_ID --workspace-revision REV --phase PHASE --policy config/policy.json`

## Expected result
Exit 0 with `status: VALID` and no findings.

## Failure behavior
Exit 2 transitions to `AWAITING_APPROVAL` and blocks side effects. Exit 3 blocks on malformed/system state and requires operator correction. Do not auto-approve or retry indefinitely.

## Blocks completion
Yes.