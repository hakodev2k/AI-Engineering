# Stateful Stream Processing

## Purpose
Design bounded, recoverable state for joins, aggregations, deduplication, and temporal logic.

## When to use
Use whenever processing correctness depends on history across events.

## Inputs
State keys, access patterns, retention, event rate, recovery targets, checkpoint capabilities.

## Context to inspect
State backend, checkpoints, changelogs, TTLs, partitioning, savepoints, storage capacity.

## Core knowledge
State must be partition-aligned, durably checkpointed, bounded by lifecycle rules, and recoverable within SLOs. State size directly affects checkpoint and rebalance behavior.

## Procedure
1. Define state and invariant.
2. Choose keying and state representation.
3. Bound lifetime with TTL/window rules.
4. Estimate state growth.
5. Configure checkpoint durability and cadence.
6. Define restore/migration procedure.
7. Test crash, rebalance, upgrade, and expired-state cases.
8. Monitor state size and checkpoint health.

## Decision points
Prefer stateless processing when history is unnecessary. Use external state only when sharing/access requirements outweigh latency and consistency complexity.

## Common failure patterns
Unbounded state; huge per-key values; checkpoint intervals disconnected from recovery objectives; state schema changes without migration.

## Verification
Recovery tests preserve outputs and meet RTO; state growth remains within capacity under peak load.

## Expected output
State model, retention policy, recovery evidence, and capacity limits.

## Stop conditions
Stop if state retention or recovery requirements are unknown for correctness-critical processing.