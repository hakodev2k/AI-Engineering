# Workflow: Diagnose and Recover
**Trigger:** structured-output validation failure or empty repeated payload.  
**Goal:** recover only when observable evidence can change the next attempt.

## Inputs
Schema, payload, validator error, retry history, evidence set, progress timestamp.

## Baseline
Record initial validation error, failure signature, retry count, last valid artifact, tokens/tool calls consumed.

## Stages
1. Observe validator failure.
2. Run watchdog to obtain signature and bounded decision.
3. Diagnose missing/invalid required fields from validator evidence.
4. Form one explicit recovery hypothesis: which evidenced field/value will change and why.
5. If decision is `recover`, collect only the missing evidence and attach `recovery_evidence`.
6. Retry once within budget.
7. Measure whether validation state changed.
8. If not improved, fail-partial or stop according to watchdog.
9. Hand recovered output to independent verifier.

## Responsible agents
Implementer performs recovery; Convergence Verifier performs independent validation.

## Tools
Schema validator, `scripts/retry_watchdog.py`, tests, read-only evidence inspection.

## Outputs
Validated output or typed fail-partial/stop record with preserved evidence.

## Checkpoints
Before first retry, after recovery evidence, after post-retry validation.

## Metrics
Retries/signature, wall time, tool/model calls, validation success, evidence coverage.

## Retry policy
Maximum values come from `config/policy.json`; no loop may exceed them.

## Stop conditions
Same-signature cap, stage retry budget, no-progress deadline, unsupported required field.

## Failure path
Return partial evidence and block any conclusion requiring missing fields.

## Verification
Independent Convergence Verifier must pass recovered outputs.

## Definition of Done
Bounded decision recorded; output validated or typed failure emitted; no unsupported field introduced; metrics captured.
