# Workflow: Retry-Control Failure Recovery

## Trigger
Invalid policy/event, unknown error class, exhausted budget, inconsistent nested retry state, or unsuccessful optimization.

## Goal
Reach a deterministic safe terminal state without silently looping or discarding evidence.

## Inputs
Current retry episode, policy, trace evidence, nested retry counters, task state.

## Baseline
Last valid verdict and last observable progress/state change.

## Stages
1. Freeze automatic retries.
2. Persist sanitized error class/fingerprint, attempts, elapsed time, and state-change evidence.
3. Attempt classification correction once from authoritative provider/tool documentation or trace evidence.
4. If classification is valid but policy integration is wrong, correct integration once.
5. Re-run the gate.
6. If still STOP/invalid, terminate the retry episode and escalate.

## Responsible agent
Recovery owner; Retry Verifier independently reviews any policy change.

## Tools
Read-only docs/traces, retry gate, tests.

## Outputs
Terminal verdict, evidence, any corrected classification/policy, escalation record.

## Checkpoints
Security/idempotency boundary before any resumed retry; maximum-attempt accounting after nested retries are reconciled.

## Metrics
Recovery attempts, added retry calls/time, terminal latency, final classification confidence from evidence.

## Retry policy
Maximum two recovery actions: one classification correction and one integration/policy correction.

## Stop conditions
Second failed recovery, conflicting evidence, high-risk unknown error, exhausted budget, or missing side-effect safety proof.

## Failure path
STOP and escalate. Do not raise budgets repeatedly.

## Verification
Independent replay confirms the corrected episode terminates or safely recovers within configured limits.

## Definition of Done
A deterministic terminal/retry verdict exists with evidence and no uncontrolled retry path remains.