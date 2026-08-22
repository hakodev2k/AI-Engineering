# Serverless Cost Optimization

## Purpose
Control function and serverless-platform cost by optimizing invocation volume, execution resources, concurrency, architecture, and downstream consumption.

## When to use
Use for rapidly growing invocation cost, long execution duration, excessive provisioned concurrency, or expensive event-driven workloads.

## Inputs
Invocation metrics, duration, memory/CPU configuration, concurrency, event sources, retries, logs, downstream API/database usage, billing.

## Context to inspect
Inspect cold starts, provisioned concurrency, retry storms, duplicate events, polling, payload size, log volume, orchestration, idle minimum capacity, and downstream charges.

## Core knowledge
Serverless cost is workload-shaped. Faster execution can reduce duration cost even with more memory; retries and chatty downstream calls can dominate. Cost optimization must preserve latency and reliability.

## Procedure
1. Decompose spend by requests, duration, provisioned capacity, logs, network, and downstream services.
2. Identify high-cost functions/workflows.
3. Measure execution distribution and error/retry rates.
4. Test memory/CPU configurations for cost-performance efficiency.
5. Remove unnecessary invocations, polling, duplicate processing, and excessive logging.
6. Tune concurrency and batching.
7. Evaluate provisioned versus on-demand capacity.
8. Validate idempotency before changing retry/batch behavior.
9. Load test and monitor latency/errors.
10. Confirm billing improvement.

## Decision points
Pay for provisioned concurrency only when latency objectives justify it. Batch events when throughput gains outweigh latency and failure-domain costs.

## Common failure patterns
Optimizing function price while ignoring downstream databases, disabling retries without failure analysis, increasing batches without idempotency, and reducing memory that lengthens execution enough to cost more.

## Verification
Representative load meets latency/error objectives; duplicate processing remains controlled; billing and unit cost improve.

## Expected output
A serverless cost profile, optimization experiments, chosen configuration, and verified savings.

## Stop conditions
Stop when retry or concurrency changes risk data loss, duplicate side effects, or unmet latency requirements.