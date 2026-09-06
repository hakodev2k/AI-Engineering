# Power and Thermal Rules

## Purpose
Account for power limits, clock behavior, and thermal throttling when evaluating sustained GPU performance.

## Scope
Power caps, clocks, thermals, cooling, sustained load, and energy efficiency.

## MUST
- Long-running benchmarks MUST monitor clock, temperature, and power behavior when throttling can affect conclusions.
- Performance comparisons MUST disclose materially different power limits or clock policies.
- Sustained-load tests MUST distinguish transient boost performance from stable throughput.
- Power tuning MUST remain within supported hardware and operational limits.

## MUST NOT
- MUST NOT claim stable performance from short runs that avoid thermal steady state.
- MUST NOT bypass hardware safety controls to obtain benchmark gains.
- MUST NOT compare energy efficiency without measuring both useful work and power or energy consumption.

## SHOULD
- SHOULD evaluate performance per watt for cost- or power-constrained deployments.
- SHOULD record thermal conditions for reproducible capacity tests.

## Exceptions
Exceptions require hardware-owner approval and documented safety boundaries.

## Verification
Inspect telemetry, power-limit configuration, sustained benchmarks, clock traces, and thermal records.