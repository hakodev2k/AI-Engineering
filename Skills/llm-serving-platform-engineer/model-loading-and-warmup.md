# Model Loading and Warmup

## Purpose
Make model startup deterministic, bounded, observable, and safe for production rollouts and autoscaling.

## When to use
Use when cold starts, artifact downloads, kernel compilation, graph capture, or warmup delay readiness.

## Inputs
Artifacts, runtime, hardware, model size, storage/network characteristics, readiness criteria, rollout strategy.

## Context to inspect
Artifact cache, checksums, download path, deserialization, shard loading, compilation, graph capture, health probes, and startup logs.

## Core knowledge
Process start is not serving readiness. Model loading can stress object storage, network, host memory, disk, and GPU memory simultaneously. Warmup must exercise representative execution paths before traffic.

## Procedure
1. Define immutable artifact identity and integrity checks. 2. Break startup into timed phases. 3. Cache artifacts safely where beneficial. 4. Bound parallel downloads/loads. 5. Validate tokenizer/config/shard compatibility. 6. Allocate device memory and initialize collectives. 7. Run representative warmup requests. 8. Mark ready only after correctness and latency checks. 9. Test restart storms and missing/corrupt artifacts. 10. Record startup SLOs.

## Decision points
Pre-bake artifacts when image size and release cadence permit; otherwise use local caching with integrity validation. Warm pools are justified when cold-start time exceeds traffic tolerance.

## Common failure patterns
Readiness before warmup, downloading identical weights concurrently, no checksum verification, hidden compilation on first user request, and startup probes that test only process liveness.

## Verification
Measure phase timings, restart-storm behavior, first-request latency, artifact integrity failures, and readiness correctness.

## Expected output
A deterministic loading/warmup pipeline with startup telemetry and safe readiness gates.

## Stop conditions
Stop when artifacts lack trustworthy identity, runtime compatibility is unknown, or warmup cannot represent required execution paths.