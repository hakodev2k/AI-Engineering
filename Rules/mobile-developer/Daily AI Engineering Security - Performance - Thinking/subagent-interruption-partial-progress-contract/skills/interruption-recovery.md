# Skill: Interruption Recovery

## Purpose
Recover safely from a child-agent interruption without losing completed work, duplicating side effects, or making unsupported claims.

## Trigger
Any child exits without clean verified completion.

## Inputs
Partial-progress envelope, parent task contract, workspace/resource state, evidence pointer, and retry policy.

## Preconditions
The envelope passes deterministic validation or is explicitly classified invalid/unknown.

## Required context
Expected deliverables, destructive/external actions, idempotency semantics, and verification commands.

## Allowed tools
Envelope validator, read-only transcript/event inspection, workspace diff/status, test commands, external-resource read APIs where authorized.

## Constraints
No hidden chain-of-thought. Do not replay a side-effecting action until current state is verified. Do not treat a missing transcript as proof of no work.

## Procedure
1. Validate envelope with `scripts/validate_partial_progress.py`.
2. Classify termination cause and whether human initiation is evidenced.
3. Read the compact ledger/evidence pointer only as needed to confirm last durable checkpoint and side effects.
4. Compare declared changed resources with current state.
5. Determine recovery mode: `resume`, `verify_first`, `safe_retry`, `escalate`, or `stop`.
6. If side effects or uncertain state exist, verify them before any retry.
7. Build a concise handoff containing facts, unknowns, completed checkpoints, incomplete step, and required next action.
8. Retry at most the configured number of times, carrying forward verified partial progress.
9. Independently verify the final deliverable before parent completion.

## Decision points
- No tool activity and no side effects: safe retry may be allowed.
- Tool activity but no known external effects: inspect workspace and resume from last checkpoint.
- External/destructive effect or uncertain response: verify first; require approval if a repeat could be dangerous.
- Cause unknown after evidence inspection: escalate rather than guess.

## Expected output
Recovery decision plus verified facts/unknowns and a bounded continuation plan.

## Metrics
Valid-envelope coverage, duplicate-action rate, recovery success rate, unsupported parent claims, time/tokens lost to rework.

## Verification
Final state is compared with the original task contract and partial-progress ledger; repeated actions are accounted for.

## Failure handling
Two recovery retries maximum by default. After exhaustion or unresolved state ambiguity, stop and escalate.

## Stop conditions
Verified completion, explicit human stop, unsafe/unknown state requiring escalation, or retry budget exhausted.
