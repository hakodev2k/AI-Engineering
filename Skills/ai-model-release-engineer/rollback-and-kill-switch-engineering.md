# Rollback and Kill-Switch Engineering

## Purpose
Ensure an AI release can be rapidly contained or reversed when production evidence shows unacceptable behavior.

## When to use
Use before any release with meaningful user, safety, financial, or operational impact.

## Inputs
Deployment topology, artifact versions, routing controls, configuration dependencies, state changes, rollback objectives, and incident procedures.

## Preconditions
A known-good version or safe fallback exists.

## Context to inspect
Inspect model registry, feature flags, routing, caches, schema changes, prompt/config stores, tool permissions, and downstream state compatibility.

## Core knowledge
Rollback is harder when releases mutate state or contracts. A kill switch should minimize decision latency and dependency count, and its authority must be clear during incidents.

## Procedure
1. Identify every component changed by the release.
2. Define safe fallback behavior for each failure class.
3. Verify previous artifacts remain deployable and compatible.
4. Design routing or feature controls for immediate containment.
5. Account for caches, sessions, queues, and persistent state.
6. Define rollback triggers and authorized operators.
7. Rehearse rollback in a production-like environment.
8. Measure time to detect, decide, execute, and recover.
9. Document post-rollback verification and forward-fix criteria.

## Decision points
Use kill switches for rapid containment when full rollback is slow. Prefer roll-forward only when rollback is riskier and the fix is well understood and quickly verifiable.

## Common failure patterns
Rollback scripts never tested, previous model deleted, incompatible schema/config changes, stale caches retaining bad behavior, unclear authority, and fallback capacity too small.

## Verification
Execute a rehearsal, verify traffic reaches the fallback, confirm critical metrics recover, and validate state consistency.

## Expected output
A tested rollback/kill-switch runbook with triggers, owners, dependencies, and measured recovery time.

## Stop conditions
Stop release progression if rollback cannot be demonstrated, fallback capacity is insufficient, or irreversible state changes lack approved recovery procedures.
