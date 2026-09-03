# Distributed Simulation Orchestration

## Purpose
Scale robotics simulation across processes, GPUs, hosts, or clusters while preserving scenario isolation, reproducibility, observability, and efficient resource use.

## When to use
Use for large scenario campaigns, reinforcement-learning workloads, synthetic-data generation, parameter sweeps, or release qualification exceeding a single machine.

## Inputs
Scenario manifest, simulator images, compute inventory, resource requirements, seeds, artifact policy, retry rules, throughput/cost targets.

## Preconditions
A scenario must run correctly and reproducibly on one worker before horizontal scaling.

## Context to inspect
Container/runtime versions, GPU compatibility, scheduler behavior, storage bandwidth, network dependencies, startup/reset cost, job granularity, artifact volume, quotas, and failure semantics.

## Core knowledge
Distributed throughput is limited by more than compute. Cold starts, asset distribution, shared storage, oversized artifacts, stragglers, retries, and GPU fragmentation can dominate. Jobs must be independently identifiable and idempotent enough to retry without corrupting results.

## Procedure
1. Establish single-worker resource and runtime baseline.
2. Package simulator, assets, code, and configuration immutably.
3. Define a run identity from scenario, seed, versions, and parameters.
4. Choose job granularity that amortizes startup without creating large retry units.
5. Declare CPU, GPU, memory, storage, and locality requirements.
6. Separate immutable inputs from per-run outputs.
7. Add heartbeats, timeouts, structured status, and failure classification.
8. Scale gradually and measure queueing, utilization, storage, and stragglers.
9. Add bounded retries only for transient failures.
10. Validate result completeness and detect duplicate/missing runs.
11. Track cost per valid scenario and capacity ceilings.

## Decision points
Use many independent jobs for fault isolation; vectorized multi-environment workers when simulator startup or GPU utilization dominates. Prefer local caching for large immutable assets while validating cache identity.

## Common failure patterns
Scaling a slow single worker blindly; unpinned images; shared mutable output paths; unlimited retries; centralized storage bottlenecks; counting failed runs as coverage; no provenance per result.

## Verification
Verify all expected run identities are represented exactly as intended, retries preserve semantics, results reproduce on isolated workers, and scaling efficiency/cost meet targets.

## Expected output
A distributed execution design with resource model, run identity, retry semantics, observability, artifact layout, throughput metrics, and limits.

## Stop conditions
Escalate when infrastructure quotas or permissions block required capacity, distributed execution changes simulation semantics, or failure rates make aggregate results unreliable.