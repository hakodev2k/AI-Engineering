# Hybrid Quantum-Classical Workflows

## Purpose
Engineer reliable workflows where classical services orchestrate quantum circuit generation, execution, optimization, and post-processing.

## When to use
Use for variational algorithms, batched experiments, parameter sweeps, iterative calibration-aware workloads, or production-like quantum services.

## Inputs
Workflow graph, quantum kernels, classical compute steps, backend API, persistence requirements, budgets, and failure policy.

## Context to inspect
Data boundaries, parameter formats, batching limits, queue latency, optimizer state, checkpointing, retry semantics, and experiment lineage.

## Core knowledge
Quantum execution is usually remote, stochastic, asynchronous, and expensive. Hybrid systems need durable state, deterministic orchestration where possible, controlled concurrency, and clear separation between scientific retries and infrastructure retries.

## Procedure
1. Model the workflow as explicit stages and state transitions.
2. Separate deterministic preprocessing from stochastic quantum execution.
3. Define durable identifiers for experiment, iteration, circuit, and backend job.
4. Batch compatible circuits without losing traceability.
5. Persist optimizer and intermediate state for restartability.
6. Set timeouts and bounded retries by failure class.
7. Keep raw quantum results immutable.
8. Make post-processing reproducible from persisted inputs.
9. Track cost, shots, queue time, and classical compute separately.
10. Test interruption and resume behavior.
11. Instrument the complete workflow end to end.

## Decision points
Use synchronous orchestration for tiny interactive experiments; use durable asynchronous workflows when queue latency, iteration count, or business reliability matters.

## Common failure patterns
Retrying completed jobs, losing optimizer state, conflating backend latency with computation time, mutable experiment parameters, and untraceable batch aggregation.

## Verification
Kill and resume a test workflow, reproduce post-processing from stored artifacts, validate job deduplication, and reconcile resource accounting.

## Expected output
A restartable, observable hybrid workflow with durable lineage and controlled failure handling.

## Stop conditions
Stop when provider job semantics cannot support safe recovery, state cannot be persisted, or execution cost lacks enforceable bounds.