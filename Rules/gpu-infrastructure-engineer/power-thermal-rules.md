# GPU Power and Thermal Rules

## Purpose
Keep accelerator fleets within safe electrical and thermal envelopes while preserving predictable performance and hardware life.

## Scope
Applies to GPU power limits, host power, rack capacity, cooling, temperature, throttling, and facility constraints.

## MUST
- Power and cooling capacity MUST be validated against installed hardware, expected utilization, redundancy requirements, and failure scenarios.
- Thermal throttling, power-limit events, and abnormal temperature MUST be observable at device and failure-domain levels.
- Changes to GPU power limits or performance states MUST be benchmarked for workload impact and validated against supported hardware limits.
- Capacity placement MUST respect rack, circuit, and cooling constraints.
- Sustained thermal anomalies MUST trigger investigation before affected hardware is treated as healthy.

## MUST NOT
- Unsupported power or clock settings MUST NOT be applied to production hardware without explicit engineering validation and approval.
- Cooling or power alarms MUST NOT be suppressed merely to keep capacity schedulable.
- Short benchmark gains MUST NOT justify configurations that increase instability or violate hardware support boundaries.

## SHOULD
- Efficiency tuning SHOULD compare useful workload throughput per unit of power, not power consumption alone.
- Thermal trends SHOULD be analyzed by rack, hardware generation, ambient condition, and workload class.

## Exceptions
Exceptions require measured evidence, safety review, rollback, and accountable approval.

## Verification
Review facility capacity, device telemetry, throttling events, power settings, benchmark results, alarm history, and hardware support documentation.