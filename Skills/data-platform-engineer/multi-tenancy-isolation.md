# Multi-Tenancy and Workload Isolation

## Purpose
Design tenant and workload isolation so shared data-platform infrastructure remains secure, fair, predictable, and cost-attributable under contention.

## When to use
Use when multiple teams, customers, domains, or workload classes share storage, compute, orchestration, or metadata services.

## Inputs
Tenant model, trust boundaries, workload profiles, SLOs, data classifications, quotas, cost model, and platform capabilities.

## Context to inspect
IAM, namespaces, queues, resource pools, catalogs, network policies, encryption keys, noisy-neighbor incidents, and billing tags.

## Core knowledge
Isolation has security, performance, reliability, and operational dimensions. Stronger isolation increases cost and management overhead. Quotas and admission control prevent one tenant from converting shared capacity into an outage.

## Procedure
1. Classify tenants by trust and regulatory boundaries.
2. Identify shared resources and potential cross-tenant paths.
3. Define identity and namespace boundaries.
4. Select physical or logical isolation per resource.
5. Configure quotas, concurrency limits, and workload priorities.
6. Separate critical interactive and bulk/background capacity when contention warrants it.
7. Attribute usage and cost to tenants.
8. Prevent metadata and log leakage across boundaries.
9. Test noisy-neighbor and unauthorized-access scenarios.
10. Monitor fairness, saturation, quota rejections, and cross-tenant anomalies.

## Decision points
Use dedicated infrastructure for strong regulatory or failure isolation; logical isolation is more efficient when trust and risk permit. Hard quotas protect capacity but can reject legitimate bursts; elastic quotas need global safeguards.

## Common failure patterns
Namespace-only security, shared credentials, unlimited concurrency, one global queue, cost without attribution, tenant identifiers leaking through logs, and capacity planning based only on aggregate averages.

## Verification
Run cross-tenant negative access tests, saturate one tenant, confirm critical workloads retain SLOs, validate quotas, and reconcile usage attribution.

## Expected output
Isolation model, IAM/namespaces, quota and scheduling policy, cost attribution, tests, and contention dashboards.

## Stop conditions
Escalate when required isolation cannot be guaranteed by the chosen shared service or when tenancy requirements conflict with regulatory controls.