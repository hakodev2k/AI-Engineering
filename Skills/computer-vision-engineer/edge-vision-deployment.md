# Edge Vision Deployment

## Purpose
Deploy computer vision reliably on constrained edge devices with bounded compute, memory, power, thermal, and connectivity resources.

## When to use
Use for cameras, embedded GPUs, mobile NPUs, industrial gateways, or intermittently connected systems.

## Inputs
Target device, model, runtime, power/thermal limits, update channel, offline requirements.

## Preconditions
Target hardware and production workload are available for testing.

## Context to inspect
Accelerator support, memory pressure, startup time, thermal throttling, camera pipeline, storage, watchdogs, OTA/update path.

## Core knowledge
Edge performance changes with temperature, power states, competing workloads, and runtime support. Recovery and rollback matter as much as nominal FPS.

## Procedure
1. Establish device-level resource budgets.
2. Verify preprocessing and model runtime compatibility.
3. Benchmark cold start and sustained workloads.
4. Measure CPU/GPU/NPU, memory, power, and temperature.
5. Define buffering/backpressure and offline behavior.
6. Package model/runtime versions atomically.
7. Implement health checks and rollback.
8. Test reboot, storage pressure, camera loss, and network loss.

## Decision points
On-device vs cloud fallback; model compression vs hardware upgrade; continuous vs event-triggered inference.

## Common failure patterns
Desktop-only benchmarks, thermal throttling surprises, non-atomic updates, memory leaks, unbounded frame queues.

## Verification
Sustained soak tests, resource telemetry, restart/recovery tests, update rollback, and output parity on target hardware.

## Expected output
Deployable edge package, resource profile, recovery plan, and verified update procedure.

## Stop conditions
Stop when thermal, power, memory, or safety limits cannot be met.