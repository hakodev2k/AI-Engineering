# eBPF Observability Design

## Purpose
Turn kernel signals into operationally useful metrics, traces, and events without creating excessive cost or cardinality.

## When to use
Use when designing host/workload observability powered by eBPF.

## Inputs
Operational questions, SLOs, workload identities, telemetry backend, retention/cardinality budgets, kernel capabilities.

## Context to inspect
Inspect existing telemetry, identity sources, hook frequency, enrichment pipeline, metric labels, trace correlation, and sampling.

## Core knowledge
Collect only signals that answer defined questions. Kernel-level visibility can generate enormous volume; cardinality and enrichment are system-design concerns.

## Procedure
1. Start from concrete troubleshooting/SLO questions.
2. Map each question to minimal kernel signals.
3. Define workload/process/network identity correlation.
4. Decide aggregation location and sampling.
5. Design bounded metric labels and event schemas.
6. Correlate with existing trace/log identifiers where feasible.
7. Instrument telemetry pipeline health and drops.
8. Validate usefulness during realistic incidents.
9. Measure overhead and storage cost.

## Decision points
Use metrics for bounded aggregate health, events for sparse diagnostics, and traces for causal flows. Do not emit high-cardinality dimensions as metric labels merely because they are available.

## Common failure patterns
Telemetry without a question, PID-only identity, cardinality explosions, hidden event loss, expensive user-space enrichment, and no overhead budget.

## Verification
Run known failure scenarios and confirm operators can answer intended questions within cost and latency budgets.

## Expected output
An observability design with explicit signals, identities, budgets, and health indicators.

## Stop conditions
Stop when data cannot be attributed reliably or collection cost exceeds expected diagnostic value.