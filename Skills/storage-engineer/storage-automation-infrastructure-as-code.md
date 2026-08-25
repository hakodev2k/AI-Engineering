# Storage Automation and Infrastructure as Code

## Purpose
Automate repeatable storage provisioning and policy changes with reviewable, idempotent, testable workflows that reduce configuration drift and destructive mistakes.

## When to use
Use for recurring provisioning, policy management, fleet-scale changes, cloud storage resources, or operational standardization.

## Inputs
Desired state, provider APIs, resource inventory, naming/tagging standards, access controls, dependencies, and change policy.

## Preconditions
Separate read-only discovery from mutation and define safeguards for destructive operations.

## Context to inspect
Existing IaC, manual resources, state backends, API limits, credentials, drift, lifecycle settings, quotas, and rollback capabilities.

## Core knowledge
Storage automation must treat deletion, shrink, replication changes, and retention changes as high-risk. Idempotency, state locking, plan review, bounded concurrency, retries, and post-change verification are essential.

## Procedure
1. Discover current authoritative state.
2. Model resources and dependencies declaratively where practical.
3. Encode naming, encryption, protection, and tagging defaults.
4. Add validation and policy checks.
5. Generate and review change plans.
6. Block destructive changes unless explicitly approved.
7. Apply with bounded concurrency.
8. Handle rate limits and transient failures safely.
9. Verify resulting storage and application behavior.
10. Detect and reconcile drift deliberately.

## Decision points
Use declarative IaC for durable resources and imperative automation for operational workflows where sequencing is central. Do not automate destructive recovery decisions without strong guardrails.

## Common failure patterns
Unreviewed deletes, stale IaC state, shared credentials, unbounded parallel changes, non-idempotent retries, and assuming successful API response means usable storage.

## Verification
Plans are reproducible, repeated runs converge, policy tests pass, drift is visible, and provisioned resources pass functional checks.

## Expected output
Versioned automation with safeguards, reviewable plans, validation, and operational documentation.

## Stop conditions
Stop on ambiguous resource identity, unexpected destructive plan, state-lock conflict, or insufficient permission to verify the result.
