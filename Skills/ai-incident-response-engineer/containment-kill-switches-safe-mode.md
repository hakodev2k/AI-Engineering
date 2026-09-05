# Containment, Kill Switches, and Safe Mode

## Purpose
Contain harmful AI behavior quickly while preserving the safest useful service level.

## When to use
Use for runaway agents, unsafe model outputs, unauthorized tool actions, bad deployments, corrupted retrieval, or rapidly expanding incidents.

## Inputs
Severity, affected features, available feature flags, traffic routing, model fallbacks, tool permissions, rollback options, business continuity requirements.

## Preconditions
Know who is authorized to disable models, tools, traffic, or autonomous actions.

## Context to inspect
Kill switches, feature flags, circuit breakers, fail-closed controls, degraded modes, approval gates, routing policies, rollback runbooks.

## Core knowledge
Containment must minimize ongoing harm without creating a larger outage. AI safe mode may disable tools, autonomy, memory, external side effects, or risky modalities while preserving read-only or human-reviewed workflows.

## Procedure
1. Identify the narrowest control that stops ongoing harm.
2. Prefer reversible controls with clear auditability.
3. Disable external side effects before disabling harmless inference when appropriate.
4. Route to a known-safe model/configuration if validated.
5. Reduce autonomy or require human approval.
6. Verify propagation across regions and replicas.
7. Monitor residual traffic and queued work.
8. Preserve evidence before destructive cleanup.
9. Document containment time and exact controls changed.

## Decision points
Use full kill switch when harm cannot be bounded. Use safe mode when a reduced-trust workflow is independently validated.

## Common failure patterns
Disabling the UI while background agents continue, relying on stale flags, failing open when a safety dependency is unavailable, and using an untested fallback.

## Verification
Confirm no new harmful actions occur, audit logs show expected control state, and representative requests follow safe-mode behavior.

## Expected output
A containment record with controls, owner, verification evidence, and rollback prerequisites.

## Stop conditions
Escalate if authority is unclear, containment cannot reach all execution paths, or shutdown itself risks data loss or physical harm.