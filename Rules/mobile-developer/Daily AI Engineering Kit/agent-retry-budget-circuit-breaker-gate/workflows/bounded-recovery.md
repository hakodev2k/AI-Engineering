# Bounded Recovery Workflow

## Trigger
An agent tool call, build command, API request, CI action, or other operation fails.

## Entry conditions
Original evidence is preserved; policy validates; operation identity and read/write semantics are known.

## Stages
1. **Capture** — execution agent records status/exit code, timestamps, stderr/response tail and operation metadata.
2. **Classify** — Recovery Controller applies `skills/failure-classification.md`.
3. **Safety checkpoint** — if write outcome is unknown, reconcile; if dangerous repetition is possible, require human approval.
4. **Budget check** — block when attempt count reaches `max_attempts` or circuit is open.
5. **Delay** — use server retry hint when present; otherwise exponential backoff capped by policy with jitter.
6. **Retry** — run one attempt. Deterministic command retries may use `scripts/retry_gate.py` only when the command itself is known safe to repeat.
7. **Verify** — verify the intended postcondition, not merely exit code. Preserve attempt evidence.
8. **Complete or escalate** — success closes recovery; another transient failure returns to stage 2 while budget remains; all other failures stop.

## Checkpoints and approval
Human approval is mandatory before repeated production writes, destructive operations, permission/secret changes, deployments, or any non-idempotent action without proven deduplication.

## Retry rules
Maximum 3 attempts by default. Retry only transient failures. Preserve all evidence. After the final failed attempt, stop and escalate. No nested retry loop may reset the outer budget.

## Failure paths
Validation/permission/business-rule => stop. Environment => fix environment outside retry loop then restart as a new reviewed execution. Unknown-outcome write => reconcile or stop. Tool unavailable => preserve evidence and escalate.

## Definition of Done
Policy is valid; every attempt is recorded; no budget was reset; success postcondition is verified or failure is explicitly escalated; required approval exists; no unresolved duplicate-side-effect risk remains.
