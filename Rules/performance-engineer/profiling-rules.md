# Profiling Rules
## Purpose
Locate actual resource and execution bottlenecks before changing code.
## Scope
CPU, wall time, allocations, locks, I/O, runtime, and application profiles.
## MUST
- Profile a representative workload before broad optimization.
- Preserve symbols and context needed to attribute hot paths.
- Correlate profiles with runtime metrics and observed symptoms.
## MUST NOT
- Optimize a suspected hotspot solely from code inspection when profiling is practical.
- Treat profiler overhead as invisible when interpreting sensitive measurements.
## SHOULD
- Capture before/after profiles for material changes.
## Exceptions
When profiling is impossible, use the strongest available telemetry and document uncertainty.
## Verification
Inspect profiles, flame graphs, traces, workload description, and before/after evidence.