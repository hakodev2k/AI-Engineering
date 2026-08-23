# Infrastructure as Code

## Purpose
Provision Azure resources repeatably with reviewable, versioned definitions instead of manual portal state.

## When to use
Use for durable Azure infrastructure, environment replication, disaster recovery, governance foundations, and repeatable workload deployment.

## Inputs
Desired architecture, current resource state, deployment identities, environments, configuration differences, and selected IaC tooling.

## Context to inspect
Inspect Bicep/ARM/Terraform code, modules, state, deployment history, manual resources, parameter sources, provider versions, and pipeline permissions.

## Core knowledge
IaC must be idempotent, modular at useful ownership boundaries, and safe under repeated deployment. State ownership, drift, provider/API changes, and destructive plans require deliberate handling.

## Procedure
1. Inventory resources and identify authoritative ownership.
2. Select tooling consistent with the estate and team capabilities.
3. Define module boundaries around lifecycle and responsibility.
4. Parameterize genuine environment differences without making every property configurable.
5. Keep secrets outside source and prefer identity-based references.
6. Import or reconcile existing resources before assuming ownership.
7. Run validation, linting, and change previews in CI.
8. Require review for destructive or privileged changes.
9. Deploy progressively and capture deployment evidence.
10. Detect drift and remove unmanaged manual changes through an agreed process.

## Decision points
Prefer Bicep for Azure-native integration and straightforward Azure estates; Terraform can be appropriate for multi-provider workflows or existing Terraform operating models. Choose based on lifecycle, ecosystem, and operational ownership rather than syntax preference.

## Common failure patterns
Portal-first production changes, giant modules, hidden implicit dependencies, secrets in parameters, ignoring Terraform state safety, accepting destructive plans blindly, and no import strategy.

## Verification
Create a clean environment from code, rerun with no unintended changes, inspect the plan/what-if output, and test rollback or forward-fix procedures.

## Expected output
Version-controlled infrastructure definitions and a repeatable deployment workflow with controlled state and drift.

## Stop conditions
Stop when existing resource ownership is ambiguous, a plan contains unexplained destructive changes, or state migration lacks backup and recovery procedures.