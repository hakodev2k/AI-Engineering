# Driver and Runtime Compatibility

## Purpose
Manage accelerator drivers, CUDA/ROCm runtimes, libraries, kernels, containers, and framework compatibility without destabilizing AI workloads.

## When to use
Use for fleet upgrades, new hardware, framework upgrades, or unexplained runtime failures.

## Inputs
Driver versions, runtime/library matrix, framework versions, container images, kernel/OS versions, hardware models.

## Context to inspect
Known-good combinations, vendor support matrix, image dependencies, node pools, rollout tooling, rollback capability, and prior incompatibility incidents.

## Core knowledge
Compatibility spans host driver, device firmware, runtime, collective libraries, framework binaries, and container assumptions. Newer is not automatically compatible or faster.

## Procedure
1. Inventory the current compatibility matrix.
2. Identify the minimum change required.
3. Validate vendor/framework support constraints.
4. Build a canary node pool with the candidate stack.
5. Run training, inference, collective, and health tests.
6. Compare correctness and performance with baseline.
7. Roll out by failure domain with drain/recovery controls.
8. Monitor runtime errors and performance regressions.
9. Preserve a tested rollback path until stabilization.

## Decision points
Pin versions for reproducibility when change velocity is low; adopt newer stacks when required for hardware, security, or measured gains.

## Common failure patterns
Fleet-wide upgrades, incompatible container assumptions, library ABI drift, missing rollback images, and treating successful startup as full validation.

## Verification
Run representative workloads and compare errors, throughput, latency, collectives, and device health.

## Expected output
A tested compatibility matrix and controlled upgrade/rollback plan.

## Stop conditions
Stop if vendor support is unclear or rollback cannot be guaranteed for production-critical fleets.