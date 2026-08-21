# Error Boundaries and Recovery

## Purpose
Contain UI failures and provide useful recovery without masking systemic defects.

## When to use
Use for route boundaries, risky widgets, lazy loading, rendering failures, and production resilience.

## Inputs
Component tree, error taxonomy, logging platform, retry/reload UX.

## Preconditions
Know which errors are render-time, async data, event-handler, or infrastructure failures.

## Context to inspect
Error boundaries, route errors, query errors, logging, fallback UI, retry behavior.

## Core knowledge
React error boundaries catch render/lifecycle failures in their subtree, not every async or event error. Recovery must match error ownership.

## Procedure
1. Classify failure types.
2. Place boundaries at meaningful isolation points.
3. Provide specific fallback and recovery actions.
4. Log correlation/context without sensitive data.
5. Reset boundary state on appropriate navigation/key changes.
6. Avoid endless automatic retry loops.
7. Test expected and unexpected failure paths.

## Decision points
Use coarse route boundaries for page isolation and finer boundaries only when a widget can fail independently without compromising surrounding correctness.

## Common failure patterns
One global blank-screen fallback, swallowing errors, automatic retry storms, losing user input, logging sensitive payloads.

## Verification
Inject failures, confirm isolation/recovery, verify telemetry, and ensure unaffected UI remains usable.

## Expected output
Graceful failure containment with actionable observability.

## Stop conditions
Stop if failure indicates data corruption or security risk requiring system-level incident response.