# Query Complexity Protection

## Purpose
Protect GraphQL services from expensive but syntactically valid operations that can exhaust CPU, memory, databases, or downstream APIs.

## When to use
Use for public, partner, multi-tenant, or high-load GraphQL endpoints and whenever clients control query shape.

## Inputs
Schema, traffic samples, resolver costs, latency metrics, dependency limits, and client requirements.

## Context to inspect
Review maximum depth, list cardinality, pagination arguments, aliases, fragments, expensive fields, persisted operations, and gateway limits.

## Core knowledge
GraphQL shifts query composition to clients, so request count alone does not represent cost. Protection should combine structural limits, estimated field cost, pagination bounds, rate controls, timeouts, and runtime observability.

## Procedure
1. Profile representative cheap and expensive operations.
2. Identify fields whose cost scales with cardinality or downstream work.
3. Define depth and list-size bounds.
4. Assign cost weights or multipliers where supported.
5. Reject operations exceeding a documented budget before execution.
6. Enforce pagination maximums.
7. Bound execution time and downstream concurrency.
8. Consider persisted/allowlisted operations for constrained clients.
9. Log rejected cost and operation identity without sensitive variables.
10. Load-test limits and tune using production evidence.

## Decision points
Use simple depth limits as a baseline, but prefer cost analysis when shallow queries can still be expensive. Persisted operations are valuable for controlled clients but may be unsuitable for open exploratory APIs.

## Common failure patterns
Unlimited page sizes, depth-only protection, arbitrary limits without measurements, cost models that ignore list multipliers, and relying only on infrastructure rate limits.

## Verification
Confirm pathological operations are rejected predictably, normal operations remain usable, and load tests show bounded resource consumption.

## Expected output
Documented query budgets and enforced controls tied to measured service capacity.

## Stop conditions
Stop if business-critical queries exceed safe capacity and require architectural redesign rather than higher limits.