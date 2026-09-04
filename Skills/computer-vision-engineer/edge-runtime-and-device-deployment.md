# Edge Runtime and Device Deployment

## Purpose
Qualify and deploy vision inference on constrained edge devices with explicit control of runtime compatibility, latency, memory, power, thermal behavior, resilience, and fleet updates.

## When to use
Use for cameras, mobile hardware, embedded accelerators, robots, industrial gateways, kiosks, or other on-device vision systems.

## Inputs
Validated model, representative devices, camera/input pipeline, runtime/toolchain, power and thermal limits, connectivity assumptions, update mechanism, and quality SLOs.

## Preconditions
Production-like hardware and input streams are available; an unoptimized reference model can be evaluated on the same task data.

## Context to inspect
Inspect accelerator capabilities, supported operators and precisions, sensor formats, RAM/storage, thermal envelope, frame buffers, runtime versions, cold start, offline behavior, and secure update/rollback support.

## Core knowledge
Edge performance is a system property spanning capture, decode, preprocessing, inference, post-processing, and output. Hardware delegates may silently fall back to CPU. Sustained throughput can collapse under thermal or power constraints even when short benchmarks pass.

## Procedure
1. Define device-level quality, latency, FPS, memory, power, and startup targets.
2. Trace the complete sensor-to-decision pipeline.
3. Export to the supported runtime and compare numerical output with the reference model.
4. Profile each stage on representative devices.
5. Verify accelerator delegation and identify fallback operators.
6. Optimize precision, input size, buffering, and concurrency based on measured bottlenecks.
7. Run sustained-load tests long enough to expose thermal throttling and memory growth.
8. Test camera disconnects, corrupt frames, process restarts, storage pressure, and absent connectivity.
9. Define signed/versioned model packages and compatibility metadata where the platform supports them.
10. Use staged fleet rollout with health gates and a tested rollback path.
11. Collect privacy-preserving device telemetry sufficient for diagnosis.
12. Validate across hardware revisions before broad promotion.

## Decision points
Prefer on-device execution when latency, privacy, bandwidth, or offline requirements dominate. Use cloud inference when device capability is insufficient and network guarantees are acceptable. Reduce resolution only after measuring small-object and fine-detail regressions.

## Common failure patterns
Desktop benchmarks treated as device evidence, CPU fallback unnoticed, thermal throttling ignored, unbounded frame queues, incompatible model/runtime updates, and raw imagery collected by default for debugging.

## Verification
Verify sustained p50/p95/p99 latency, memory, power/thermal behavior, quality parity, accelerator use, restart/offline recovery, staged update, and rollback on real target hardware.

## Expected output
A device-qualified runtime package with compatibility matrix, benchmark evidence, rollout/rollback procedure, and operational telemetry.

## Stop conditions
Stop if target devices cannot meet quality and SLOs with margin, secure update/rollback requirements are unmet, or production conditions cannot be reproduced sufficiently for qualification.