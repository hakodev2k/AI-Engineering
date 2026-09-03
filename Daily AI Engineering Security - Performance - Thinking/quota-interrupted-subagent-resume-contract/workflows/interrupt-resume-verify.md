# Workflow: Interrupt → Resume → Verify

## Trigger
A child agent terminates before terminal completion because of quota, rate limit, runtime failure, or restart.

## Goal
Recover verified progress without replaying completed external effects.

## Inputs
Task/checkpoint IDs, current inputs, checkpoint, policy, effect ledger.

## Baseline
Capture completed phases, completed/unknown effects, calls already paid for, and expected remaining work.

## Context
Facts and evidence only; unresolved assumptions are explicit.

## Stages
1. **Observe** — classify interruption and snapshot logs.
2. **Measure baseline** — count completed phases/effects and calculate input fingerprint.
3. **Diagnose** — identify missing child state and unknown outcomes.
4. **Hypothesis** — identify exact safe resume phase.
5. **Preflight** — run blocking resume contract hook.
6. **Resume** — continue only remaining work.
7. **Measure again** — count repeated calls/effects and recovery latency.
8. **Independent verify** — Recovery Verifier reviews outputs and ledger.
9. **Complete** only after verifier approval.

## Responsible agent
Workflow coordinator; Recovery Verifier owns final verification.

## Tools
Checkpoint store, logs, `scripts/check_resume_contract.py`, target status APIs, tests.

## Outputs
Resume decision, recovered artifacts, metrics, final verification decision.

## Checkpoints
Before resume and after each external write.

## Metrics
Duplicate effects MUST equal 0. Retry attempts <= 2. Verification coverage MUST include all externally visible writes.

## Retry policy
At most 2 resume attempts. A second attempt requires new evidence or a changed failure cause.

## Stop conditions
Verified completion; fingerprint drift; unknown non-idempotent effect; retry budget exhausted.

## Failure path
Preserve checkpoint and logs, mark child blocked, and escalate. Do not restart from scratch if doing so may repeat effects.

## Definition of Done
Contract passes, resume executes within budget, duplicate effects are zero, acceptance tests pass, and independent verifier returns `VERIFIED`.
