# Inference Autoscaling

## Purpose
Scale inference capacity in response to demand while controlling queueing, cold-start delay, accelerator cost, and SLO risk.

## When to use
Use when traffic varies materially over time and fixed capacity creates either excessive cost or recurring saturation.

## Inputs
Traffic history, latency SLOs, queue metrics, model load time, accelerator provisioning delay, minimum capacity, cost targets, and scheduler behavior.

## Context to inspect
Inspect request rate, token rate, concurrency, queue age, prefill/decode mix, replica startup time, model-loading path, cache warmup, and cloud quota constraints.

## Core knowledge
Request count alone is a weak scaling signal for variable-length AI workloads. Token throughput, active sequences, queue age, and memory pressure are often better signals. Slow accelerator provisioning requires predictive headroom or warm capacity.

## Procedure
1. Characterize demand in requests, input tokens, output tokens, and concurrency.
2. Identify the earliest reliable saturation signals.
3. Measure replica startup and readiness time.
4. Define minimum warm capacity and maximum safe utilization.
5. Choose reactive, predictive, or hybrid scaling signals.
6. Add cooldown and hysteresis to avoid oscillation.
7. Ensure new replicas are ready before receiving traffic.
8. Test scale-out during bursts and scale-in during long generations.
9. Verify requests are drained safely before termination.
10. Compare SLO compliance and cost against fixed-capacity baseline.

## Decision points
Use queue age when latency is the primary concern; token and utilization signals when workload sizes vary. Maintain warm reserve when startup delay exceeds the available queueing budget.

## Common failure patterns
Scaling on CPU for GPU-bound services, ignoring model load time, oscillating replicas, terminating active generations, and using requests/sec without accounting for token lengths.

## Verification
Replay realistic demand curves and confirm bounded queue age, safe scale-in, predictable startup, and improved cost efficiency without SLO regression.

## Expected output
An autoscaling policy with signals, thresholds, headroom, readiness, and drain semantics.

## Stop conditions
Stop when infrastructure quotas make scale-out unreliable, startup delay cannot fit the operating model, or demand cannot be observed with sufficient fidelity.