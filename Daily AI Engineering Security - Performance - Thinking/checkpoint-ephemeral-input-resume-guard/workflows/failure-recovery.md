# Workflow — Failure Recovery

## Trigger
A resumable task fails or a worker restarts with unfinished work.

## Goal
Resume only if the task's replay-critical inputs are recoverable and unchanged.

## Inputs
Checkpoint ID, task ID, replay contract, dispatch evidence, reconstructed payload.

## Baseline
Record current retry behavior, number of silent resumes, and whether input completeness is checked.

## Stages
1. **Observe** — capture failure and checkpoint identifiers.
2. **Measure baseline** — record dispatch digest and critical-field coverage.
3. **Diagnose** — locate each critical field's durability source.
4. **Form hypothesis** — identify missing reconstruction edges.
5. **Implement improvement** — persist or deterministically reconstruct missing data.
6. **Measure again** — run `scripts/replay_guard.py` on saved dispatch/resume evidence.
7. **Verify** — Recovery Verifier independently checks PASS.
8. **Complete** — allow resume only after verified PASS.

## Checkpoints
Before reconstruction, before resumed execution, after independent verification.

## Retry policy
Maximum 2 automatic reconstruction attempts. If still blocked, escalate once to a human and stop automation.

## Failure path
Preserve checkpoint and evidence; do not execute downstream tools; return a typed recovery-blocked state.

## Metrics
Coverage, block rate, mismatch rate, recovery latency, deterministic replay success.

## Definition of Done
Replay-critical coverage is 100%, validator passes, independent verifier passes, and no blocking issue remains.
