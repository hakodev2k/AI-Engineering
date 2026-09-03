# Routing Policy Governance and Change Management

## Purpose
Control how routing policies, model eligibility, thresholds, and provider configurations change so decisions remain reviewable, reproducible, and reversible.

## When to use
Use for any production router whose behavior can change through code, configuration, experiments, registry data, or provider model aliases.

## Inputs
Current policy, proposed change, evaluation evidence, owners, approval requirements, rollout plan, rollback criteria, model/provider lifecycle data.

## Context to inspect
Configuration stores, deployment pipelines, feature flags, audit logs, model registry, experiment system, incident history, and access controls.

## Core knowledge
Routing changes can alter quality, cost, compliance, and failure domains without application-code changes. Treat policy configuration as production software: version it, test it, review it, and retain historical state. Provider aliases should not silently redefine production behavior.

## Procedure
1. Assign ownership for routing policy and capability metadata.
2. Version policy, registry, thresholds, and model identities independently but traceably.
3. Require a written change rationale and affected traffic classes.
4. Attach offline evaluation and risk evidence.
5. Run schema, policy, regression, and prohibited-route tests.
6. Use shadow, canary, or staged rollout according to risk.
7. Define explicit rollback conditions and a known-good version.
8. Record approval, deployment time, and effective configuration.
9. Monitor route distribution and guardrails after release.
10. Retain historical versions sufficient to reconstruct past decisions.
11. Review deprecations and provider alias changes before their effective dates.

## Decision points
Require stronger review for changes affecting regulated data, high-impact tools, safety controls, or large traffic shifts. Emergency changes may use expedited approval but must remain versioned and retrospectively reviewed.

## Common failure patterns
Editing production weights manually, unversioned configuration, provider aliases that move automatically, no rollback target, stale model metadata, and approvals without evaluation evidence.

## Verification
Verify reproducible historical decisions, immutable audit records, tested rollback, access controls, and post-deployment guardrails.

## Expected output
A governed routing-change process with versioning, evidence requirements, staged deployment, auditability, and rollback discipline.

## Stop conditions
Stop when ownership, approval authority, or rollback capability is absent for a material production change.