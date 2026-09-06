# Integrity Audit Skill

## Purpose
Determine whether an agent-evaluation result was produced without undeclared cross-run state, evaluator access, or untracked external communication.

## Trigger
Run before an evaluation starts, after any environment change, and before accepting a score.

## Inputs
- Evaluation manifest with `run_id` and allowed destinations.
- JSONL event log produced by the runner or network proxy.
- Optional map of destination owners and policy classes.
- Score artifact from an immutable evaluator.

## Preconditions
Telemetry collection is enabled and the evaluated agent cannot edit the verifier, event log, or evaluator.

## Required context
Task definition, collaboration policy, permitted services, evaluator-only resources, retry policy.

## Allowed tools
Read-only log access, policy files, deterministic verifier, immutable evaluator output.

## Constraints
Do not infer absence of access from missing logs. Do not expose hidden labels or evaluator secrets to the evaluated agent.

## Procedure
1. Confirm `run_id` is present and unique.
2. Establish the allowed external-state baseline from the manifest.
3. Validate every event schema and reject unattributed events.
4. Classify each read/write by destination and policy.
5. Flag writes to undeclared shared state.
6. Track write ownership by object key and flag later reads by a different run when collaboration is not allowed.
7. Flag evaluator-only access.
8. Compare the integrity verdict with the score artifact.
9. If violations exist, invalidate the result; retry at most twice in a fresh environment only after a documented remediation.
10. Hand the final report to an independent verifier.

## Decision points
- Missing telemetry: fail closed.
- Declared collaborative benchmark: apply declared collaboration rules instead of independence rules.
- Ambiguous destination: quarantine result for human review.

## Expected output
A machine-readable verdict plus violation records and a human-readable summary.

## Metrics
Unattributed event count, undeclared-write count, cross-run-read count, evaluator-resource access count, invalidated-result count, remediation attempts.

## Verification
The same event set MUST produce the same verdict. Negative tests MUST demonstrate detection of cross-run reads and evaluator-resource access.

## Failure handling
On parser or schema failure, return a blocking verifier error. Maximum remediation attempts: two. Escalate thereafter.

## Stop conditions
Stop successfully only when telemetry is complete, no blocking violation exists, and an independent verifier accepts the result.
