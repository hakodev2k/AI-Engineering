# Multi-Tenant GPU Isolation

## Purpose
Design safe and predictable accelerator sharing across teams and workloads while balancing utilization, security, and performance isolation.

## When to use
Use for shared clusters, MIG/time-slicing decisions, or noisy-neighbor incidents.

## Inputs
Tenant trust levels, workload profiles, accelerator capabilities, isolation requirements, utilization goals.

## Context to inspect
Namespace/account boundaries, device plugins, MIG/time-slicing, quotas, scheduler policy, network/storage isolation, and historical contention.

## Core knowledge
Isolation can occur at whole-device, hardware-partition, process, scheduler, and cluster boundaries. Stronger isolation reduces interference but may increase fragmentation and cost.

## Procedure
1. Classify tenants and workloads by trust and performance sensitivity.
2. Determine whether whole-device isolation is required.
3. Evaluate hardware partitioning such as MIG where supported.
4. Define scheduler and quota boundaries.
5. Isolate network, storage, secrets, and administrative permissions.
6. Measure performance interference under co-location.
7. Establish placement exclusions for incompatible workloads.
8. Monitor cross-tenant saturation and policy violations.
9. Document supported sharing modes and escalation paths.

## Decision points
Use whole GPUs for strict latency or untrusted workloads; hardware partitions for predictable smaller workloads; time slicing only when interference is acceptable.

## Common failure patterns
Assuming scheduler quotas equal security isolation, mixing latency-critical and bursty jobs, overpacking memory, and undocumented device-sharing behavior.

## Verification
Run contention tests, permission-denial tests, and tenant-specific SLO checks.

## Expected output
A multi-tenancy policy with supported isolation modes and placement rules.

## Stop conditions
Stop if required security isolation exceeds platform or hardware capability.