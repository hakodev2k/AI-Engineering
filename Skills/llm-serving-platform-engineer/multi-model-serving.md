# Multi-Model Serving

## Purpose
Serve multiple models efficiently while controlling memory residency, routing correctness, noisy-neighbor effects, and rollout risk.

## When to use
Use when a shared platform hosts multiple base models, adapters, versions, or tenant-specific variants.

## Inputs
Model inventory, sizes, traffic, SLOs, compatibility, hardware pool, residency requirements, routing rules.

## Context to inspect
Model registry, artifact store, router, cache, accelerator memory, adapter support, warmup, eviction, and tenancy controls.

## Core knowledge
Multi-model systems trade consolidation against interference and cold starts. Residency policy must reflect demand, model size, load latency, and isolation. Adapter multiplexing can improve density but adds compatibility and lifecycle constraints.

## Procedure
1. Inventory models and variants with immutable identifiers. 2. Measure load/warmup time and steady footprint. 3. Classify hot, warm, and cold demand. 4. Define placement and eviction policy. 5. Route by validated model identity/version. 6. Isolate incompatible runtimes or security domains. 7. Limit concurrent loads to avoid I/O and memory storms. 8. Test model churn and cache eviction. 9. Add per-model SLO and cost telemetry. 10. Rehearse rollback and artifact unavailability.

## Decision points
Dedicate capacity to consistently hot/high-SLO models; share capacity for low-volume compatible models. Prefer adapters only when base-model compatibility and isolation are verified.

## Common failure patterns
Loading on every request, mutable model aliases without auditability, synchronized cold starts, eviction thrash, and aggregate-only monitoring.

## Verification
Test routing correctness, load latency, churn, concurrent models, isolation, and rollback under production-shaped traffic.

## Expected output
A model placement/residency strategy with routing, lifecycle, capacity, and telemetry controls.

## Stop conditions
Stop when model identity/provenance is ambiguous, artifact integrity is unverified, or isolation requirements cannot be met.