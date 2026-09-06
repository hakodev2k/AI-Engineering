# Knowledge Observability and SLOs

## Purpose
Operate knowledge pipelines with measurable service levels for freshness, completeness, retrieval quality, latency, and failure recovery.

## When to use
Use when a knowledge platform becomes production-critical, when users report intermittent retrieval issues, or when ownership and operational thresholds are unclear.

## Inputs
Pipeline topology, source criticality, ingestion metrics, index metrics, retrieval metrics, incident history, business expectations, and alerting platform.

## Context to inspect
Inspect connector lag, queue depth, parse errors, index counts, stale records, retrieval latency, empty-result rates, cache health, source outages, and current dashboards.

## Core knowledge
A knowledge system can be technically available while functionally stale or incomplete. SLOs should therefore cover content state as well as API uptime. Indicators must be attributable to actionable components and avoid unbounded cardinality.

## Procedure
1. Identify user-visible failure modes and critical knowledge domains.
2. Define SLIs for ingestion freshness, processing success, index convergence, retrieval latency, empty-result rate, and quality where measurable.
3. Set SLOs by source criticality rather than one global target.
4. Instrument each pipeline stage with stable correlation identifiers.
5. Build dashboards that connect source state to retrieval symptoms.
6. Alert on sustained user-impacting conditions, not transient noise.
7. Establish error budgets and escalation paths.
8. Record deployment, model, index, and connector versions in traces.
9. Run synthetic retrieval checks for critical knowledge paths.
10. Review SLO breaches and update thresholds based on evidence.

## Decision points
Use tighter freshness SLOs for operational knowledge than archival reference material. Prefer end-to-end synthetic checks when component health cannot prove user-visible correctness.

## Common failure patterns
Monitoring only API uptime, alerting on every ingestion error, dashboards without ownership, metrics that cannot identify affected sources, and no distinction between stale and unavailable knowledge.

## Verification
Trigger controlled failures, confirm alerts and dashboards identify the affected stage, and verify SLO calculations match sampled raw events.

## Expected output
A production observability specification with SLIs, SLOs, alerts, dashboards, ownership, and diagnostic trace fields.

## Stop conditions
Stop when business impact cannot be mapped to measurable indicators or telemetry would expose sensitive content without approved controls.