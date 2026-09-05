# Scalable Generation and Cost Control

## Purpose
Scale synthetic-data generation efficiently while controlling model/API spend, compute utilization, storage growth, throughput, and quality degradation.

## When to use
Use before expanding generation from pilot scale to millions of records, large media corpora, repeated simulation campaigns, or expensive model-based synthesis.

## Inputs
Target volume, generator latency, per-sample cost, compute inventory, quotas, storage cost, rejection rate, validation cost, quality targets, deadlines.

## Preconditions
A small-scale pipeline already meets minimum quality and utility thresholds.

## Context to inspect
Model/provider pricing, concurrency limits, batching support, token/image/video usage, GPU utilization, cache opportunities, validator throughput, storage lifecycle, failure/retry rates.

## Core knowledge
Generation cost is driven by accepted samples, not raw requests. High rejection, retries, oversized prompts, unnecessary premium models, or redundant validation can dominate total cost. Scaling can also change quality when batching, model routing, or sampling settings differ.

## Procedure
1. Measure end-to-end cost per accepted sample.
2. Break cost into generation, validation, human review, compute, and storage.
3. Identify rejection and retry amplification.
4. Benchmark cheaper generators or model tiers on representative scenarios.
5. Batch requests where semantics and provider behavior permit.
6. Cache deterministic or reusable intermediate outputs.
7. Parallelize within provider and infrastructure limits.
8. Add hard budgets, quotas, and runaway-job guards.
9. Track cost and quality by scenario, generator version, and batch.
10. Scale gradually and verify that fidelity and utility remain stable.

## Decision points
Use premium generators only for scenarios where measured quality benefit justifies cost. Prefer simulation or templating for deterministic high-volume cases. Spend more on validation when false acceptance is materially riskier than generation cost.

## Common failure patterns
Optimizing request price instead of accepted-sample cost, unlimited retries, using the largest model everywhere, storing unnecessary intermediate artifacts, and scaling before validator throughput is ready.

## Verification
Demonstrate target throughput, bounded cost per accepted sample, stable quality metrics, controlled retries, and correct budget enforcement under load.

## Expected output
A capacity and cost model, optimized generation configuration, budget controls, and measured scale-test results.

## Stop conditions
Stop scaling when quality degrades, cost exceeds approved limits, provider quotas become operational risk, or validation cannot keep pace with generation.