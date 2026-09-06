# Performance and Cost Ergonomics

## Purpose
Help developers understand and control the latency, throughput, token usage, and monetary cost of AI integrations through clear tooling, defaults, and measurement guidance.

## When to use
Use when designing SDK defaults, dashboards, model-selection guidance, caching, batching, streaming, context management, or production-readiness documentation.

## Inputs
Pricing model, token accounting, latency distributions, throughput limits, model catalog, caching behavior, batch capabilities, request traces, and workload requirements.

## Context to inspect
Inspect real request sizes, output lengths, latency percentiles, retries, cache hit rates, model choices, concurrency, batch utilization, and developer complaints about unpredictable bills or response time.

## Core knowledge
AI cost and performance are workload-dependent. Average latency hides tail behavior; token counts do not capture every billable dimension; retries and oversized context can silently multiply spend. Developer tooling should expose controllable cost drivers without encouraging premature micro-optimization that damages quality.

## Procedure
1. Define the workload's quality, latency, throughput, and budget targets.
2. Measure a representative baseline rather than relying on nominal model specs.
3. Attribute latency across queue, network, model, retrieval, and tool stages.
4. Attribute cost across input, output, cached input, tools, storage, and retries as applicable.
5. Identify dominant drivers before changing architecture.
6. Reduce unnecessary context and output while preserving task quality.
7. Evaluate model routing, batching, caching, streaming, and concurrency controls where relevant.
8. Add budget and latency telemetry at request and aggregate levels.
9. Define guardrails for runaway retries, loops, or unbounded generations.
10. Re-run quality evaluations after every optimization.
11. Document workload assumptions and when recommendations stop applying.

## Decision points
Choose a faster or cheaper model only when evaluation shows acceptable task quality. Cache when requests or intermediate artifacts are safely reusable and invalidation semantics are clear. Batch when latency can be traded for throughput and cost efficiency. Stream when perceived latency matters more than total completion latency.

## Common failure patterns
Optimizing averages instead of percentiles, measuring synthetic tiny prompts, ignoring retries, using larger models by default, caching sensitive or user-specific data unsafely, and reducing context without measuring quality regressions.

## Verification
Benchmark representative workloads, compare p50/p95/p99 latency and cost per successful task, verify accounting against provider usage, run regression evaluations, and test budget guardrails under failure loops.

## Expected output
A measured performance-and-cost profile, prioritized optimizations, developer guidance, observability requirements, and before/after verification evidence.

## Stop conditions
Stop when pricing or usage semantics are unknown, representative workloads are unavailable, optimization would violate quality or safety requirements, or caching/data handling requires unresolved policy approval.