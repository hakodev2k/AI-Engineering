# Observability Design

## Purpose
Create production observability that lets engineers understand service state, user impact, and failure propagation without relying on guesswork.

## When to use
Use when designing a new service, reviewing incident blind spots, adding dependencies, or improving diagnosis speed. Do not add telemetry merely because a platform supports it; every signal should support a reliability question.

## Inputs
Architecture diagrams, request and event flows, SLIs/SLOs, dependency map, incident history, logs, metrics, traces, and telemetry cost constraints.

## Preconditions
Critical user journeys and service boundaries must be identified.

## Context to inspect
Ingress/egress paths, async processing, storage, queues, caches, retries, timeouts, regional boundaries, background jobs, and existing dashboards.

## Core knowledge
Metrics show aggregate behavior, logs provide event detail, traces show causal request flow, and profiles reveal runtime resource use. Strong observability links these signals with consistent identifiers and service metadata. High-cardinality telemetry is powerful but must be controlled for cost and privacy.

## Procedure
1. Start from user journeys and operational questions.
2. Define golden signals: traffic, errors, latency, saturation, plus domain-specific backlog or freshness measures.
3. Add structured logs for state transitions and failure context.
4. Propagate correlation and trace identifiers across service boundaries.
5. Instrument external calls, queues, storage, and retries.
6. Record deployment/version metadata with telemetry.
7. Build service overview and dependency dashboards.
8. Verify sampling preserves enough data for rare failures.
9. Add retention and cardinality limits.
10. Test observability during controlled failure scenarios.
11. Review telemetry usefulness after incidents.

## Decision points
Use metrics for alerting and trends, traces for latency and dependency analysis, logs for detailed event evidence, and profiling for process-level bottlenecks. Sample high-volume successful traces more aggressively than errors when necessary.

## Common failure patterns
Unstructured logs, missing correlation IDs, dashboards with hundreds of unrelated charts, unbounded labels, telemetry containing secrets, and instrumentation that disappears precisely on failure paths.

## Verification
Trigger representative failures and confirm responders can identify impacted users, failing component, causal dependency, recent version, and timing from telemetry alone.

## Expected output
An observability plan, instrumentation coverage, dashboards, correlation strategy, retention rules, and evidence that failure diagnosis works.

## Stop conditions
Escalate when privacy, regulatory, or cost constraints conflict with required telemetry or when service boundaries are too unclear to instrument reliably.