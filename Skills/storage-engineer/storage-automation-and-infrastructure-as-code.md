# Storage Automation and Infrastructure as Code

## Purpose
Automate repeatable storage provisioning and operations while preventing destructive drift, unsafe defaults, and credential exposure.

## When to use
Use for volume/bucket/share provisioning, policy management, fleet configuration, lifecycle operations, and environment standardization.

## Inputs
Desired state, provider APIs, IaC tooling, naming/tagging policy, access model, quotas, environment constraints, and approval rules.

## Context to inspect
Existing manually managed resources, state files, drift, credentials, provider versions, import capability, CI/CD controls, and audit history.

## Core knowledge
Storage automation must be idempotent, reviewable, observable, and safe around destructive operations. State drift and lifecycle replacement semantics can delete data if misunderstood.

## Procedure
1. Inventory resources and ownership.
2. Define declarative desired state and safe defaults.
3. Import existing resources before managing them when appropriate.
4. Separate credentials from code and use scoped identities.
5. Add validation for capacity, encryption, replication, retention, and deletion protection.
6. Review plan/diff before apply.
7. Apply first to low-risk scope.
8. Verify actual state and client behavior.
9. Detect drift continuously.
10. Require explicit approval for destructive replacements/deletions.

## Decision points
Automate high-frequency deterministic operations first; retain manual approval for irreversible or high-blast-radius actions. Prefer provider-supported resources over shell orchestration when lifecycle semantics are clearer.

## Common failure patterns
State-file exposure, implicit resource replacement, unmanaged imports, broad credentials, concurrent state changes, and automation that retries destructive operations indefinitely.

## Verification
Run lint/validate/plan, test idempotency, compare desired and actual state, exercise rollback, and verify audit logs.

## Expected output
Reusable IaC/automation, policy checks, drift controls, runbook, and validation evidence.

## Stop conditions
Stop on ambiguous replacement plans, missing state locking, insufficient permissions, or any deletion affecting data without explicit approval and recovery evidence.