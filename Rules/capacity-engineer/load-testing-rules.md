# Load Testing

## Purpose
Ensure performance tests provide credible evidence for capacity claims.

## Scope
Applies to benchmark, load, stress, soak, burst, and failover tests used for sizing or release decisions.

## MUST
- Capacity tests MUST use representative workload mix, data shape, concurrency, and dependency behavior.
- Test environments MUST document material differences from production and how results are adjusted or bounded.
- Tests MUST capture throughput, latency distributions, errors, queueing, saturation, and resource consumption.
- Claimed capacity limits MUST identify the failure or service-objective boundary observed.

## MUST NOT
- MUST NOT infer linear production capacity from small-scale tests without validated scaling behavior.
- MUST NOT discard warm-up, throttling, cache, or degradation effects that occur in sustained operation.
- MUST NOT publish a capacity number without reproducible test conditions.

## SHOULD
- Critical systems SHOULD include soak and failure-mode tests in addition to peak-load tests.
- Tests SHOULD be automated enough to support regression comparison.

## Exceptions
Non-representative tests require explicit limitations and must not be used as definitive production capacity evidence.

## Verification
Inspect test configuration, workload generators, telemetry, environment parity, raw results, and reproducibility records.
