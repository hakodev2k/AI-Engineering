# Memory Pressure and OOM Analysis

## Purpose
Diagnose memory exhaustion, reclaim pressure, swapping, leaks, and OOM kills while preserving service stability.

## When to use
Use for OOM events, swap storms, unexplained RSS growth, reclaim latency, or container memory kills.

## Inputs
Memory metrics, process/cgroup state, kernel logs, workload history, limits, and allocation patterns.

## Context to inspect
Inspect RAM/swap, NUMA, overcommit policy, cgroup versions and limits, huge pages, page cache, slab usage, and recent workload changes.

## Core knowledge
Understand virtual vs resident memory, page cache, anonymous memory, reclaim, swap, working sets, cgroup accounting, OOM scoring, fragmentation, and allocator behavior.

## Procedure
1. Confirm whether failure is host or cgroup scoped.
2. Capture memory totals, available memory, swap, PSI, vmstat, slab, and top consumers.
3. Review OOM logs and victim selection.
4. Separate expected cache growth from unreclaimable or anonymous growth.
5. Trend process/cgroup memory against workload.
6. Inspect application allocation profiles when system evidence points to a process.
7. Evaluate limits, overcommit, and swap policy.
8. Remediate leak, sizing, limit, or workload issue.
9. Load-test and monitor reclaim/OOM behavior.

## Decision points
Add memory only when working-set demand is legitimate; use swap according to latency and recovery requirements; change limits only after proving they are incorrect.

## Common failure patterns
Treating free memory as required, dropping caches as a fix, raising limits around leaks, ignoring cgroup OOMs, and overlooking slab/kernel memory.

## Verification
No unexpected OOMs; stable working set; acceptable PSI, reclaim, swap, latency, and headroom under representative load.

## Expected output
Memory-accounting explanation, root cause, remediation, capacity recommendation, and verification evidence.

## Stop conditions
Stop if memory capture may expose secrets, kernel/hardware corruption is suspected, or mitigation requires disruptive capacity changes without approval.