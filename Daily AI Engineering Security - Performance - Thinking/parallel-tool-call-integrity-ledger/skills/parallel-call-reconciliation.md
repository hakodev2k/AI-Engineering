# Skill: Parallel Tool Call Reconciliation
## Purpose
Prove each parallel call has one observable lifecycle and terminal outcome.
## Trigger
Parallel response, approval resume, missing result, empty iteration, duplicate suspicion.
## Inputs
Provider call IDs, batch IDs, effect classes, dispatcher events, approvals, results.
## Preconditions
Stable call IDs are preserved or mapped.
## Required context
Observable lifecycle evidence only; hidden chain-of-thought is not requested.
## Allowed tools
Logs, trace viewers, ledger script, schema validators.
## Constraints
MUST distinguish generated, dispatched, executed, acknowledged, terminal. MUST NOT auto-replay ambiguous mutations.
## Procedure
1. Record provider calls as declared.
2. Record dispatch/approval transitions.
3. Record exactly one terminal result.
4. Reconcile before next model turn.
5. Investigate orphan, duplicate, pending, identity drift.
6. Retry once only for proven read-only/idempotent absence.
7. Escalate ambiguous mutations.
8. Independently verify.
## Decision points
Complete advances; wait pauses; block stops progression.
## Expected output
Facts, evidence, batch decision, violations, recovery class, verification status.
## Metrics
Missing/duplicate/orphan rates, ambiguous mutations, attempts, rework.
## Verification
Synthetic parallel fixtures and side-effect-disabled trace replay.
## Failure handling
Fail closed on identity drift or ambiguous mutation.
## Stop conditions
Two reconciliation passes maximum; immediate stop on possible duplicate side effect.
