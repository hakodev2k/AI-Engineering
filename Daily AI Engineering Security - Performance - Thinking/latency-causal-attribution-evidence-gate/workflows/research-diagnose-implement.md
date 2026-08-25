# Workflow — Research, Diagnose, Implement

## Trigger
A latency observation is proposed as a reason to change implementation.

## Goal
Make only evidence-backed performance changes.

## Inputs
Raw trace, workload, baseline, public evidence, policy.

## Baseline
Capture at least five representative cycles with unchanged security/correctness settings.

## Context
Record runtime build, workload ID, approval policy, tool identity, and environment.

## Stages
1. **Observe** — record symptom and public/current signals.
2. **Measure** — capture lifecycle timestamps.
3. **Diagnose** — run the phase gate; reject ambiguous causal claims.
4. **Hypothesize** — at most three hypotheses for the dominant phase.
5. **Experiment** — one discriminating change at a time.
6. **Implement** — only after evidence identifies an owning layer.
7. **Measure again** — same workload/environment.
8. **Verify** — independent reviewer recomputes attribution and checks correctness/security.

## Responsible agent
Investigator through diagnosis; implementation agent for the change; independent reviewer for verification.

## Tools
Trace instrumentation, phase gate, tests, benchmark runner.

## Outputs
Baseline, gate report, hypothesis table, before/after metrics, verification status.

## Checkpoints
No implementation before `attributable`; no completion before independent verification.

## Metrics
p50/p95 per phase, unsupported-claim count, total task latency, regression rate.

## Retry policy
One instrumentation retry; three diagnosis experiments; two implementation attempts.

## Stop conditions
Missing phase provenance after retry, non-reproducible workload, safety regression, or no measured improvement after the bounded attempts.

## Failure path
Preserve evidence, revert failed optimization, escalate to runtime/provider owner.

## Verification
Verifier must reproduce the gate result from raw evidence.

## Definition of Done
Evidence documented; baseline captured; attribution valid; change targets measured phase; comparable after-measurement improves or meets policy; tests pass; verifier accepts.
