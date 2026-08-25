# Terraform Performance and Scale

## Purpose
Reduce plan/apply latency and operational risk as Terraform estates grow in resource count, modules, providers, and teams.

## When to use
Slow plans, state contention, memory pressure, provider throttling, or oversized blast radius.

## Inputs
Timing data, state size, graph, provider logs, CI resources, API rate limits.

## Context to inspect
Resource counts, data sources, dependencies, module boundaries, refresh behavior, provider calls, state backend latency.

## Core knowledge
Scale problems usually come from graph size, provider/API latency, excessive data reads, broad state, and artificial dependencies. Optimize from evidence, not folklore.

## Procedure
1. Baseline init/plan/apply duration and resource counts.
2. Enable diagnostic logs selectively to locate provider/API bottlenecks.
3. Identify oversized states and independent lifecycle boundaries.
4. Remove redundant data sources and broad dependencies.
5. Tune parallelism only after understanding provider throttling.
6. Split state where ownership/blast radius justify it.
7. Cache provider/plugin artifacts safely in CI.
8. Re-measure and record regression thresholds.

## Decision points
Split stacks for operational independence, not merely file size. Lower parallelism when APIs throttle; increase only with measured headroom.

## Common failure patterns
Arbitrary state sharding, excessive depends_on, repeated external data calls, and optimizing without baselines.

## Verification
Measured plan/apply time improves without increased errors, drift, or cross-state coupling.

## Expected output
Evidence-backed performance improvements and scalable state boundaries.

## Stop conditions
Stop if optimization changes ownership semantics or introduces unsafe coupling without architectural review.