# Rollback and Recovery Planning

## Purpose
Design a reliable path back to a known-good AI system state when a release causes unacceptable behavior or operational impact.

## When to use
Use before every material AI release, especially model, prompt, routing, agent, retrieval, or data changes.

## Inputs
Release manifest, last-known-good state, migration details, caches, queues, rollback controls, recovery objectives.

## Preconditions
Rollback targets and owners are identified before production rollout.

## Context to inspect
Artifact compatibility, irreversible data changes, tool side effects, regional deployment state, feature flags, model/provider availability, and queued work.

## Core knowledge
Rollback is not merely redeploying old code. AI state may include prompts, model aliases, embeddings, indexes, adapters, tool schemas, memory stores, and asynchronous jobs. Some changes require forward recovery instead of rollback.

## Procedure
1. Identify every stateful and versioned component touched by the release.
2. Define the exact known-good artifact set.
3. Determine which changes are reversible and which are not.
4. Define rollback order and dependency constraints.
5. Account for queues, caches, indexes, and agent state.
6. Test rollback in a production-like environment.
7. Define trigger thresholds and authority to execute.
8. Establish validation checks after rollback.
9. Document forward-recovery steps for irreversible changes.
10. Practice the procedure for high-risk releases.

## Decision points
Use rollback when previous state is compatible and safe. Use forward recovery when data/schema changes or external actions cannot be undone safely.

## Common failure patterns
Rolling back code but not prompts or model aliases, leaving stale caches, ignoring queued jobs, and discovering incompatible migrations during an incident.

## Verification
Run the rollback procedure in rehearsal and confirm the restored system matches the known-good manifest and passes critical probes.

## Expected output
A tested rollback and recovery runbook with triggers, ownership, ordering, and validation criteria.

## Stop conditions
Stop rollout if no safe rollback or forward-recovery path exists for a high-impact failure mode.