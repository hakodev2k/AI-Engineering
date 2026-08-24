# Data Platform Observability

## Purpose
Create actionable observability across infrastructure, pipelines, datasets, and user-facing data services so failures can be detected and localized quickly.

## When to use
Use when defining platform SLOs, reducing MTTR, onboarding critical workloads, or replacing alert noise with service-oriented monitoring.

## Inputs
Service topology, SLOs, pipeline DAGs, data-quality signals, logs, metrics, traces, lineage, and incident history.

## Context to inspect
Current dashboards, alert rules, telemetry cardinality, correlation IDs, ownership, paging routes, and gaps between system health and data health.

## Core knowledge
Infrastructure availability does not imply data correctness or freshness. Observability should connect resource symptoms to pipeline and dataset impact. High-cardinality telemetry can become a reliability and cost problem itself.

## Procedure
1. Define user-visible SLIs: freshness, availability, correctness, latency, and query success where relevant.
2. Map SLIs to pipeline and infrastructure dependencies.
3. Standardize structured logs and correlation identifiers.
4. Instrument job runtimes, lag, retries, failures, resource saturation, and quality signals.
5. Add traces across distributed control paths when diagnosis benefits.
6. Build service and dataset dashboards around decisions, not metric inventory.
7. Alert on actionable SLO threats with ownership and runbook links.
8. Control telemetry cardinality and retention.
9. Test alerting with injected failures.
10. Review incidents to close observability gaps.

## Decision points
Page for urgent user-impacting conditions; ticket or dashboard slow-burn capacity and quality trends. Use traces where cross-service causality matters; metrics are better for aggregate health.

## Common failure patterns
CPU-only dashboards, alerting every task failure, missing freshness metrics, unbounded labels, no ownership, and dashboards that cannot identify affected datasets.

## Verification
Inject pipeline, dependency, and quality failures; confirm signals appear, alerts route correctly, affected assets are identifiable, and recovery is visible.

## Expected output
SLIs/SLOs, telemetry standards, dashboards, alerts, runbooks, and observability coverage map.

## Stop conditions
Escalate when telemetry would expose sensitive data, required signals cannot be collected, or paging policy lacks accountable ownership.