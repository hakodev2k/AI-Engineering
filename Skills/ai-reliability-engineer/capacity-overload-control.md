# Capacity and Overload Control

## Purpose
Keep AI services stable when incoming work approaches or exceeds sustainable inference, queue, or dependency capacity.

## When to use
Use when traffic bursts, long contexts, multi-step workflows, provider throttling, or constrained accelerator capacity can create excessive queueing and timeouts.

## Inputs
Traffic classes, concurrency, queue depth, service times, token volumes, priority rules, SLOs, capacity limits.

## Preconditions
Critical and noncritical workloads can be distinguished using documented product rules.

## Context to inspect
Ingress controls, queues, model gateway, worker pools, rate limits, tenant quotas, batch schedulers, autoscaling signals.

## Core knowledge
AI requests vary greatly in compute cost, so raw request count is often a weak capacity signal. Stable systems bound accepted work, queue age, concurrency, and downstream pressure before saturation causes widespread failure.

## Procedure
1. Measure work using relevant units such as tokens, compute time, steps, or concurrency.
2. Establish thresholds before hard saturation.
3. Classify workload priority and fairness requirements.
4. Apply per-tenant and global admission limits.
5. Expire queued work that can no longer meet its deadline.
6. Reduce optional model calls or workflow steps during overload.
7. Return explicit temporary-capacity responses when appropriate.
8. Couple autoscaling to sustainable resource signals.
9. Test burst and sustained overload scenarios.
10. Review fairness and recovery behavior after changes.

## Decision points
Prefer bounded early admission over allowing every request to fail late. Reserve capacity for critical workflows only when product and contractual rules justify it.

## Common failure patterns
Counting requests instead of compute work, unbounded queues, scaling too late, repeated client retries, and one tenant consuming shared capacity.

## Verification
Load tests demonstrate bounded queues, stable protected-workload latency, controlled overload behavior, and rapid recovery.

## Expected output
A capacity-control policy with priority rules, thresholds, overload behavior, telemetry, and validated tests.

## Stop conditions
Escalate when prioritization or customer-impact policy requires product, legal, or contractual approval.