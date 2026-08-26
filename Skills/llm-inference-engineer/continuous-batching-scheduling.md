# Continuous Batching and Scheduling

## Purpose
Tune request scheduling to maximize useful accelerator work while protecting latency and fairness.

## When to use
Use when throughput is low, queues grow, TTFT regresses, long requests starve short ones, or runtime scheduling is being configured.

## Inputs
Traffic traces, token lengths, SLOs, batch controls, cache limits, runtime metrics, and priority requirements.

## Context to inspect
Admission queue, scheduler policy, prefill/decode behavior, batch-token limits, cache allocation, cancellation handling, and priority classes.

## Core knowledge
Continuous batching trades queueing and memory pressure for higher utilization. Prefill is compute intensive; decode is often memory-bandwidth constrained. Scheduler policy changes tail latency and fairness, not merely throughput.

## Procedure
1. Segment requests by prompt length, output length, priority, and latency objective.
2. Establish baseline TTFT, inter-token latency, throughput, queue time, and GPU utilization.
3. Identify whether prefill, decode, queueing, or cache pressure dominates.
4. Tune token-based rather than request-count-only limits where supported.
5. Test chunked prefill and scheduling policies against realistic mixed traffic.
6. Add admission limits before the saturation knee.
7. Validate cancellation releases scheduler and cache resources promptly.
8. Test priority/fairness behavior under adversarial long requests.
9. Record safe operating ranges.

## Decision points
Favor larger batches for throughput-oriented offline work; constrain queueing for interactive workloads. Separate pools when one scheduler cannot satisfy incompatible objectives.

## Common failure patterns
Maximizing batch size blindly, starvation, head-of-line blocking, unlimited queues, and benchmarking fixed-length synthetic requests only.

## Verification
Replay production-like distributions at increasing load and confirm fairness, SLOs, cancellation, and stable memory behavior.

## Expected output
Scheduler configuration with evidence, saturation thresholds, and workload-specific policy.

## Stop conditions
Escalate when runtime scheduling controls cannot express required priority or isolation guarantees.