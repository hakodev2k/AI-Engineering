# Skill: Structured Repair Feedback

## Purpose
Turn failed validation or tool evidence into bounded, actionable repair input instead of vague retry prompts.

## Trigger
Any failed acceptance predicate, required-call omission, tool error, test failure, or repeated attempt.

## Inputs
Latest attempt fingerprint, failed predicate IDs, observed values, expected values, tool/test diagnostics, admissible next actions, and remaining retry budget.

## Preconditions
Failure evidence is available and has not been overwritten by a new attempt.

## Allowed tools
Read-only logs, deterministic validators, test output parsers, diff inspection, and task-state APIs.

## Constraints
- MUST identify the failure location or predicate ID.
- MUST include observed evidence and expected condition.
- SHOULD list admissible repair alternatives when known.
- MUST NOT claim a root cause without supporting evidence.
- MUST NOT retry an identical fingerprint unless new external evidence justifies it.

## Procedure
1. Classify failure: tool error, predicate failure, missing coverage, contradiction, duplicate attempt, or unknown.
2. Extract the smallest decisive evidence.
3. Record observed versus expected state.
4. List allowed repair options supported by the environment.
5. State forbidden or already-failed options.
6. Require the next attempt to declare what observable state will change.
7. Decrement retry budget only when an actual repair attempt starts.

## Decision points
If all acceptance predicates already pass, return `stop-success` rather than repair. If the next attempt repeats a prior fingerprint without new evidence, stop or force hypothesis revision. Unknown failures may receive one diagnostic attempt before escalation.

## Expected output
A structured repair record with `failure_type`, `failed_ids`, `observed`, `expected`, `evidence`, `admissible_actions`, `forbidden_repeats`, and `remaining_attempts`.

## Metrics
Repair success rate, duplicate retries prevented, average repair attempts, and unsupported root-cause claims rejected.

## Verification
The independent verifier checks the next attempt against the recorded failure and acceptance contract.

## Failure handling
Maximum retries come from policy. When exhausted, preserve evidence and escalate; do not silently continue.

## Stop conditions
Validation passes, retry budget exhausted, repeated attempt detected, or safe autonomous repair is not possible.