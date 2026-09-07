# Resource Exhaustion Defense

## Purpose
Protect APIs and downstream systems from denial of service caused by oversized payloads, expensive queries, unbounded concurrency, decompression, fan-out, or attacker-controlled work amplification.

## When to use
Use for public endpoints, uploads, search/filter APIs, report generation, graph traversal, batch operations, AI/compute-heavy calls, and endpoints with high backend fan-out.

## Inputs
Endpoint cost profile, payload limits, query capabilities, dependency limits, concurrency model, timeout policy, SLOs, capacity metrics.

## Preconditions
Understand the request-to-resource cost relationship and identify scarce resources such as CPU, memory, threads, connections, database work, and third-party quotas.

## Context to inspect
Request size, parser limits, compression, pagination, query complexity, recursion, batch size, fan-out, connection pools, queues, timeouts, cancellation propagation, and autoscaling behavior.

## Core knowledge
Availability controls should bound work before expensive processing. Apply limits at multiple layers because gateway limits do not constrain application-level amplification. Cancellation and deadlines must propagate to downstream work.

## Procedure
1. Profile expensive request paths.
2. Define payload, nesting, field-count, page-size, and batch-size ceilings.
3. Bound query complexity and recursion.
4. Set concurrency and queue limits around scarce resources.
5. Establish end-to-end deadlines and downstream timeouts.
6. Propagate cancellation.
7. Add circuit breaking or load shedding for overloaded dependencies.
8. Prevent decompression and parser bombs.
9. Test worst-case valid and intentionally pathological requests.
10. Monitor saturation signals and rejection rates.

## Decision points
Prefer hard bounds for structurally dangerous input. Use adaptive load shedding when available capacity varies. Autoscaling can absorb growth but should not be the primary defense against attacker-controlled amplification.

## Common failure patterns
Unlimited page sizes, nested expansion without depth limits, huge batches, timeouts without cancellation, retries multiplying load, unbounded queues, and expensive validation after full payload materialization.

## Verification
Run stress and adversarial tests while measuring CPU, memory, connections, latency, and downstream load. Confirm overload results in controlled rejection rather than cascading failure.

## Expected output
Documented resource budgets, enforced limits, overload behavior, tests, and production saturation monitoring.

## Stop conditions
Escalate when safe limits conflict with mandatory business workloads, capacity baselines are unavailable, or dependency owners cannot provide enforceable budgets.