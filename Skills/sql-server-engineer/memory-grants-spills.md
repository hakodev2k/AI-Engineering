# Memory Grants and Spills

## Purpose
Resolve SQL Server workspace-memory problems that cause spills, excessive grants, concurrency pressure, or unstable latency.

## When to use
Use when plans show sort/hash spills, RESOURCE_SEMAPHORE waits, oversized grants, or concurrency degradation.

## Inputs
Actual plans, grant metrics, waits, cardinality estimates, query concurrency, server memory configuration.

## Context to inspect
Inspect requested/granted/used memory, spills, estimate errors, sort/hash operators, feedback features, statistics, and concurrent workload.

## Core knowledge
Workspace grants depend heavily on cardinality and operator shape. A single oversized grant can reduce concurrency; an undersized grant pushes work to tempdb.

## Procedure
1. Confirm grant pressure or spills are material.
2. Identify top grant consumers.
3. Compare requested, granted, and used memory.
4. Trace estimate errors that drive grant size.
5. Fix statistics, predicates, indexes, or query shape.
6. Evaluate memory grant feedback and version-specific behavior.
7. Avoid global memory changes until query causes are understood.
8. Load-test concurrency after remediation.

## Decision points
Tune the query when a few statements dominate; consider instance-level settings only for systemic, measured workload behavior.

## Common failure patterns
Increasing server memory to hide bad grants, ignoring concurrency, eliminating a spill while doubling CPU, and testing a query in isolation only.

## Verification
Confirm reduced spill volume or grant waste, lower waits, stable throughput, and no adverse memory pressure.

## Expected output
Grant diagnosis, causal query/estimate issue, remediation, and concurrency evidence.

## Stop conditions
Stop if host memory constraints or co-located services are unknown before instance-level changes.