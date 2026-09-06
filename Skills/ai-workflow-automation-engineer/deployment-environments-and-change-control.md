# Deployment, Environments, and Change Control

## Purpose
Release workflow changes predictably across development, test, staging, and production while protecting configuration, credentials, contracts, and in-flight executions.

## When to use
Use when establishing CI/CD, promoting workflow versions, changing connectors or schemas, or managing production releases.

## Inputs
Workflow artifacts, environment configuration, secret references, test evidence, migration needs, rollback options, and release policy.

## Context to inspect
Inspect source-control practices, environment drift, platform export/import behavior, credential binding, release history, active executions, and rollback limitations.

## Core knowledge
Workflow definitions should be versioned as deployable artifacts. Configuration belongs outside the workflow when environment-specific. A rollback may be unsafe when new executions have already produced irreversible side effects or changed durable state.

## Procedure
1. Identify deployable workflow artifacts and external configuration.
2. Put versionable definitions and scripts under source control.
3. Separate environment-specific endpoints, IDs, and secrets.
4. Define promotion order and required test gates.
5. Detect schema, credential, and dependency changes before deployment.
6. Decide how in-flight executions behave across version changes.
7. Define rollout strategy: full, canary, shadow, or staged.
8. Define rollback versus forward-fix criteria.
9. Record release version and change reason in operational telemetry.
10. Validate production configuration after promotion.
11. Monitor key success/failure metrics during rollout.
12. Preserve a tested recovery path for bad releases.

## Decision points
Use canaries for high-volume/high-risk workflows. Prefer forward fixes when rollback would conflict with new state or external side effects. Freeze incompatible contract changes until consumers are ready.

## Common failure patterns
Editing production manually, copying secrets between environments, unversioned workflow exports, no handling for in-flight runs, and assuming rollback always restores business state.

## Verification
Promote a release through the standard path in a safe environment, execute smoke scenarios, and confirm version, configuration, credentials, telemetry, and recovery behavior.

## Expected output
A repeatable release process with versioning, environment separation, gates, rollout, rollback/forward-fix rules, and monitoring.

## Stop conditions
Stop when production configuration cannot be reproduced, required migration safety is unknown, or no recovery strategy exists for a high-impact change.