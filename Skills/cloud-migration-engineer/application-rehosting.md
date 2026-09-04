# Application Rehosting

## Purpose
Move workloads to cloud infrastructure with minimal application change while controlling hidden compatibility, performance, and operational risks.

## When to use
Use when migration speed matters, application change is constrained, or rehosting is an intentional interim state.

## Inputs
VM/server inventory, boot/runtime dependencies, storage, network flows, licenses, performance baseline, backup requirements, monitoring, patching model, and target compute options.

## Preconditions
The target landing zone, connectivity, images, identity, and operational ownership must be ready.

## Context to inspect
Inspect OS support, agents, kernel/drivers, local disks, static IP assumptions, hardware identifiers, licensing, scheduled tasks, service accounts, mount points, startup order, and external dependencies.

## Core knowledge
Rehosting changes infrastructure even when application code is unchanged. Cloud instance families, storage latency, network behavior, metadata services, and failure domains differ from traditional environments.

## Procedure
1. Confirm rehost rationale and intended lifetime.
2. Validate OS and software support on target compute.
3. Map CPU, memory, storage, and network needs using observed utilization.
4. Identify local-state and static-address assumptions.
5. Select migration tooling and replication method.
6. Prepare target security groups/firewalls, IAM, monitoring, backup, and patching.
7. Replicate workload and validate boot behavior in isolation.
8. Test application dependencies and health checks.
9. Compare performance against baseline.
10. Rehearse cutover and rollback.
11. Execute final synchronization and traffic switch.
12. Monitor application and infrastructure signals.
13. Right-size only after stable production evidence.
14. Record post-migration modernization or debt items.

## Decision points
Use image-based/server replication for speed where supported; rebuild from automation when configuration drift or security posture makes cloning unsafe. Avoid aggressive right-sizing during the same cutover unless evidence is strong.

## Common failure patterns
Copying unsupported OS images; missing local data; under-sizing from average CPU; static IP assumptions; monitoring absent after move; license invalidation; immediate decommissioning before rollback expires.

## Verification
Validate boot, health, dependencies, user transactions, backup, monitoring, security controls, and performance. Confirm source remains recoverable for the approved rollback period.

## Expected output
A migrated workload with documented target sizing, validation evidence, rollback state, and follow-up optimization backlog.

## Stop conditions
Stop when target runtime is unsupported, licensing is unresolved, critical dependencies fail, replication is inconsistent, or rollback cannot be guaranteed.