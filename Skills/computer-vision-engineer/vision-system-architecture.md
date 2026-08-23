# Vision System Architecture

## Purpose
Design end-to-end computer vision systems with explicit boundaries for capture, preprocessing, models, post-processing, decision logic, storage, and serving.

## When to use
Use for new vision products, major redesigns, or architecture reviews.

## Inputs
Use cases, camera/sensor constraints, latency/SLA, accuracy targets, deployment environment, privacy rules, cost limits.

## Preconditions
Success metrics and operating conditions are defined.

## Context to inspect
Data flow, hardware, model families, runtime, interfaces, observability, failure handling, update process.

## Core knowledge
Vision systems fail across data, optics, timing, model behavior, integration, and serving. Architecture must separate concerns while preserving measurable end-to-end behavior.

## Procedure
1. Define decisions the system must support.
2. Map capture-to-output stages.
3. Allocate latency and resource budgets.
4. Define contracts between stages.
5. Separate offline training from online inference concerns.
6. Define fallback and degraded modes.
7. Identify privacy/security boundaries.
8. Plan versioning, rollback, and observability.
9. Validate architecture against representative workloads.

## Decision points
Edge vs cloud, batch vs streaming, single model vs cascade, synchronous vs asynchronous inference.

## Common failure patterns
Hidden coupling, unbounded queues, unclear ownership, no fallback, training-serving skew, missing telemetry.

## Verification
Review measured latency, throughput, failure recovery, data lineage, and model-version traceability.

## Expected output
Architecture diagram, contracts, budgets, risks, and deployment model.

## Stop conditions
Escalate when hardware, privacy, or safety constraints make the proposed architecture infeasible.