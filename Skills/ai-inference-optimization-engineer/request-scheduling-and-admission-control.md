# Request Scheduling and Admission Control

## Purpose
Protect inference latency and stability by deciding which requests may enter service, how they are prioritized, and how scarce accelerator capacity is allocated.

## When to use
Use when bursts, heterogeneous request sizes, or multiple service classes cause queue growth, starvation, or OOM risk.

## Inputs
Latency SLOs, request priorities, prompt/output limits, capacity model, memory estimates, concurrency targets, and fairness requirements.

## Context to inspect
Inspect queue depth, request age, token-length estimates, batch scheduler behavior, cancellation semantics, tenant limits, and overload patterns.

## Core knowledge
Admission control prevents overload from becoming collapse. Scheduling should account for request size, urgency, fairness, and memory—not only arrival order. Long requests can create head-of-line blocking; aggressive prioritization can starve lower classes.

## Procedure
1. Define service classes and their SLOs.
2. Estimate per-request compute and memory cost using available request metadata.
3. Establish hard safety limits for context length, concurrency, and memory.
4. Choose queue disciplines appropriate to fairness and latency goals.
5. Add deadlines and cancellation propagation.
6. Prevent large requests from monopolizing capacity.
7. Define reject, shed, degrade, or defer behavior at saturation.
8. Test burst traffic and mixed short/long workloads.
9. Measure queue delay, fairness, throughput, rejection rate, and tail latency.
10. Tune policies from measured saturation behavior.

## Decision points
Use FIFO for homogeneous traffic; weighted or size-aware scheduling for heterogeneous service classes. Reject early when accepting a request would violate safety or make downstream failure highly likely.

## Common failure patterns
Unbounded queues, no cancellation cleanup, estimating cost from request count rather than tokens, starving background jobs indefinitely, and allowing oversized requests to trigger OOM.

## Verification
Load tests must demonstrate bounded queues, stable memory, defined overload behavior, and service-class SLO compliance.

## Expected output
A documented scheduling and admission policy with measurable capacity limits and overload semantics.

## Stop conditions
Stop when request cost cannot be bounded, policy conflicts with contractual fairness requirements, or the runtime cannot safely cancel or evict work.