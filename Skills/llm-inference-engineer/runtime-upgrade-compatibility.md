# Runtime Upgrade and Compatibility

## Purpose
Upgrade inference runtimes, CUDA stacks, drivers, and kernels without introducing silent correctness or performance regressions.

## When to use
Use for runtime, framework, CUDA, driver, attention-kernel, or container-base upgrades.

## Inputs
Current/candidate versions, hardware matrix, model set, serving configuration, tests, and performance baseline.

## Context to inspect
Driver compatibility, compiled extensions, model formats, quantization support, distributed backend, APIs, metrics, and known runtime limitations.

## Core knowledge
Inference stacks are tightly coupled across driver, CUDA libraries, framework/runtime, kernels, and model formats. A build that starts successfully can still regress output, memory, or latency.

## Procedure
1. Inventory the complete current version matrix.
2. Read candidate compatibility and breaking-change notes.
3. Build an immutable candidate image and produce dependency metadata.
4. Run model-loading and API contract tests across supported models.
5. Run deterministic/quality comparisons with controlled sampling.
6. Benchmark memory, TTFT, inter-token latency, throughput, and startup time.
7. Exercise distributed, quantized, long-context, and cancellation paths.
8. Canary on each hardware class.
9. Retain prior images/artifacts for immediate rollback.

## Decision points
Upgrade urgently for critical security/stability fixes; otherwise require measurable benefit or maintenance need. Split hardware pools when one version cannot support the full matrix safely.

## Common failure patterns
Changing driver and runtime without attribution, testing one model only, missing quantized paths, and accepting benchmark gains with memory regressions.

## Verification
All compatibility, quality, load, and rollback gates pass on target hardware.

## Expected output
Approved version matrix and evidence-backed rollout.

## Stop conditions
Stop on unexplained output changes, unsupported driver combinations, or material SLO regression.