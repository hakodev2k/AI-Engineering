# Energy Efficiency Rules

## Purpose
Reduce unnecessary energy consumption without compromising required reliability, security, or correctness.

## Scope
Applies to runtime code, infrastructure, data processing, and recurring automation.

## MUST
- Energy-efficiency work MUST target measured hotspots or high-frequency workloads.
- Optimizations MUST preserve functional correctness and required service objectives.
- Material changes MUST be evaluated under representative load.

## MUST NOT
- MUST NOT trade away required security, resilience, or data integrity solely for lower energy use.
- MUST NOT claim efficiency gains without before/after evidence.

## SHOULD
- Prefer reducing wasted work before introducing specialized hardware or complex scheduling.
- Eliminate polling, redundant computation, unnecessary serialization, and avoidable data movement where practical.

## Exceptions
Exceptions require the constraint, alternatives considered, operational risk, and evidence supporting the chosen trade-off.

## Verification
Use profilers, runtime telemetry, benchmarks, utilization data, workload traces, and regression tests to confirm reduced resource consumption without unacceptable degradation.
