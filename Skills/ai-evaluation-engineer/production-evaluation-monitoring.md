# Production Evaluation Monitoring

## Purpose
Monitor AI quality after deployment so regressions, drift, new failure modes, and changes in user traffic are detected before offline benchmarks become stale.

## When to use
Use for deployed AI systems, after model/provider changes, after major traffic shifts, or when product quality depends on evolving real-world inputs.

## Inputs
- Production traces and feedback
- Offline benchmark metrics
- Sampling and privacy rules
- Incident history
- Release metadata

## Context to inspect
Inspect model/prompt versions, traffic slices, user feedback, latency/cost telemetry, retrieval health, safety events, tool failures, and data-retention constraints.

## Core knowledge
Production evaluation combines telemetry, sampled semantic review, drift detection, user outcomes, and incident signals. Monitoring should detect both distribution shift and metric degradation while avoiding excessive collection of sensitive content.

## Procedure
1. Define production quality indicators that complement offline metrics.
2. Attach model, prompt, dataset, and system version metadata to traces.
3. Sample production interactions using documented privacy-safe rules.
4. Compute deterministic quality and operational checks continuously where feasible.
5. Run calibrated semantic evaluation on representative samples.
6. Track distributions and critical slices over time rather than only global averages.
7. Monitor user feedback, corrections, abandonment, retries, and escalations where meaningful.
8. Detect shifts in task mix, language, domain, context length, and failure categories.
9. Compare production failures against offline benchmark coverage.
10. Promote novel severe failures into curated regression sets.
11. Trigger investigation when thresholds or drift limits are breached.
12. Revalidate evaluation thresholds after material product or traffic changes.

## Decision points
Use real-time alerts for severe deterministic failures and slower statistical review for noisy semantic metrics. Prefer sampled content review when full retention is unnecessary or privacy-sensitive.

## Common failure patterns
- Monitoring only uptime and latency
- No version metadata on traces
- Evaluating production with an uncalibrated judge
- Ignoring distribution drift
- Collecting more sensitive data than necessary
- Never feeding incidents back into offline evals

## Verification
Verify alerts using injected or historical failures, reconcile sampled results with raw traces, confirm version attribution, and ensure newly discovered incidents become reproducible offline tests.

## Expected output
A production evaluation system with quality trends, drift and incident signals, slice monitoring, and a closed loop into regression testing.

## Stop conditions
Stop and escalate when privacy controls are insufficient, trace attribution is unreliable, or quality alerts cannot be tied to actionable evidence.