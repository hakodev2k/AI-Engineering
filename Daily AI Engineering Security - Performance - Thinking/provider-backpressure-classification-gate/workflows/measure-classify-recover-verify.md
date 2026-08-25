# Workflow: Measure → Classify → Recover → Verify

## Trigger
Recurring 429/503/529 failures, ineffective retries, avoidable fallback, or capacity-related agent failures.

## Goal
Choose recovery behavior from evidence-rich failure class while reducing attempts, recovery latency, and retry bursts.

## Inputs
Request/error traces, provider metadata, fallback policy, concurrency state, and replay fixtures.

## Baseline
For representative failures, record status/code, attempts, delay sequence, total recovery time, fallback target, and final outcome.

## Context
Use `skills/backpressure-baseline-and-classification.md` and enforce `rules/recovery-policy.md`.

## Stages
1. **Observe/Measure** — capture baseline metrics and raw error metadata.
2. **Diagnose** — determine capacity scope and current retry ownership.
3. **Hypothesize** — predict which classification/action reduces amplification.
4. **Implement** — insert the classifier before retry/fallback and unify the cumulative budget.
5. **Measure again** — replay identical fixtures and compare metrics.
6. **Independent verification** — `subagents/performance-verifier.md` checks policy and constraints.
7. **Complete** — publish the decision contract and rollout metrics.

## Responsible agent
Runtime implementation owner for stages 1–5; independent verifier for stage 6.

## Tools
Trace/log analysis, replay harness, `scripts/backpressure_classifier.py`, existing metrics system.

## Outputs
Baseline, classification map, policy configuration, before/after comparison, verification verdict.

## Checkpoints
- CP1 raw status/code/Retry-After preserved.
- CP2 retry-capable layers identified.
- CP3 one cumulative budget established.
- CP4 all fixture classes have deterministic action.
- CP5 after-state metrics captured.
- CP6 independent verification passes.

## Metrics
Attempts/turn, recovery P50/P95, `Retry-After` compliance, burst coefficient, fallback success, and terminal failure rate.

## Retry policy
Maximum two policy iterations. A second iteration requires a changed hypothesis supported by failed fixture or metric evidence.

## Stop conditions
Success after verification and measurable improvement/no regression. Failure after two unsuccessful iterations or if required provider metadata cannot be preserved.

## Failure path
Revert to the previous bounded policy, retain diagnostics, and escalate. Do not remove attempt/time limits or violate model/security constraints to achieve availability.

## Verification
Replay fixed local-admission, provider-capacity, burst-rate, ordinary rate-limit, and unknown-error fixtures; confirm action, delay bounds, and cumulative budget.

## Definition of Done
Baseline captured; classifier implemented; after metrics collected; constraints preserved; verifier passes; no unbounded loop remains.
