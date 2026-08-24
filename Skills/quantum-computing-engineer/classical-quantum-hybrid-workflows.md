# Classical-Quantum Hybrid Workflows

## Purpose
Engineer reliable hybrid workflows that coordinate classical preprocessing, quantum execution, iterative optimization, retries, caching, and post-processing.

## When to use
Use when quantum work is embedded inside a larger application or experiment pipeline.

## Inputs
Workflow graph, backend APIs, data dependencies, optimizer loop, retry policy, latency/cost limits, reproducibility requirements.

## Preconditions
Each quantum step has a defined contract and standalone validation case.

## Context to inspect
Job submission APIs, queue behavior, idempotency, checkpointing, result schemas, provider limits, credential handling, and failure modes.

## Core knowledge
Quantum calls are often remote, asynchronous, stochastic, and expensive. Hybrid loops need durable state, deterministic metadata, bounded retries, and separation between algorithm state and provider-specific job state.

## Procedure
1. Model the workflow as explicit stages and state transitions.
2. Define immutable experiment/run identifiers.
3. Validate and normalize classical inputs before quantum submission.
4. Make job submission idempotent where possible.
5. Persist backend job IDs and circuit versions.
6. Bound polling, retry, timeout, and cancellation behavior.
7. Checkpoint optimizer state between quantum evaluations.
8. Validate result completeness before post-processing.
9. Cache reusable deterministic artifacts safely.
10. Record cost, shots, backend, calibration window, and software versions.
11. Provide classical fallback or graceful failure where required.

## Decision points
Use synchronous calls only for short bounded jobs. Prefer durable orchestration for batch or iterative experiments. Cache circuits/results only when parameters and backend assumptions are part of the cache key.

## Common failure patterns
Duplicate submissions, lost optimizer state, unbounded polling, mixing provider IDs with domain IDs, and unreproducible result aggregation.

## Verification
Inject submission failures, timeouts, duplicate responses, and partial results; verify workflow recovery and repeatability.

## Expected output
Workflow contract, persisted state model, retry/cancellation policy, provenance metadata, and recovery evidence.

## Stop conditions
Stop when provider semantics prevent safe retry or critical run state cannot be persisted.