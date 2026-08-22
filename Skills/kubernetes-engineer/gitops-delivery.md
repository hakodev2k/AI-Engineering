# GitOps Delivery

## Purpose
Operate Kubernetes desired state through reviewable, reproducible, reconciled configuration with controlled promotion and drift handling.

## When to use
Platform/application deployment design, environment promotion, or drift problems.

## Inputs
Repository structure, environments, ownership, secrets approach, release process, and GitOps controller capabilities.

## Context to inspect
Manifests/templates, controller configuration, sync policies, RBAC, drift, promotion flow, and rollback history.

## Core knowledge
GitOps makes Git-declared state authoritative, but unsafe automation can propagate mistakes quickly. Reconciliation and emergency changes need explicit governance.

## Procedure
1. Define ownership and source-of-truth boundaries.
2. Structure reusable base and environment-specific configuration.
3. Validate manifests/policies before merge.
4. Configure controller with least privilege.
5. Choose manual or automatic reconciliation per risk.
6. Define promotion and rollback mechanics.
7. Handle secrets without committing plaintext.
8. Detect and resolve drift intentionally.

## Decision points
Auto-sync low-risk well-tested resources; require gates for high-risk changes. Choose templating only when it reduces duplication without hiding rendered state.

## Common failure patterns
Direct production edits, opaque template complexity, controller overprivilege, auto-pruning without safeguards, and secrets in Git.

## Verification
Deploy through the full path, introduce safe drift, verify reconciliation, and test rollback.

## Expected output
Auditable GitOps workflow with clear authority and recovery behavior.

## Stop conditions
Escalate when emergency access or source-of-truth ownership is undefined.