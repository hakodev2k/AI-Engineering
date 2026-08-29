# Change Management

## Purpose
Reduce customer risk during material technical changes by coordinating scope, dependencies, validation, communication, rollback, and ownership.

## When to use
Use for upgrades, migrations, configuration changes, regional moves, identity changes, or architectural transitions.

## Inputs
Change scope, architecture, dependencies, maintenance windows, test evidence, rollback options, owners, and customer change-control requirements.

## Context to inspect
Production criticality, compatibility, version dependencies, unsupported states, data migration, security implications, observability, and prior change failures.

## Core knowledge
A Senior TAM focuses on reversible execution and evidence. Successful change management separates readiness from optimism and makes rollback criteria explicit.

## Procedure
1. Define intended outcome, scope, and excluded systems.
2. Map dependencies and affected stakeholders.
3. Validate compatibility and prerequisites.
4. Define pre-change backups or recovery safeguards where applicable.
5. Establish test, success, failure, and rollback criteria.
6. Sequence the change into the smallest safe stages.
7. Confirm communication and escalation paths.
8. Execute under customer change control.
9. Validate production behavior and document residual issues.

## Decision points
Prefer phased rollout when blast radius is high or evidence is weak. Require rollback capability when failure would materially affect critical workloads.

## Common failure patterns
Bundling unrelated changes, vague rollback plans, incomplete compatibility checks, unowned dependencies, and declaring success before monitoring stabilizes.

## Verification
Compare post-change metrics, functional tests, and customer-visible behavior against the baseline and acceptance criteria.

## Expected output
A change plan with prerequisites, sequence, owners, validation, rollback, and post-change evidence.

## Stop conditions
Stop when rollback is impossible for a high-risk change, prerequisites fail, approvals are missing, or unexpected impact exceeds the agreed threshold.