# Federated Server Orchestration

## Purpose
Design coordinator-side orchestration for round lifecycle, client selection, update collection, aggregation, checkpointing, and recovery.

## When to use
Use when implementing or reviewing the FL control plane, scaling coordinator throughput, or diagnosing stuck and inconsistent rounds.

## Inputs
Training plan, client registry, participation policy, aggregation algorithm, timeout rules, model registry, checkpoint store, and infrastructure topology.

## Context to inspect
Inspect round state transitions, idempotency, retries, leader election, duplicate updates, timeout handling, model versioning, and partial failures.

## Core knowledge
Federated orchestration is a distributed state machine. Correctness requires immutable round identity, explicit model versions, bounded retries, deduplication, and recoverable durable state.

## Procedure
1. Define the round state machine and ownership boundaries.
2. Version every training plan and model artifact.
3. Make client invitations and submissions idempotent.
4. Define minimum/maximum participants and deadlines.
5. Validate every update against round and model version.
6. Deduplicate retries before aggregation.
7. Persist coordinator state before irreversible transitions.
8. Add checkpoints for restart without replaying completed work.
9. Separate transient retry from terminal round failure.
10. Instrument queue depth, round duration, participation, retries, and aggregation errors.

## Decision points
Use synchronous rounds when algorithm assumptions require bounded staleness. Consider asynchronous orchestration when client latency dominates and the optimizer can tolerate stale updates. Prefer explicit state machines over implicit workflow logic.

## Common failure patterns
- Mixing updates from different model versions.
- Double-counting retries.
- Infinite waiting for clients.
- Coordinator restart loses round state.
- Retry storms after partial outage.

## Verification
Inject crashes, duplicate submissions, late clients, and dependency outages; verify deterministic recovery and exactly-once aggregation semantics at the logical level.

## Expected output
A durable orchestration design with state transitions, timeout/retry policy, versioning, recovery, observability, and tests.

## Stop conditions
Stop if round identity, persistence ownership, or aggregation consistency semantics are undefined.