# GitOps Operations

## Purpose
Operate Kubernetes through declarative Git reconciliation with controlled promotion, drift handling, and rollback.
## When to use
GitOps adoption, reconciliation failures, environment promotion, or drift incidents.
## Inputs
Git repositories, desired-state structure, controller configuration, environment policy, deployment ownership.
## Context to inspect
Flux/Argo-style reconciliation, source revisions, health checks, sync waves/dependencies, secrets integration, RBAC, drift and manual changes.
## Core knowledge
GitOps makes Git the desired-state authority; reconciliation must be observable and manual production mutations must have explicit emergency semantics.
## Procedure
1. Define source-of-truth boundaries. 2. Separate reusable base from environment state. 3. Configure least-privilege controller access. 4. Define dependency/order and health gates. 5. Validate changes before merge. 6. Promote immutable revisions. 7. Observe reconciliation. 8. Handle drift by correcting source, not fighting controller. 9. Test rollback and controller outage.
## Decision points
Use automatic reconciliation for well-tested low-risk changes; require approval gates for high-impact environments or resources.
## Common failure patterns
Mutable image tags, secrets in Git, manual hotfixes overwritten by reconciliation, cyclic dependencies, and controller with cluster-admin by default.
## Verification
Prove commit-to-cluster traceability, drift correction, failed-sync visibility, rollback, and recovery after controller restart.
## Expected output
Auditable reconciliation workflow with ownership, gates, and rollback evidence.
## Stop conditions
Stop when Git is not authoritative, emergency-change policy is undefined, or controller privileges are unjustifiably broad.