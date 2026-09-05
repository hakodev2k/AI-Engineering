# Feature Flags and Traffic Routing

## Purpose
Use controlled routing and runtime switches to limit blast radius, separate experiments, and make AI releases reversible without redeploying application code.

## When to use
Use for staged enablement, model routing, prompt variants, tool access, fallback activation, tenant-specific releases, or emergency containment.

## Inputs
Feature inventory, routing rules, target cohorts, fallback behavior, ownership, expiration dates, telemetry dimensions.

## Preconditions
Flags and routes are centrally observable, access-controlled, and auditable.

## Context to inspect
Default states, regional differences, tenant rules, cache behavior, model aliases, provider quotas, kill switches, and configuration propagation.

## Core knowledge
Flags are production code paths. Long-lived or overlapping flags increase state-space complexity and can create combinations never evaluated together.

## Procedure
1. Define each flag’s exact behavioral effect.
2. Set a safe default and explicit owner.
3. Define cohort/routing precedence rules.
4. Validate configuration propagation latency.
5. Attach flag state to traces and metrics.
6. Test fallback behavior for missing or stale configuration.
7. Exercise enable, disable, and rollback paths before release.
8. Avoid overlapping flags that create untested combinations.
9. Document expiration/removal criteria.
10. Remove obsolete flags after stable rollout.

## Decision points
Prefer server-side deterministic routing for security-sensitive controls. Use percentage routing only where users can tolerate variant behavior and state consistency is preserved.

## Common failure patterns
Unknown defaults, stale regional config, untracked console changes, conflicting rules, permanent temporary flags, and metrics without flag dimensions.

## Verification
Confirm representative requests resolve to expected routes and disabling a flag restores the validated fallback.

## Expected output
Auditable routing rules, safe defaults, rollback switches, and cleanup criteria.

## Stop conditions
Stop when routing semantics are ambiguous, propagation cannot be verified, or authorization depends only on a client-controlled flag.