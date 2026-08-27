# Remote Build Execution

## Purpose
Move eligible build actions to remote workers while preserving correctness, security, and predictable latency.

## When to use
Use when local CPU/memory is a bottleneck, builds parallelize well, or centralized toolchains improve consistency.

## Inputs
Action graph, execution timings, input/output sizes, worker platforms, network metrics, toolchain images, and security requirements.

## Context to inspect
Inspect action hermeticity, platform constraints, sandboxing, remote protocol, worker pools, queue time, cache integration, secrets, and observability.

## Core knowledge
Remote execution pays off only when queue plus transfer plus execution is better than local execution or when capacity consistency matters. Actions must declare inputs and platform requirements. Workers are a trust boundary.

## Procedure
1. Establish local critical-path baselines.
2. Classify actions by cost, data size, hermeticity, and platform.
3. Make candidate actions self-contained and deterministic.
4. Package/pin toolchains for workers.
5. Define worker pools and platform properties.
6. Configure content-addressed input/output transfer and caching.
7. Enforce sandboxing, identity, quotas, and secret isolation.
8. Add queue, transfer, execution, retry, and failure telemetry.
9. Roll out to high-value actions first.
10. Compare end-to-end latency and cost under realistic concurrency.

## Decision points
Keep tiny or high-I/O actions local when remote overhead dominates. Separate worker pools for incompatible toolchains, hardware, or trust levels. Prefer remote cache without execution when reuse gives most of the benefit.

## Common failure patterns
Shipping huge source trees per action, hidden local dependencies, worker image drift, retry storms, unconstrained concurrency, leaking credentials, and measuring execution time without queue/transfer time.

## Verification
Run clean builds locally and remotely; compare artifacts; test worker loss and retries; validate denied undeclared access; benchmark critical path and throughput.

## Expected output
An execution policy, worker requirements, security controls, telemetry, and measured performance/cost evidence.

## Stop conditions
Stop if actions cannot be made hermetic enough, worker trust controls are inadequate, or network economics make remote execution consistently slower.