# Quantum-Classical Integration

## Purpose
Engineer reliable hybrid workflows connecting classical preprocessing, quantum execution, optimization, persistence, and downstream systems.

## When to use
Use for variational algorithms, batch quantum jobs, cloud provider integration, or production-adjacent experiments.

## Inputs
Workflow graph, API/SDK contracts, data inputs, backend credentials, retry policy, persistence and observability requirements.

## Context to inspect
Provider quotas, asynchronous job semantics, idempotency, result formats, serialization, checkpointing, and secret handling.

## Core knowledge
Quantum jobs are remote, failure-prone, and often long-running. Reliable systems treat execution as distributed work with explicit state transitions.

## Procedure
1. Define workflow stages and durable state boundaries.
2. Validate inputs and canonicalize circuit/parameter serialization.
3. Submit jobs with stable correlation identifiers.
4. Store provider job IDs and immutable configuration.
5. Poll or receive status with bounded retries and backoff.
6. Handle partial, failed, cancelled, and expired jobs explicitly.
7. Persist raw and interpreted results separately.
8. Make postprocessing deterministic and replayable.
9. Add metrics for queue, execution, failure, and cost.

## Decision points
Use synchronous calls only for short predictable jobs. Use durable orchestration when experiments span many jobs or provider retries.

## Common failure patterns
Duplicate submissions, losing provider job IDs, retrying non-idempotent actions blindly, and mixing secrets into experiment artifacts.

## Verification
Inject submission, timeout, and result-retrieval failures and confirm recovery without duplicate work.

## Expected output
A resilient hybrid workflow with durable provenance and bounded recovery behavior.

## Stop conditions
Stop when provider semantics are unknown, permissions are insufficient, or retries could create uncontrolled spend.