# Request Scheduling and Prioritization

## Purpose
Schedule heterogeneous inference requests fairly while meeting differentiated latency and throughput objectives.

## When to use
Use when short/long requests interfere, tenants compete, premium traffic needs guarantees, or queues show head-of-line blocking.

## Inputs
Traffic classes, SLOs, tenant policy, prompt/output distributions, scheduler capabilities, capacity measurements.

## Context to inspect
Queue discipline, batching, preemption/cancellation, token budgets, rate limits, and starvation telemetry.

## Core knowledge
LLM request cost is variable and partially unknown until generation ends. Scheduling must consider prompt tokens, expected decode, priority, age, and resource occupancy. Fairness can be request-, token-, or capacity-based.

## Procedure
1. Define traffic classes and business priorities. 2. Measure cost distributions. 3. Choose fairness unit. 4. Establish queue and token budgets per class. 5. Prevent one class from consuming all KV/cache capacity. 6. Add aging or reserved capacity to prevent starvation. 7. Integrate cancellation and deadlines. 8. Test mixed workloads and adversarial tenants. 9. Measure class-specific p95/p99 and rejection rates. 10. Document priority semantics.

## Decision points
Use strict priority only when starvation is acceptable or bounded by reservations. Prefer weighted fair scheduling for shared multi-tenant systems.

## Common failure patterns
FIFO for highly heterogeneous work, priority without starvation protection, trusting client-supplied cost, and measuring only aggregate latency.

## Verification
Load-test competing classes and prove each meets its documented service envelope under expected saturation.

## Expected output
A scheduler policy with fairness model, class budgets, telemetry, and overload semantics.

## Stop conditions
Stop if priority ownership is unresolved, tenant identity is unreliable, or scheduler cannot enforce required isolation.