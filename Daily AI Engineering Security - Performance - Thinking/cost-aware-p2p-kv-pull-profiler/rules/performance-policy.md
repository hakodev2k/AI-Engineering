# Rules: Cost-Aware KV Performance Policy

- A pull-versus-recompute policy MUST be calibrated from measured data for the active deployment signature.
- TTFT, achieved throughput and failed-pull rate MUST be recorded before and after policy changes.
- Samples with different model, hardware or topology MUST NOT be pooled when same-segment calibration is required.
- A segment with fewer than the configured minimum samples per path MUST NOT produce a production recommendation.
- Destination load SHOULD be represented explicitly; idle-only crossover measurements MUST NOT be assumed valid under saturation.
- Failed transfers MUST be counted in the pull-path cost and MUST NOT be silently excluded from rollout decisions.
- A policy MUST NOT be promoted when TTFT p95 regresses beyond the configured threshold.
- A policy MUST NOT be promoted when failed-pull rate exceeds the configured maximum.
- Optimization claims MUST identify baseline, workload, deployment signature and measurement window.
- Performance improvements MUST NOT weaken authentication, isolation, transport security, or data-handling boundaries.
