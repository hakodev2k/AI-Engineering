# Performance Observability

## Purpose
Design telemetry that makes latency, throughput, saturation, queueing, and resource bottlenecks diagnosable in production without excessive overhead.

## When to use
Use when performance incidents are hard to explain, before major launches, or when defining production performance dashboards and alerts.

## Inputs
Architecture, SLOs, critical journeys, existing metrics/logs/traces, runtime capabilities, and telemetry cost constraints.

## Context to inspect
Inspect service boundaries, dependencies, queues, pools, databases, caches, runtime metrics, deployment metadata, and high-cardinality dimensions.

## Core knowledge
Use metrics for trends and alerting, traces for causal request paths, and profiles for code/resource hotspots. Observability itself has CPU, network, storage, and cardinality cost.

## Procedure
1. Map critical journeys to measurable service boundaries.
2. Instrument request rate, errors, latency distributions, and saturation.
3. Add queue depth/age and pool acquisition metrics where relevant.
4. Capture dependency timing and status.
5. Add runtime CPU, memory, GC, thread, and I/O signals.
6. Propagate correlation and trace context across boundaries.
7. Attach deployment/version dimensions.
8. Control cardinality and sensitive attributes.
9. Build dashboards around SLOs and bottleneck hypotheses.
10. Test telemetry during a controlled performance event.
11. Measure telemetry overhead and sampling bias.

## Decision points
Prefer histograms for latency distributions; sampled traces for detail; continuous profiling when overhead and privacy are acceptable.

## Common failure patterns
Only host CPU dashboards, average latency, unbounded labels, missing queue/pool metrics, no version correlation, and instrumentation that changes benchmark behavior materially.

## Verification
A controlled slowdown should be visible from user metric through the constrained component with enough evidence to form a testable hypothesis.

## Expected output
A performance-focused observability map, dashboards, alerts, and instrumentation gaps.

## Stop conditions
Stop when proposed telemetry would expose sensitive data or exceed approved cost/overhead without authorization.