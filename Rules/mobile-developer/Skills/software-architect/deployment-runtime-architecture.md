# Deployment and Runtime Architecture

## Purpose
Design deployment units, runtime topology, configuration, and release boundaries that support safe operations and predictable change.

## When to use
Use when defining deployment architecture, changing hosting models, splitting services, or reducing release risk.

## Inputs
Runtime components, deployment constraints, environments, configuration model, traffic patterns, availability targets, release process.

## Context to inspect
Process boundaries, containers/VMs/serverless functions, networking, configuration sources, secrets, health checks, rollout strategy, rollback capability, and stateful dependencies.

## Core knowledge
Deployment boundaries should reflect operational ownership and failure isolation. Runtime configuration should be externalized appropriately, immutable artifacts preferred, and rollback or forward-fix paths designed before release.

## Procedure
1. Map deployable components and dependencies.
2. Identify stateful and stateless runtime concerns.
3. Define configuration and secret sources.
4. Establish health/readiness behavior.
5. Choose rollout strategy: rolling, blue-green, canary, or replace-in-place.
6. Define database/schema compatibility across versions.
7. Establish rollback/forward-fix procedures.
8. Define environment parity expectations.
9. Validate failure behavior during deployment.

## Decision points
Use independent deployment only where ownership, scaling, or isolation justifies it. Prefer canary/blue-green for high-risk releases when platform support and cost permit.

## Common failure patterns
Environment-specific builds, config embedded in artifacts, incompatible schema changes, no readiness checks, hidden state in instances, and rollback plans that ignore database changes.

## Verification
Deploy to a production-like environment, exercise rolling upgrade and rollback scenarios, and verify availability, configuration, compatibility, and observability.

## Expected output
A documented runtime and deployment model with safe rollout, configuration, compatibility, and recovery rules.

## Stop conditions
Stop when destructive migration, unavailable rollback path, or missing infrastructure permissions require approval.