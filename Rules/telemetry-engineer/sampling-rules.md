# Sampling Rules

## Purpose
Preserve useful telemetry while controlling volume, cost, and processing load.

## Scope
Head sampling, tail sampling, log sampling, event sampling, exemplars, and adaptive sampling.

## MUST
- Sampling policies MUST state the target signals, rate or decision criteria, and expected analytical limitations.
- Error, security, and critical-path telemetry MUST have explicit preservation requirements.
- Sampling changes MUST be evaluated against detection, debugging, and statistical use cases before rollout.
- Sampling decisions MUST be observable enough to explain missing data and effective rates.

## MUST NOT
- MUST NOT apply uniform sampling blindly when rare failures or high-value cohorts would be lost.
- MUST NOT present sampled counts as exact totals without correcting or labeling them appropriately.
- MUST NOT change sampling in production without measuring downstream effect.

## SHOULD
- Prefer adaptive or tail-aware strategies when they materially improve retention of important traces.

## Exceptions
Require documented purpose, affected analyses, evidence, risk, and rollback plan.

## Verification
Inspect sampler configuration, effective-rate metrics, retained examples, dashboards, and before/after query results.