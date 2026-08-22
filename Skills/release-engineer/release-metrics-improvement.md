# Release Metrics and Improvement

## Purpose
Measure release-system performance and reliability so delivery improvements are driven by evidence rather than local optimization.

## When to use
Use when evaluating release processes, pipeline investments, reliability trends, or recurring delivery friction.

## Inputs
Deployment history, lead times, pipeline durations, failure/recovery events, incidents, rollback data, queue times, manual interventions, and team feedback.

## Preconditions
Release events have stable timestamps and artifact/service identifiers.

## Context to inspect
Inspect CI/CD telemetry, deployment records, incident systems, change failure classifications, approval wait times, flaky jobs, and operator toil.

## Core knowledge
Useful measures include deployment frequency, change lead time, change failure rate, recovery time, pipeline latency, queue time, and release toil. Metrics should expose system constraints, not become individual performance targets. Segment by service and risk where aggregation hides reality.

## Procedure
1. Define release outcomes the organization wants to improve.
2. Establish precise metric definitions and event sources.
3. Validate data quality and missing-event behavior.
4. Baseline frequency, lead time, failure, and recovery.
5. Decompose lead time into active work and waiting.
6. Identify dominant bottlenecks and recurring failure classes.
7. Select one improvement hypothesis with expected measurable effect.
8. Implement and compare against baseline.
9. Check for negative side effects such as increased failure or toil.
10. Repeat and retire metrics that no longer inform decisions.

## Decision points
Optimize the current constraint rather than every pipeline stage. Prefer percentile distributions over averages for skewed latency. Add service-level segmentation before drawing conclusions from organization-wide numbers.

## Common failure patterns
Gaming deployment counts, blaming teams from metrics without context, measuring only pipeline runtime while approvals dominate lead time, excluding failed deploys, and improving speed while recovery degrades.

## Verification
Audit sampled release records against calculated metrics, reproduce dashboards from raw events, and demonstrate that an improvement changes the intended measure without worsening key guardrails.

## Expected output
Trusted release metrics, identified constraints, and evidence-backed improvement actions.

## Stop conditions
Stop quantitative conclusions when event data is incomplete or definitions changed mid-period; repair measurement before using it for decisions.