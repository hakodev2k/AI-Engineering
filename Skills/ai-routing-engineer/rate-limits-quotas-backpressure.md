# Rate Limits, Quotas, and Backpressure

## Purpose
Protect AI routing infrastructure and downstream providers from overload while allocating scarce capacity deliberately across tenants and workload classes.

## When to use
Use when provider quotas, GPU capacity, concurrency limits, burst traffic, or abusive clients can cause saturation or unfairness.

## Inputs
Traffic distributions, tenant tiers, provider quotas, concurrency limits, queue sizes, SLOs, cost budgets, and critical workload definitions.

## Preconditions
The system can attribute requests to a tenant, workload class, or other policy principal without relying on untrusted client claims.

## Context to inspect
Gateway limiters, provider headers, queueing, autoscaling, admission control, tenant plans, retry behavior, and burst history.

## Core knowledge
Backpressure should reduce work before saturation creates cascading latency. Token buckets handle bursts; concurrency controls protect expensive in-flight work; queues should be bounded. Capacity reservation can protect critical workloads but wastes resources if overprovisioned.

## Procedure
1. Identify constrained resources and quota dimensions.
2. Normalize provider quotas into routable capacity signals.
3. Define tenant and workload fairness rules.
4. Set request, token, and concurrency limits where relevant.
5. Bound queues and define admission rejection behavior.
6. Reserve capacity for critical workloads when justified.
7. Route overflow only to compatible alternatives.
8. Coordinate retry-after signals with clients.
9. Monitor throttling by tenant, provider, and route.
10. Test overload and recovery behavior.

## Decision points
Reject early rather than queue indefinitely. Prefer explicit priority classes over ad hoc exceptions. Do not use fallback capacity if it violates quality, policy, or cost ceilings.

## Common failure patterns
Unbounded queues, per-node limits that fail globally, retry storms after throttling, tenant starvation, and treating token-heavy requests like small requests.

## Verification
Load tests confirm bounded latency, predictable rejection, protected critical traffic, and recovery without queue avalanches.

## Expected output
Capacity-control policy with quotas, priorities, admission rules, overflow behavior, and operational dashboards.

## Stop conditions
Stop when fairness policy or critical-service priorities require unresolved business or contractual decisions.