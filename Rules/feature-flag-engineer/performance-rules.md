# Performance Rules

## Purpose
Ensure feature-flag evaluation does not materially degrade latency, throughput, memory, or cost.

## Scope
Evaluation paths, SDK synchronization, telemetry, and targeting computation.

## MUST
- Flag evaluation on hot paths MUST have an explicit performance budget.
- Performance claims MUST be supported by before/after measurements.
- Network-dependent evaluation MUST use bounded timeouts and avoid unnecessary synchronous calls.
- High-volume telemetry MUST be capacity-tested or sampled appropriately.

## MUST NOT
- A flag lookup MUST NOT introduce an unbounded external dependency into a critical request path.
- Optimization MUST NOT sacrifice correctness or security without approved trade-off analysis.
- Teams MUST NOT claim negligible overhead without measurement when scale makes overhead material.

## SHOULD
- Stable local evaluation SHOULD be preferred when it meets consistency and security requirements.

## Exceptions
Budget exceedance requires evidence, impact analysis, mitigation plan, and owner approval.

## Verification
Use benchmarks, load tests, profiles, latency histograms, resource metrics, and dependency traces.