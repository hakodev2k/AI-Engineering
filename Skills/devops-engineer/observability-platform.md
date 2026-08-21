# Observability Platform Engineering

## Purpose
Build logging, metrics, tracing, and alerting foundations that support reliable operations.

## When to use
Use when designing telemetry, central dashboards, alerting, retention, or incident diagnostics.

## Inputs
Services, SLOs, telemetry sources, platform constraints, retention/compliance, cost limits.

## Context to inspect
Existing log schemas, metrics cardinality, traces, collectors, dashboards, alert noise, ingestion cost, retention.

## Core knowledge
Observability must answer system health, customer impact, dependency state, and change correlation. Favor structured logs, stable metrics, trace context, controlled cardinality, and actionable alerts.

## Procedure
1. Identify critical user journeys and dependencies.
2. Define service-level indicators.
3. Standardize structured logging fields.
4. Propagate correlation/trace context.
5. Collect infrastructure and application metrics.
6. Build service and platform dashboards.
7. Alert on symptoms tied to SLO impact.
8. Set retention and sampling by value.
9. Control sensitive data and cardinality.
10. Test telemetry during failure injection.

## Decision points
Sample high-volume traces rather than losing all; retain security/audit logs differently from debug logs; page only on actionable conditions.

## Common failure patterns
Alerting on CPU alone, unbounded labels, missing correlation IDs, dashboards without ownership, logging secrets, expensive full retention.

## Verification
A simulated failure is detectable, diagnosable, correlated to deployment, and routed to the correct owner.

## Expected output
Operational telemetry model, dashboards, alerts, and retention rules.

## Stop conditions
Stop if telemetry collection violates privacy or cost constraints without an approved design.