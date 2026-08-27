# Edge Compute Design

## Purpose
Decide when logic belongs at the CDN edge and design it within latency, security, runtime, and consistency constraints.

## When to use
Use for request rewriting, authentication helpers, personalization, experimentation, routing, or lightweight API composition near users.

## Inputs
Business logic, latency goals, runtime limits, data dependencies, consistency needs, security model, cost.

## Context to inspect
Current origin logic, edge runtime APIs, deployment model, KV/state services, secrets, observability, fallback behavior.

## Core knowledge
Edge compute reduces network distance but operates under constrained runtimes and distributed consistency. Moving logic outward increases deployment surface and can fragment application ownership.

## Procedure
1. Define the latency or architectural problem being solved.
2. Separate deterministic request logic from stateful business workflows.
3. Identify data and secret dependencies.
4. Validate runtime, execution-time, memory, and package limits.
5. Design state access with explicit consistency assumptions.
6. Define failure fallback to origin or safe denial.
7. Add versioning, staged rollout, and observability.
8. Load-test cold/warm execution and dependency latency.
9. Document ownership and rollback.

## Decision points
Keep complex transactional logic at origin; place small latency-sensitive, globally applicable logic at edge. Replicated edge state is appropriate only when its consistency model fits the use case.

## Common failure patterns
Treating edge KV as strongly consistent, oversized bundles, hidden network calls, secret leakage, unbounded compute, and duplicated business logic.

## Verification
Measure execution latency, cold starts, error rate, fallback behavior, consistency outcomes, and rollback speed.

## Expected output
An edge-compute design with boundaries, state model, failure behavior, deployment controls, and benchmarks.

## Stop conditions
Escalate if required semantics exceed runtime guarantees or sensitive processing lacks an approved security model.