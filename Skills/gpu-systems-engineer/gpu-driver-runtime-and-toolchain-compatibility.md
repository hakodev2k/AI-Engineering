# GPU Driver, Runtime, and Toolchain Compatibility

## Purpose
Manage the compatibility boundary among GPU hardware, kernel driver, runtime, compiler, libraries, containers, and application binaries.

## When to use
Use for deployments, upgrades, new GPU generations, containerization, unexplained initialization failures, or environment drift.

## Inputs
Hardware inventory, driver/runtime/compiler/library versions, container images, build flags, support matrices, failure logs.

## Preconditions
Capture a known-good environment and required hardware/software support window.

## Context to inspect
Inspect kernel driver, user-space runtime, compiler targets, binary/IR compatibility, library ABI, container runtime, device permissions, firmware dependencies, and orchestration configuration.

## Core knowledge
GPU stacks have layered compatibility rules; matching version numbers blindly is insufficient. Forward/backward compatibility differs by layer and vendor. Containers package user space but still depend on host driver/device integration.

## Procedure
1. Inventory every stack layer and target GPU architecture.
2. Consult authoritative compatibility/support matrices for the deployed stack.
3. Identify minimum driver and architecture requirements.
4. Verify compiled targets and fallback intermediate code.
5. Reproduce in a clean environment.
6. Upgrade one compatibility boundary at a time.
7. Run initialization, correctness, performance, and long-duration smoke tests.
8. Test every supported GPU class.
9. Pin and record validated combinations.
10. Define rollback and deprecation policy.

## Decision points
Prefer supported stable combinations over newest components by default. Carry intermediate code/fat binaries when deployment diversity warrants it. Upgrade drivers fleet-wide only after canary evidence.

## Common failure patterns
Assuming containers isolate drivers, missing architecture code, ABI mismatches, silent CPU fallback, mixing incompatible libraries, upgrading many layers simultaneously, and validating only startup rather than workload behavior.

## Verification
Verify device discovery, compiled target support, representative correctness/performance, container/host integration, health telemetry, and rollback.

## Expected output
A validated compatibility matrix, pinned stack, rollout plan, and diagnostics for unsupported combinations.

## Stop conditions
Stop when vendor support status is ambiguous for a production-critical combination, firmware/driver changes require unauthorized host access, or rollback is unavailable.