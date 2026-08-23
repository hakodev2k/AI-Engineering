# Skill: Process-Tree Memory Analysis

## Purpose
Localize memory growth to root versus descendants before proposing a fix.

## Trigger
OOM, sustained memory pressure, post-session retention, suspected native leak, child-process accumulation, or performance regression.

## Inputs
Comparable baseline/candidate process samples, root PID, workload description, policy.

## Preconditions
Sample interval and workload duration are known; telemetry includes PID, PPID, RSS and timestamp.

## Allowed tools
OS process sampling, read-only telemetry collection, `scripts/process_tree_memory_profiler.py`.

## Constraints
Do not infer ownership from executable name alone. Do not claim a leak from a single sample. Do not kill production processes as part of measurement.

## Procedure
1. Define repeatable workload and soak duration.
2. Capture baseline process tree at regular intervals.
3. Capture candidate under the same workload.
4. Reconstruct descendants from PPID lineage at every timestamp.
5. Measure root, child and total tree RSS; count descendants.
6. Calculate start/end/peak/growth and least-squares tree slope.
7. Rank contributor label/PID peaks.
8. Compare candidate to baseline and thresholds.
9. Form subsystem hypothesis only after attribution.
10. Re-run after fix and require measured regression improvement.

## Decision points
Child-dominant growth => investigate lifecycle/tool pool. Root-dominant native growth => native/allocator/embedded path. Root heap tracks RSS => language heap path. Unstable results => repeat at most twice.

## Expected output
Attribution metrics, violations, top contributors, baseline comparison, verification status.

## Stop conditions
Pass; confirmed regression with actionable attribution; or two inconclusive repeats then escalate.
