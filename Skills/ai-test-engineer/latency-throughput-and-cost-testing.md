# Latency Throughput and Cost Testing

## Purpose
Validate the operational performance envelope of AI features, including time-to-first-token, end-to-end latency, throughput, concurrency, token consumption, and cost.

## When to use
Use before production launch, provider/model changes, prompt expansion, RAG changes, agent workflow changes, or capacity planning.

## Inputs
Traffic profile, SLOs, model/provider limits, prompts, context sizes, concurrency targets, token pricing, and infrastructure topology.

## Preconditions
Representative workloads and measurable performance objectives exist.

## Context to inspect
Inspect API clients, connection pools, streaming, queues, retries, retrieval, tool calls, model routing, caches, rate limits, and observability.

## Core knowledge
AI latency often has multiple components: queueing, retrieval, provider time-to-first-token, generation, tool calls, and post-processing. Average latency is insufficient; tail percentiles and workload mix matter. Cost must be measured per useful outcome, not only per request.

## Procedure
1. Define representative workload classes and payload sizes.
2. Establish baseline latency, throughput, token, and cost metrics.
3. Test cold and warm paths.
4. Increase concurrency gradually to identify saturation.
5. Measure p50, p95, and p99 where volume permits.
6. Separate time spent in retrieval, model inference, tools, and application code.
7. Test long-context and long-output cases.
8. Measure retries and failed-request cost amplification.
9. Verify rate-limit and backpressure behavior.
10. Compare results against SLO and budget thresholds.

## Decision points
Optimize the dominant bottleneck rather than the most visible component. Use caching or smaller models only when quality and freshness requirements permit.

## Common failure patterns
Reporting averages only, benchmarking tiny prompts, ignoring queueing, testing without provider limits, and optimizing token cost while increasing failed-task retries.

## Verification
Confirm target workload remains inside latency, throughput, error-rate, and cost envelopes at expected peak load.

## Expected output
A performance report with capacity limits, tail latency, cost per workload, bottlenecks, and scaling recommendations.

## Stop conditions
Stop when tests risk production saturation, provider quotas prohibit safe testing, or workload assumptions are materially unknown.