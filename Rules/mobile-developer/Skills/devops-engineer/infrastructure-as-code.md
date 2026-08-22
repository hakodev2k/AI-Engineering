# Infrastructure as Code

## Purpose
Create reproducible, reviewable infrastructure changes with controlled state and drift.

## When to use
Use for provisioning or changing cloud, network, compute, storage, identity, or platform resources.

## Inputs
Desired architecture, provider, environments, state backend, policies, naming/tagging rules.

## Context to inspect
Existing IaC modules, deployed resources, state, drift, provider versions, secrets, import history.

## Core knowledge
Treat infrastructure code as production code. State is critical data. Prefer reusable modules with explicit interfaces, pinned versions, policy checks, plan review, and minimal blast radius.

## Procedure
1. Inventory current resources and ownership.
2. Detect unmanaged resources and drift.
3. Select module boundaries around stable capabilities.
4. Define variables, outputs, and environment overlays.
5. Configure remote state, locking, encryption, and access.
6. Pin provider/module versions.
7. Generate and review plans.
8. Apply progressively in lower-risk environments.
9. Verify actual resource state.
10. Record imports/migrations and rollback constraints.

## Decision points
Use separate state where blast-radius or ownership differs; import existing infrastructure instead of recreating when disruption is unacceptable; abstract only stable patterns.

## Common failure patterns
Monolithic state, secret values in code, unpinned providers, blind apply, circular modules, deleting resources during refactor, ignored drift.

## Verification
Plan is clean after apply, resources match intended policy, state is backed up and locked, destructive changes are explicitly reviewed.

## Expected output
Versioned IaC with deterministic plans, safe state management, and documented ownership.

## Stop conditions
Stop if state integrity is uncertain, ownership is unknown, or destructive replacement lacks approval.