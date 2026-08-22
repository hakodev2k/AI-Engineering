# Runtime Tuning

## Purpose
Tune runtime, process, thread, memory, and connection settings only after evidence shows defaults or current limits constrain performance.

## When to use
Use after profiling identifies runtime-level saturation, pool starvation, GC behavior, JIT/startup cost, or resource limits as material bottlenecks.

## Inputs
Runtime metrics, profiles, configuration, workload, resource limits, deployment topology, and before/after benchmarks.

## Context to inspect
Inspect thread/executor pools, connection pools, GC mode, heap limits, JIT/AOT behavior, process/container CPU quotas, file descriptors, sockets, and timeout settings.

## Core knowledge
Runtime knobs interact. Larger pools can increase contention; larger heaps can change pause behavior; aggressive timeouts can amplify retries. Tune one causal constraint at a time and keep rollback simple.

## Procedure
1. Identify the runtime constraint from telemetry or profiles.
2. Document current defaults and effective configuration.
3. Establish a reproducible baseline.
4. Select the smallest configuration change that tests the hypothesis.
5. Apply within safe resource bounds.
6. Measure latency, throughput, resource efficiency, and failure behavior.
7. Check downstream impact and contention.
8. Repeat only when evidence supports another adjustment.
9. Document rationale, effective values, and rollback.
10. Validate under sustained and peak workload.

## Decision points
Prefer fixing application behavior when tuning merely masks excessive work. Tune pools to constrained-resource capacity, not arbitrary high values.

## Common failure patterns
Copying internet tuning values, changing many knobs, ignoring container limits, increasing connection pools beyond database capacity, and tuning benchmark-only workloads.

## Verification
The targeted bottleneck is reduced under representative workload and the configuration remains stable during peak and endurance tests.

## Expected output
A minimal runtime configuration change with measured benefit and documented trade-offs.

## Stop conditions
Stop when runtime tuning risks unsupported configuration, violates platform constraints, or lacks reproducible evidence.