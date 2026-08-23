# Performance and Timing Rules

## Purpose
Ensure optimization is driven by system budgets and target measurements.

## Scope
CPU utilization, execution time, throughput, bus bandwidth, startup time, and hot paths.

## MUST
- Define relevant performance budgets before optimizing critical paths.
- Support performance claims with before/after target measurements under comparable conditions.
- Preserve correctness and worst-case timing when applying optimizations.

## MUST NOT
- Trade away safety, data integrity, or protocol correctness for unmeasured speed.
- Optimize solely from intuition when profiling or timing evidence is available.

## SHOULD
- Optimize the measured bottleneck at the narrowest maintainable layer.

## Exceptions
Predictive optimization may be justified for hard hardware limits when assumptions and calculations are documented.

## Verification
Use cycle counters, profilers, traces, bus captures, benchmarks, and regression thresholds on representative targets.