# Hook: Pre-Model-Call Budget Check

## Trigger
Immediately before any parent, subagent, retry, hook-triggered, or repair model call.

## Preconditions
The current task ID and usage ledger are available. A budget policy is loaded. Child calls have a parent reservation where applicable.

## Action
1. Append the latest completed usage event to the ledger.
2. Validate event fields and lineage.
3. Run the deterministic budget guard.
4. Interpret exit code: 0 allow, 3 warn, 4 stop, 2 invalid.
5. On warning, emit a structured warning but allow the current call only if it does not itself exceed a known remaining reservation.
6. On stop/invalid, do not issue the model request.

## Script/command
`python3 scripts/budget_guard.py <usage-ledger.jsonl> --policy config/budget-policy.json`

## Expected result
A machine-readable decision with metrics, warnings, and stop reasons.

## Failure behavior
Exit 4 blocks execution and records a budget-stop audit event. Exit 2 blocks unattended execution because usage enforcement cannot be trusted. A human may inspect telemetry and explicitly resume after correcting policy/telemetry.

## Blocks completion
Yes for `stop` or `invalid`. A warning alone does not block completion.
