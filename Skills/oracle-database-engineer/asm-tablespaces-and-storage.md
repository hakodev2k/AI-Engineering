# ASM, Tablespaces, and Storage

## Purpose
Engineer Oracle storage layout using ASM, disk groups, tablespaces, datafiles, and temp/FRA capacity for predictable performance and recovery.

## When to use
Use for capacity expansion, new deployments, storage incidents, I/O bottlenecks, or tablespace redesign.

## Inputs
Data growth, IOPS/throughput/latency requirements, redundancy model, storage platform, failure domains, backup and FRA needs.

## Context to inspect
ASM disk groups, redundancy, allocation units, rebalance activity, datafile autoextend, tablespace usage, temp I/O, FRA, multipath and underlying storage guarantees.

## Core knowledge
ASM manages Oracle allocation and striping, but cannot compensate for poor underlying storage. Capacity plans need headroom for rebalance, recovery, temp spikes, and maintenance.

## Procedure
1. Inventory storage tiers, failure domains, and actual latency.
2. Separate capacity, performance, and recoverability requirements.
3. Design ASM disk groups and redundancy consistent with platform protection.
4. Configure tablespaces/datafiles with explicit growth policy.
5. Reserve headroom for rebalance, temp, FRA, and operational spikes.
6. Monitor latency by read/write class and file type.
7. Plan add/drop/rebalance operations during safe windows.
8. Test failure behavior and storage-path redundancy.
9. Alert on capacity and rebalance risks before emergency thresholds.

## Decision points
Use external redundancy when the storage layer provides verified protection; otherwise choose ASM redundancy deliberately. Avoid over-separating disk groups without a real isolation need.

## Common failure patterns
Unlimited autoextend, FRA sharing exhausted capacity, rebalance during peaks, and assuming low average latency means no tail-latency problem.

## Verification
Measure database I/O latency, validate failure-path behavior, and execute controlled capacity/rebalance tests.

## Expected output
A storage layout, capacity model, and operational thresholds.

## Stop conditions
Stop when underlying storage guarantees or failure domains are undocumented.