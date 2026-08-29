# AI Launch and Rollout Strategy

## Purpose
Launch AI capabilities progressively with explicit quality, reliability, risk, and rollback controls.

## When to use
Use before production release, model migration, major prompt changes, new agent permissions, or expansion to new customer segments.

## Inputs
Eval results, product KPIs, safety results, reliability metrics, support readiness, rollout tooling, rollback options, affected segments.

## Context to inspect
Feature flags, model routing, monitoring, on-call ownership, customer communications, known limitations, quotas, and incident procedures.

## Core knowledge
AI behavior can regress without code changes because providers, traffic mix, retrieval data, and user behavior change. Rollout must therefore be observable and reversible.

## Procedure
1. Define release scope and excluded segments.
2. Confirm offline quality and safety gates.
3. Establish baseline online metrics and rollback thresholds.
4. Launch to internal or low-risk traffic first.
5. Inspect qualitative failures and segmented metrics.
6. Increase exposure in controlled stages.
7. Validate capacity, latency, support, and cost at each stage.
8. Preserve a known-good rollback configuration.
9. Document limitations and support guidance.
10. Complete a post-launch review before full expansion.

## Decision points
Use canary or percentage rollout when behavior risk is meaningful. Use immediate release only for low-risk, well-tested changes with easy rollback.

## Common failure patterns
Full rollout after demo success, no rollback path, aggregate-only monitoring, changing model and prompt simultaneously, and ignoring support readiness.

## Verification
Confirm feature controls, fallback paths, dashboards, alert thresholds, and rollback steps before increasing exposure.

## Expected output
A staged launch plan with gates, metrics, owners, rollback criteria, and support readiness.

## Stop conditions
Stop rollout when critical quality, safety, reliability, or cost guardrails breach thresholds.