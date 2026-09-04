# Client Runtime Design

## Purpose
Design the client-side training runtime so federated workloads execute safely within device or site resource budgets and remain observable and upgradeable.

## When to use
Use when implementing a new FL client, expanding to constrained devices, or diagnosing crashes, battery drain, thermal throttling, or local training failures.

## Inputs
Client hardware profiles, OS/runtime constraints, model size, training workload, battery/thermal policies, network conditions, storage limits, and security requirements.

## Context to inspect
Inspect process lifecycle, foreground/background restrictions, available accelerators, memory pressure, local data access, checkpointing, version compatibility, and telemetry policy.

## Core knowledge
Client-side ML must coexist with the host application or site workload. Training eligibility, resource gating, graceful interruption, resumability, and sandboxing are production concerns, not implementation details.

## Procedure
1. Define supported client classes and minimum capabilities.
2. Establish CPU, memory, storage, network, and energy budgets.
3. Design local data access with least privilege.
4. Add training eligibility checks for power, connectivity, thermal state, and user activity.
5. Bound batch size and local steps by measured resource profiles.
6. Add cancellation and checkpoint semantics.
7. Isolate model artifacts and secrets from unrelated application state.
8. Version the runtime, model, protocol, and local state independently.
9. Emit privacy-safe health metrics and failure codes.
10. Load-test on low-end and degraded clients before rollout.

## Decision points
Use native acceleration only where deployment coverage and reproducibility justify it. Prefer resumable work for unstable environments. Skip participation rather than violating local resource policy.

## Common failure patterns
- Assuming datacenter-like resources.
- No cancellation path.
- Memory spikes during model deserialization.
- Training while user workload is active.
- Runtime/model protocol version mismatch.

## Verification
Verify resource ceilings, interruption recovery, version upgrades, data-access boundaries, and telemetry on representative client classes.

## Expected output
A client runtime specification and implementation plan with budgets, lifecycle rules, health signals, compatibility strategy, and test evidence.

## Stop conditions
Stop if client resource limits are unknown, local data permissions are unresolved, or host-platform lifecycle constraints cannot be satisfied safely.