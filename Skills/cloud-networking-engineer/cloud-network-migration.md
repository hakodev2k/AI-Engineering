# Cloud Network Migration

## Purpose
Migrate network topology, address space, gateways, routing, or connectivity with controlled risk and measurable rollback.

## When to use
Use for VPC/VNet redesign, transit adoption, CIDR renumbering, firewall insertion, provider/region migration, or hybrid connectivity replacement.

## Inputs
Current/target topology, dependencies, traffic flows, migration constraints, downtime tolerance, DNS/routing controls, tests, and rollback criteria.

## Preconditions
Build a dependency inventory and verify target capacity/security before moving production traffic.

## Context to inspect
Routes, DNS, security policies, NAT, load balancers, private endpoints, hybrid links, IP allowlists, certificates, IaC, monitoring, and external partner dependencies.

## Core knowledge
Network migrations fail at hidden dependencies: source-IP allowlists, DNS caches, return routes, stateful sessions, MTU, and unmanaged resources. Parallel paths and incremental cutovers reduce risk when they do not introduce ambiguity.

## Procedure
1. Baseline current behavior and critical flows.
2. Define target state and acceptance criteria.
3. Identify hard dependencies and irreversible steps.
4. Build target path in parallel where feasible.
5. Replicate security, DNS, observability, and capacity controls.
6. Test target with synthetic/non-production traffic.
7. Move a small production cohort or low-risk flow.
8. Observe against rollback thresholds.
9. Increase traffic progressively.
10. Decommission old paths only after stabilization.
11. Update IaC, diagrams, and runbooks.

## Decision points
Use DNS-weighted or load-balancer cutover when application traffic supports gradual migration; use routing changes when network-level movement is required. Prefer reversible dual-running despite temporary cost for high-risk migrations.

## Common failure patterns
Big-bang route flips, missing partner allowlists, stale DNS, asymmetric dual paths, decommissioning rollback too early, and no baseline metrics.

## Verification
Validate every critical flow, security denial, latency/error SLO, failover, and rollback before final decommission.

## Expected output
A phased migration plan, dependency matrix, test evidence, rollback criteria, executed cutover, and updated documentation.

## Stop conditions
Stop on unexplained traffic differences, missing rollback, unresolved external dependencies, or acceptance criteria failure.