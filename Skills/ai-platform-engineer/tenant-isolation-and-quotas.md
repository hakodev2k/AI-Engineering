# Tenant Isolation and Quotas

## Purpose
Protect shared AI platform capacity, data, and budgets by enforcing tenant-aware isolation and quota controls.

## When to use
Use when multiple teams, environments, or products share model gateways, vector services, evaluators, agents, or GPU-backed infrastructure.

## Inputs
- Tenant identities and ownership
- Capacity and budget limits
- Traffic profiles
- Data sensitivity classifications
- SLO priorities

## Context to inspect
Inspect authentication claims, resource naming, caches, queues, storage, provider accounts, concurrency limits, rate limits, and cost attribution.

## Core knowledge
Isolation spans control plane, data plane, storage, telemetry, caches, quotas, and failure domains. Rate limits alone do not prevent noisy-neighbor effects. Quotas should cover dimensions that consume scarce resources such as requests, tokens, concurrent generations, GPU time, storage, and batch work.

## Procedure
1. Define the tenant boundary and authoritative identity source.
2. Map every shared resource to the tenant context it must preserve.
3. Define hard safety limits and configurable team quotas.
4. Select rate, concurrency, token, storage, or cost dimensions as appropriate.
5. Define burst behavior and priority classes.
6. Ensure cache and retrieval keys include isolation dimensions.
7. Propagate tenant identity to logs, traces, metrics, and billing.
8. Define quota-exceeded responses and retry guidance.
9. Test cross-tenant authorization and leakage scenarios.
10. Load-test noisy-neighbor conditions.
11. Add quota dashboards and alerting.
12. Establish override and emergency-capacity procedures.

## Decision points
Use hard limits for security or budget ceilings; use soft alerts for exploratory workloads. Reserve capacity for critical tenants only when SLO differences justify complexity.

## Common failure patterns
Shared caches leaking data, quotas only at one layer, global provider limits exhausting unexpectedly, hidden tenant identity in async jobs, and unlimited concurrency causing saturation.

## Verification
Verify isolation through adversarial authorization tests, quota tests, overload tests, cost reconciliation, and trace inspection across synchronous and asynchronous flows.

## Expected output
Documented and enforced tenant boundaries, quota dimensions, override procedures, and evidence of noisy-neighbor resistance.

## Stop conditions
Stop when tenant identity cannot be propagated reliably or policy owners have not defined permissible sharing boundaries.