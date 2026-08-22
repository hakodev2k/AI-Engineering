# Database Configuration Tuning

## Purpose
Tune database engine and service configuration using workload evidence while avoiding unstable or cargo-cult settings.

## When to use
Use for new production baselines, saturation investigations, major hardware/tier changes, or review of inherited custom configuration.

## Inputs
Engine/version, hardware or service tier, workload metrics, concurrency, memory, CPU, IO, defaults, current overrides, and vendor guidance.

## Context to inspect
Inspect why each non-default setting exists, restart requirements, managed-service restrictions, resource limits, query workload, and historical incidents.

## Core knowledge
Defaults are usually safer than arbitrary tuning. Configuration changes can alter memory pressure, parallelism, durability, logging, checkpointing, caching, and concurrency globally, so evidence and rollback are essential.

## Procedure
1. Inventory current configuration and deviations from defaults.
2. Identify the measured bottleneck or risk being addressed.
3. Check engine-version and platform-specific guidance.
4. Estimate blast radius of each candidate setting.
5. Change one related group at a time when practical.
6. Record previous values and rollback commands.
7. Test under representative workload.
8. Measure user-facing and resource metrics.
9. Observe long enough to capture peak behavior.
10. Document rationale for retained overrides and periodically revalidate them.

## Decision points
Prefer query/schema/workload fixes when configuration only masks local inefficiency. Use global tuning when the workload characteristic is broad and evidence supports it.

## Common failure patterns
Copying internet tuning checklists, maximizing memory without OS headroom, disabling durability for speed, excessive parallelism, and undocumented overrides.

## Verification
Compare baseline and post-change latency, throughput, resource saturation, waits, stability, and restart behavior.

## Expected output
A minimal set of justified configuration overrides with measurements and rollback details.

## Stop conditions
Stop when configuration impact cannot be tested safely or a change weakens durability/security beyond approved requirements.