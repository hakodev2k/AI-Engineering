# Observability and SLOs

## Purpose
Instrument vector-database services so retrieval quality, latency, freshness, errors, and capacity are measurable and actionable.

## When to use
Use for production readiness, incident prevention, or observability gaps.

## Inputs
User journeys, SLOs, database metrics, traces, ingestion pipeline, evaluation metrics, and alerting platform.

## Context to inspect
Inspect query/ingestion telemetry, ANN settings, replication lag, index health, shard saturation, queueing, embedding errors, and existing dashboards.

## Core knowledge
Infrastructure health alone does not prove retrieval health. Vector systems need both service metrics (latency/errors/saturation) and semantic metrics (recall proxies/evaluation regressions), plus freshness and completeness.

## Procedure
1. Define user-facing SLIs: availability, p95/p99 latency, freshness, and result completeness/quality proxies.
2. Set SLOs and error budgets.
3. Instrument query stages with traces without recording sensitive content.
4. Track QPS, top-k, filters, candidate counts, errors, timeouts, and retries.
5. Track index size/build state, memory, CPU/GPU, I/O, shard balance, and replica lag.
6. Track ingestion lag, DLQ, source/vector reconciliation, and embedding versions.
7. Segment dashboards by tenant/query class/selectivity where safe.
8. Alert on symptoms tied to SLOs rather than every noisy metric.
9. Add deployment/model/index version annotations.

## Decision points
Use high-cardinality labels only when observability backend and privacy policy support them. Prefer burn-rate alerts for SLOs over static thresholds when possible.

## Common failure patterns
No quality/freshness metrics; logging raw queries/documents; alerts on CPU without user impact; averages only; no version annotations; missing shard/tenant segmentation.

## Verification
Trigger synthetic failures, confirm telemetry and alerts, correlate traces with database metrics, and verify dashboards explain known test regressions.

## Expected output
SLIs/SLOs, dashboards, alerts, trace coverage, and operational ownership.

## Stop conditions
Stop if telemetry would expose sensitive content or SLO ownership/requirements are unresolved.