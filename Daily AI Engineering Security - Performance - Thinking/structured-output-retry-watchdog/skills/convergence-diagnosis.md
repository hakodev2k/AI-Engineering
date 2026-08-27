# Skill: Structured-Output Convergence Diagnosis

## Purpose
Diagnose repeated schema-output failures using observable evidence rather than continued blind retries.

## Trigger
A structured-output validator rejects a payload, an empty payload repeats, or a worker has no validated progress.

## Inputs
Schema id, validation error, payload, retry history, last validated progress time, evidence already collected.

## Preconditions
The task's required schema and current stage are known. Existing evidence is retained.

## Required context
Facts needed to populate required fields, validator output, and retry state. Hidden chain-of-thought is neither requested nor required.

## Allowed tools
Read-only evidence inspection, schema validators, `scripts/retry_watchdog.py`, unit tests.

## Constraints
- MUST preserve collected evidence across serialization failure.
- MUST NOT treat tool activity as proof of progress.
- MUST NOT retry the same normalized failure beyond policy caps.

## Procedure
1. Canonicalize the failure with the watchdog signature.
2. Separate Facts, Missing fields, Validation evidence, and Assumptions.
3. Check whether missing fields can be grounded from already collected evidence.
4. If yes, record `recovery_evidence` naming those fields and allow one bounded retry.
5. If no, return a typed partial failure instead of fabricating values.
6. If a parallel stage can continue with verified peers, mark the worker failed-partial and unblock the barrier per policy.

## Decision points
Retry only when failure signature is below cap and a retry can change validated state. Recover when a new evidence-bearing correction exists. Fail-partial when the failure repeats or no-progress deadline expires. Stop when total stage budget is exhausted.

## Expected output
Facts; Evidence; Missing requirements; Failure signature; Decision; Retry count; Verification status.

## Metrics
Retries per signature, recovered outputs, fail-partial rate, avoided calls/tokens, downstream verification completion.

## Verification
Independent verifier confirms any recovered required field is supported by evidence and the retry budget was not exceeded.

## Failure handling
Preserve last valid evidence, emit typed failure, and escalate only the missing facts/requirements.

## Stop conditions
Same-signature cap reached, stage retry budget exhausted, no-progress deadline exceeded, or required field cannot be evidenced.
