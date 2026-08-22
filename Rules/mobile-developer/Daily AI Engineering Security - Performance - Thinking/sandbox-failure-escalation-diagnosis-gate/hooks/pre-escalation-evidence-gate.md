# Hook: Pre-escalation Evidence Gate

## Trigger
Immediately before scheduling a retry with broader sandbox/permission scope or invoking an approval reviewer due to a prior sandbox failure.

## Preconditions
A structured diagnosis event exists with failure signature, facts, evidence, effective boundary, and proposed decision.

## Action
Append the proposed decision to the escalation trace and run the deterministic checker.

## Command
`python3 scripts/escalation_trace_checker.py escalation-events.jsonl --max-per-signature 1`

## Expected result
Exit 0: every escalation has evidence of a verified boundary crossing and no failure signature is escalated repeatedly.

## Failure behavior
Exit 2 blocks because trace/configuration is malformed. Exit 3 blocks because evidence/loop rules are violated. Route to `workflows/diagnose-before-escalate.md` rather than weakening permissions.

## Blocking
Yes. Human/operator override may reset the per-signature budget only after reviewing the evidence and risk.