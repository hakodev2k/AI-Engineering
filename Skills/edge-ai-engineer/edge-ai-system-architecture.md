# Edge AI System Architecture

## Purpose
Design end-to-end edge AI systems that place sensing, preprocessing, inference, decision logic, storage, networking, and cloud responsibilities at appropriate boundaries. The goal is predictable behavior under constrained compute, memory, power, bandwidth, and connectivity.

## When to use
Use when defining a new edge AI product, decomposing cloud and device responsibilities, replacing a cloud-only pipeline with local inference, or reviewing an architecture that must tolerate intermittent connectivity.

## Inputs
Product requirements, device hardware, model candidates, sensors, network assumptions, latency and accuracy targets, privacy requirements, power budget, fleet scale, and operational constraints.

## Preconditions
Critical non-functional requirements and hardware envelopes must be measurable rather than implied.

## Context to inspect
Existing device services, boot lifecycle, accelerator APIs, model runtime, data formats, update mechanism, telemetry, storage, cloud APIs, and failure modes.

## Core knowledge
Edge architecture is dominated by resource and failure boundaries. Local inference reduces round trips and data exposure but moves lifecycle, security, observability, and compatibility responsibilities onto devices. Cloud-edge partitioning must account for stale state, offline operation, model versions, rollback, and asymmetric fleet capability.

## Procedure
1. Define the user-visible decision and maximum acceptable end-to-end latency.
2. Map every stage from sensor acquisition through action.
3. Quantify compute, memory, storage, bandwidth, power, and thermal budgets.
4. Classify data by privacy and retention requirements.
5. Decide which stages must function offline.
6. Partition processing between device, gateway, and cloud.
7. Define model/runtime compatibility contracts.
8. Design update, rollback, and version negotiation.
9. Define degradation modes when compute, sensors, or connectivity fail.
10. Add telemetry for latency, accuracy proxies, resource use, and model version.
11. Threat-model device and model supply-chain boundaries.
12. Validate the design on representative hardware before freezing interfaces.

## Decision points
Prefer on-device processing for strict latency, privacy, or offline requirements; use cloud processing when model size, global context, or centralized governance dominates. Hybrid designs are often appropriate but require explicit synchronization semantics.

## Common failure patterns
Assuming constant connectivity, ignoring model footprint during design, no rollback path, uncontrolled local storage growth, hardware-specific logic leaking everywhere, and treating fleet observability as optional.

## Verification
Run representative workloads on target devices, simulate offline and degraded conditions, measure end-to-end latency and resource headroom, verify update/rollback, and confirm data handling matches privacy requirements.

## Expected output
A documented architecture with explicit boundaries, resource budgets, compatibility contracts, failure modes, and measurable acceptance criteria.

## Stop conditions
Stop when hardware limits, privacy constraints, or required offline behavior are undefined, because those ambiguities materially change the architecture.