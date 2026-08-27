# Cloud Network Infrastructure as Code

## Purpose
Manage cloud networking through reviewable, reproducible, testable Infrastructure as Code while preventing destructive or unsafe changes.

## When to use
Use for provisioning or modifying networks, routes, gateways, security controls, DNS, transit, or connectivity policies.

## Inputs
Desired architecture, current state, IaC repository, provider versions, state backend, environments, policy requirements, and deployment process.

## Preconditions
Confirm state ownership, locking, credentials, target account/subscription/project, and drift status before planning changes.

## Context to inspect
Modules, state, imports, provider versions, variables, plans, policy checks, CI/CD, manual resources, and dependency graph.

## Core knowledge
Network IaC changes can have unusually broad blast radius. Stable module interfaces, deterministic plans, state hygiene, policy-as-code, staged rollout, and explicit lifecycle controls matter more than clever abstraction.

## Procedure
1. Inspect existing modules and conventions.
2. Reconcile managed state with actual cloud resources.
3. Model the smallest desired change.
4. Avoid replacing stateful/connectivity-critical resources unintentionally.
5. Add validation for CIDRs, routes, and security policy.
6. Generate and review the plan for creates/updates/deletes/replacements.
7. Stage changes through non-production or limited scope.
8. Apply with locking and audit trail.
9. Verify data-plane behavior after apply.
10. Record rollback/recovery steps and update diagrams.

## Decision points
Refactor modules separately from high-risk topology changes when possible. Import existing resources when preserving them is safer than recreation. Use generated abstractions only when they improve clarity and policy consistency.

## Common failure patterns
Blind apply, stale state, accidental route-table replacement, hidden implicit dependencies, one giant network module, manual drift, and assuming a successful apply proves connectivity.

## Verification
Require clean plan, policy checks, successful apply, post-change reachability/denial tests, and subsequent plan showing no unexpected drift.

## Expected output
Reviewed IaC, plan evidence, applied network change, post-deployment verification, and rollback notes.

## Stop conditions
Stop on unexpected destruction/replacement, state-lock anomalies, wrong target environment, unexplained drift, or missing approval for high-blast-radius changes.