# Workflow: Measure, Diagnose, Verify Token Accounting

## Trigger
Unexpected context utilization, premature/repeated compaction, token counter jumps, or any change to token-accounting/compaction code.

## Goal
Ensure automatic context management uses a current, semantically correct occupancy measurement.

## Inputs
Provider usage, transcript revision, context window, accounting snapshot, compaction history, policy, and regression fixtures.

## Baseline
Record false-compaction rate, number of compactions per long session, occupancy vs latest provider-input difference, and rate of snapshots with unknown semantic source.

## Context
Use accounting metadata and minimized transcript evidence. Separate facts from assumptions.

## Stages
1. **Observe** — capture token fields before changing state.
2. **Measure baseline** — calculate occupancy ratio from the actual metric currently driving compaction.
3. **Diagnose** — classify last-input, cumulative usage, cache usage, estimate, stale post-compaction state, or unknown.
4. **Form hypothesis** — specify one accounting transformation suspected of corrupting occupancy.
5. **Implement improvement** — separate typed fields and revision binding; do not merely increase thresholds.
6. **Measure again** — replay the original reproduction and synthetic multi-call fixtures.
7. **Improved?** — if no, revise the hypothesis at most twice; if yes, continue.
8. **Verify** — independent Accounting Verifier confirms invariants and post-compaction behavior.

## Responsible agent
Accounting/compaction implementation owner; independent Accounting Verifier performs final checks.

## Tools
`skills/token-accounting-diagnosis.md`, `scripts/accounting_guard.py`, `config/accounting-policy.json`, provider usage logs, and approved tokenizer/estimator.

## Outputs
Baseline, typed snapshot, invariant report, before/after comparison, regression evidence, and explicit Implemented/Measured/Verified status.

## Checkpoints
Before compaction, after transcript mutation, after compaction, after provider/model switch, and at final regression verification.

## Metrics
False compaction triggers, repeated-compaction rate, occupancy error, estimator error, stale-snapshot rejection rate, token usage per task, and context utilization.

## Retry policy
Maximum two diagnosis/implementation revisions after the initial attempt. Do not repeatedly compact the same session as a diagnostic retry.

## Stop conditions
Stop automation when metric semantics remain unknown, transcript revision cannot be bound, or measured evidence disagrees beyond configured tolerance after two revisions.

## Failure path
Preserve evidence, block automatic destructive compaction for the affected snapshot/session, use non-destructive operator recovery, and escalate to runtime owner.

## Verification
Replay cumulative-run, cache-mixing, stale-revision, valid-current-input, over-window, and post-compaction fixtures.

## Definition of Done
Current occupancy has a documented source and revision; cumulative usage is separate; automatic compaction is blocked on integrity failure; before/after metrics are recorded; regressions pass; independent verification has no blocking findings.