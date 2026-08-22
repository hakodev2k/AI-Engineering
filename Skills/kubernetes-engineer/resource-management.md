# Resource Management

## Purpose
Set CPU, memory, ephemeral-storage requests and limits so scheduling, performance, and cluster utilization remain predictable.

## When to use
Onboarding workloads, investigating throttling/OOMs, or improving utilization.

## Inputs
Usage metrics, load profile, latency SLOs, JVM/runtime behavior, and node capacity.

## Context to inspect
Requests, limits, QoS class, HPA/VPA settings, throttling, OOM events, and namespace quotas.

## Core knowledge
Requests drive scheduling; limits constrain runtime. CPU limits can throttle latency-sensitive services; memory limits can terminate containers. QoS affects eviction priority.

## Procedure
1. Gather representative CPU/memory distributions.
2. Separate steady state from bursts.
3. Set evidence-based requests.
4. Decide whether limits are beneficial per resource.
5. Check node packing and headroom.
6. Configure quotas/LimitRanges where appropriate.
7. Load-test and observe throttling, OOMs, and saturation.
8. Revisit values as workloads evolve.

## Decision points
Favor predictable requests for critical workloads; avoid blindly equal requests/limits; use autosizing only with safe bounds.

## Common failure patterns
No requests, arbitrary limits, CPU throttling mistaken for app slowness, memory limits below working set, and optimizing averages instead of tails.

## Verification
Confirm scheduling succeeds, SLOs hold under load, OOM/throttle signals are acceptable, and failure headroom exists.

## Expected output
Measured resource settings and rationale.

## Stop conditions
Escalate when representative production-like measurements cannot be obtained.