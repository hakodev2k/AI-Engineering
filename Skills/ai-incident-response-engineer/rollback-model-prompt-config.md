# Rollback of Models, Prompts, and Configuration

## Purpose
Execute safe, evidence-based rollback of AI behavior changes while avoiding mixed-version or hidden-configuration states.

## When to use
Use when an incident correlates strongly with a recent model, prompt, retrieval, tool, routing, or configuration release.

## Inputs
Last-known-good versions, deployment history, feature flags, model aliases, prompt versions, schema compatibility, rollback runbook.

## Preconditions
Rollback target is identifiable and artifacts are available.

## Context to inspect
Traffic splits, regional deployment state, caches, model gateway aliases, prompt registries, tool schemas, migration compatibility.

## Core knowledge
AI behavior may depend on several independently versioned artifacts. Rolling back only one layer can create an untested combination.

## Procedure
1. Capture current incident evidence.
2. Identify the smallest suspect release set.
3. Verify last-known-good compatibility.
4. Freeze unrelated deployments.
5. Roll back in controlled scope where possible.
6. Confirm all replicas/routes receive the target state.
7. Purge or version caches if required.
8. Replay representative failing and healthy cases.
9. Expand rollback and monitor.
10. Record exact artifact versions restored.

## Decision points
Prefer rollback over forward-fix when impact is high and the previous state is proven safe.

## Common failure patterns
Partial regional rollback, stale model aliases, forgotten prompt/cache versions, and mixing old prompt with incompatible tool schema.

## Verification
Version telemetry matches intended state and failing scenarios recover without new regressions.

## Expected output
Rollback record with artifact versions, propagation evidence, validation, and restoration plan.

## Stop conditions
Escalate when rollback requires destructive data migration or no compatible previous state exists.