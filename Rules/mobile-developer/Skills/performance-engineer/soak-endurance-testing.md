# Soak and Endurance Testing

## Purpose
Detect performance degradation that appears only after sustained operation, including leaks, fragmentation, backlog growth, cache drift, and resource exhaustion.

## When to use
Use for long-running services, workers, connection-heavy systems, caches, queues, and releases suspected of time-dependent degradation.

## Inputs
Representative workload, expected operating duration, telemetry, resource limits, maintenance schedules, and baseline performance.

## Context to inspect
Inspect memory generations/heaps, handles, threads, connections, file descriptors, queues, cache cardinality, temporary storage, log volume, and scheduled tasks.

## Core knowledge
Short tests miss cumulative defects. Endurance tests need stable workload and long enough duration to distinguish periodic behavior from monotonic growth. Resource trends matter more than snapshots.

## Procedure
1. Define the degradation hypotheses and duration.
2. Establish baseline latency, throughput, and resource levels.
3. Run a representative steady workload for the required period.
4. Capture time-series metrics at consistent intervals.
5. Track memory, handles, connections, queues, storage, and cache size.
6. Correlate periodic jobs, deployments, and maintenance events.
7. Look for monotonic growth, sawtooth patterns, and incomplete recovery.
8. Sample profiles or dumps when abnormal trends emerge.
9. Reduce load and verify resources return to expected idle levels.
10. Repeat after fixes using equivalent conditions.

## Decision points
Choose duration based on the suspected accumulation cycle; compressing time by unrealistically increasing traffic may change the failure mechanism.

## Common failure patterns
Running too briefly, restarting components during the test, changing workload mid-run, ignoring background jobs, and declaring success from stable latency while resource usage grows without bound.

## Verification
No unbounded resource trend, backlog accumulation, or progressive latency/error degradation should remain under the target endurance window.

## Expected output
An endurance report with trend evidence, suspected accumulation mechanisms, and verified fixes.

## Stop conditions
Stop when environment maintenance invalidates continuity or resource growth threatens shared infrastructure.