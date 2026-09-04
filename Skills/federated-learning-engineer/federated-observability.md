# Federated Observability

## Purpose
Build privacy-aware observability for distributed training so engineers can diagnose failures, regressions, and resource bottlenecks without collecting prohibited client data.

## When to use
Use when operating FL in production, investigating low participation, slow rounds, client crashes, quality regressions, or unexplained convergence changes.

## Inputs
Round lifecycle, client runtime events, privacy policy, aggregation metrics, infrastructure telemetry, model-quality metrics, and incident requirements.

## Context to inspect
Inspect what telemetry may leave clients, metric cardinality, identifiers, retention, sampling, clock skew, version labels, and coordinator/client correlation needs.

## Core knowledge
Useful FL observability spans system health, participation, optimization, privacy, and model quality. Telemetry itself can leak sensitive client behavior; data minimization and aggregation are first-class design constraints.

## Procedure
1. Define diagnostic questions before collecting telemetry.
2. Classify telemetry by sensitivity and retention requirement.
3. Instrument round state, client eligibility, selection, completion, timeout, and failure reasons.
4. Track update norms or approved summaries where policy allows.
5. Record model, runtime, protocol, and configuration versions.
6. Measure latency, bytes, compute, and retry rates by coarse client class.
7. Build global and cohort quality dashboards from approved aggregates.
8. Add alerts for participation collapse, stalled rounds, divergence, and abnormal failures.
9. Test incident investigation using only allowed signals.
10. Regularly delete metrics that do not justify their privacy cost.

## Decision points
Prefer aggregate counters and bounded labels over persistent client identifiers. Add richer diagnostics temporarily only through approved incident procedures.

## Common failure patterns
- High-cardinality client IDs in logs.
- No model/config version labels.
- Infrastructure metrics without optimization metrics.
- Alerting on normal client churn.
- Telemetry retention exceeds privacy need.

## Verification
Run failure drills and confirm engineers can localize client, network, coordinator, and optimization faults while respecting telemetry policy.

## Expected output
An observability specification with metrics, logs, alerts, dashboards, privacy controls, retention, and incident workflows.

## Stop conditions
Stop if telemetry governance is undefined or diagnostics require prohibited client-level data with no approved mechanism.