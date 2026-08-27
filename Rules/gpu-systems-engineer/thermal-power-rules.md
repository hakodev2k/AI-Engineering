# Thermal and Power Rules

## Purpose
Prevent throttling, instability, unsafe operation, and capacity errors caused by thermal or power constraints.

## Scope
GPU power limits, clocks, thermals, cooling dependencies, and sustained-load behavior.

## MUST
- Sustained performance validation MUST include thermal and power telemetry.
- Capacity assumptions MUST account for throttling under representative long-duration load.
- Power-limit or clock changes in production MUST require documented risk, validation, and approval.
- Thermal alarms and hardware protection events MUST be observable.
- Repeated throttling or thermal faults MUST trigger investigation rather than benchmark normalization.

## MUST NOT
- MUST NOT extrapolate short cold-start benchmarks to sustained production performance.
- MUST NOT disable hardware safety controls to achieve benchmark targets.
- MUST NOT apply overclocking or unsupported power settings to production systems without explicit authorization.

## SHOULD
- Correlate temperature, power, clocks, and throughput during performance investigations.
- Preserve safe operational headroom.

## Exceptions
Laboratory experiments outside production require bounded hardware, owner, monitoring, and safety constraints.

## Verification
Inspect telemetry, sustained-load tests, platform settings, alerting, throttling counters, and change approvals.