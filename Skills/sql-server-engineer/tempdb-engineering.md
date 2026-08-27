# tempdb Engineering

## Purpose
Diagnose and engineer SQL Server tempdb for allocation, spill, version-store, and temporary-object workloads.

## When to use
Use for tempdb contention, capacity incidents, heavy spills, row-version growth, or temporary-object bottlenecks.

## Inputs
Waits, file layout/growth, disk latency, space DMVs, workload patterns, plans, version-store usage.

## Context to inspect
Inspect tempdb files, autogrowth, storage latency, allocation waits, spills, temp objects, version store, and instance version.

## Core knowledge
Tempdb is shared infrastructure. File count alone is not a universal fix; modern SQL Server versions reduce several historical allocation bottlenecks. Capacity and latency matter as much as layout.

## Procedure
1. Identify the dominant tempdb consumer or wait.
2. Measure file usage and storage latency.
3. Separate allocation contention from capacity and query-spill problems.
4. Size files proactively with consistent growth settings.
5. Correct spill-producing queries and memory-grant issues.
6. Investigate long-running version-store consumers.
7. Adjust file layout only with evidence.
8. Re-measure under representative load.

## Decision points
Add files for demonstrated allocation contention; add capacity for predictable demand; tune queries when tempdb is merely absorbing avoidable work.

## Common failure patterns
Adding many files blindly, percent autogrowth, tiny growth increments, treating tempdb as permanent storage, and ignoring long snapshot transactions.

## Verification
Confirm reduced waits, stable free space, acceptable disk latency, fewer spills, and controlled version-store growth.

## Expected output
Root-cause classification, configuration/query remediation, capacity margin, and monitoring thresholds.

## Stop conditions
Stop before storage resizing or restart-dependent changes without operational approval.