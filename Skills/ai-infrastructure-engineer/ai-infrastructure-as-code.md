# AI Infrastructure as Code

## Purpose
Manage accelerator clusters, node pools, networking, storage, and serving infrastructure through reviewable, reproducible infrastructure code.

## When to use
Use for repeatable environments, fleet changes, disaster recovery, or reducing manual configuration drift.

## Inputs
Cloud/on-prem APIs, desired architecture, IaC tooling, state backend, environment policies, secrets strategy.

## Context to inspect
Existing modules, state ownership, provider versions, manual resources, drift, CI/CD, permissions, and rollback procedures.

## Core knowledge
Infrastructure code should express durable intent while volatile workload configuration remains appropriately separated. State, provider upgrades, immutable replacements, and destructive diffs require careful review for scarce accelerator resources.

## Procedure
1. Inventory managed and unmanaged infrastructure.
2. Define module boundaries for network, cluster, accelerator pools, storage, and serving dependencies.
3. Pin provider/module versions deliberately.
4. Import or reconcile pre-existing resources before replacement.
5. Separate secrets from declarative source.
6. Add validation, policy checks, and plan review in CI.
7. Review replacement and capacity-loss risks before apply.
8. Roll out changes by environment or failure domain.
9. Detect drift and reconcile through code rather than manual edits.
10. Test environment reconstruction for critical components.

## Decision points
Use reusable modules for stable patterns; explicit environment composition for meaningful differences. Avoid abstracting provider-specific behavior that operators must reason about.

## Common failure patterns
Manual hotfix drift, shared state without locking, accidental GPU pool replacement, secret values in state/source, and unreviewed provider upgrades.

## Verification
Confirm plans are deterministic, deployed state matches code, policy checks pass, and reconstruction works for representative components.

## Expected output
Versioned, reviewable infrastructure definitions with safe deployment controls.

## Stop conditions
Stop when state ownership is ambiguous or an apply would destroy production capacity without an approved migration plan.