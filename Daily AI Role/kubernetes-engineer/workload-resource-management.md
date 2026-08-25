# Workload Resource Management

## Purpose
Set defensible CPU, memory, and ephemeral-storage requests and limits so workloads schedule predictably and clusters remain efficient under contention.

## When to use
Use when onboarding services, correcting OOMKills or throttling, improving bin packing, or planning capacity.

## Inputs
Deployment manifests, utilization metrics, latency/SLO data, autoscaling behavior, load tests, and node capacity.

## Context to inspect
Inspect requests/limits, QoS classes, HPA/VPA configuration, JVM/runtime behavior, historical percentiles, restart reasons, and namespace quotas.

## Core knowledge
Requests drive scheduling; limits constrain runtime. CPU limits can throttle latency-sensitive services; memory limit breaches cause OOM termination. QoS, eviction, cgroups, and workload burstiness matter.

## Procedure
1. Classify workload as latency-sensitive, batch, stateful, or best-effort.
2. Collect representative utilization and peak data.
3. Compare requests with observed working sets and CPU demand.
4. Identify throttling, OOM, eviction, or fragmentation signals.
5. Set requests from measured steady/peak requirements plus justified headroom.
6. Apply limits only where containment value exceeds throttling/OOM risk.
7. Coordinate with autoscaling and quotas.
8. Load test and observe behavior under node pressure.
9. Document assumptions and revisit triggers.

## Decision points
Use tighter limits for untrusted or noisy workloads; avoid arbitrary CPU limits for latency-critical services. Use VPA recommendations when workload history is representative, but avoid conflicting ownership with HPA on the same resource signal.

## Common failure patterns
Requests copied from templates, memory limits equal to normal working set, CPU limits causing tail-latency spikes, ignoring sidecars, and sizing only from averages.

## Verification
Confirm stable scheduling, acceptable p95/p99 latency, absence of unexpected OOM/throttling, expected autoscaling, and improved requested-to-used ratios.

## Expected output
Measured resource settings, rationale, test evidence, and monitoring thresholds.

## Stop conditions
Stop when representative load data is unavailable, application memory behavior is unknown, or changes would violate SLO/capacity commitments without approval.