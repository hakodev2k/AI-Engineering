# Training Observability

## Purpose
Instrument training so performance, convergence, numerical stability, data flow, and distributed failures can be diagnosed from evidence.

## When to use
Use for every production-scale training run and when scaling from experiments to clusters.

## Inputs
Training loop, distributed framework, metrics backend, hardware telemetry, experiment metadata, alerting requirements.

## Context to inspect
Loss, LR, gradient/update norms, tokens/sec, MFU, step time, memory, GPU utilization, communication, data-loader latency, errors, checkpoint events.

## Core knowledge
Aggregate averages hide stragglers and rank-specific failures. Metrics require consistent denominators and step/token semantics. High-cardinality logging can itself become a bottleneck.

## Procedure
1. Define a minimal metric contract before launch.
2. Attach immutable run/config/data identifiers.
3. Log convergence metrics against both steps and tokens.
4. Capture hardware and per-rank performance summaries.
5. Separate input, compute, communication, checkpoint and idle time.
6. Record numerical anomalies and retries explicitly.
7. Add alerts for stalls, divergence, NaNs, throughput collapse and storage failures.
8. Build dashboards comparing against known-good baselines.
9. Validate telemetry overhead.
10. Preserve enough logs for postmortem reconstruction.

## Decision points
Sample expensive per-layer metrics unless debugging. Increase telemetry during incidents, then return to bounded overhead. Alert on sustained deviations rather than noisy single steps unless the signal is catastrophic.

## Common failure patterns
Only logging loss; no token counter; rank-zero averages hiding stragglers; dashboards with inconsistent units; logs disappearing with preempted workers.

## Verification
Inject representative faults or stalls and confirm telemetry identifies them; reconcile throughput metrics with processed-token counters.

## Expected output
A stable metric/logging contract, dashboards, alerts, and run identifiers sufficient for diagnosis.

## Stop conditions
Stop or pause scale-up when critical correctness/stability metrics are absent or telemetry shows unexplained divergence.