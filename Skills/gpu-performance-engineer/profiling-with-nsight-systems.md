# Profiling with Nsight Systems

## Purpose
Use NVIDIA Nsight Systems to identify system-level GPU performance bottlenecks across CPU threads, CUDA launches, synchronization, transfers, libraries, and multi-GPU activity.

## When to use
Use when end-to-end latency is poor, GPU idle gaps appear, kernels launch irregularly, CPU overhead is suspected, or communication overlaps poorly with compute. Do not use it as the sole tool for detailed instruction-level kernel diagnosis.

## Inputs
- Reproducible workload command
- Representative inputs and runtime configuration
- Target GPU and software versions
- Baseline latency/throughput metrics

## Preconditions
Minimize unrelated system load. Warm the workload before capture. Keep capture duration short enough to inspect while still representative.

## Context to inspect
Inspect CUDA API calls, kernel launches, memcpy operations, CPU thread scheduling, synchronization APIs, NCCL activity, framework ranges, and idle periods on GPU timelines.

## Core knowledge
Nsight Systems answers where time is spent across the system. It is strongest for launch gaps, serialization, sync points, transfer overlap, thread starvation, and communication scheduling. Detailed kernel inefficiency should be followed with Nsight Compute or equivalent counters.

## Procedure
1. Reproduce the workload and record the baseline.
2. Capture a short steady-state interval with relevant CUDA/NVTX traces.
3. Locate the critical path rather than scanning all events equally.
4. Quantify GPU busy versus idle intervals.
5. Identify long CPU API calls and launch gaps.
6. Inspect synchronous transfers and device-wide synchronization.
7. Check whether communication overlaps with computation.
8. Correlate framework or NVTX ranges with expensive phases.
9. Rank findings by end-to-end contribution.
10. Create targeted hypotheses for kernel-level or orchestration-level follow-up.

## Decision points
Use Nsight Compute next when one or a few kernels dominate. Investigate CPU/runtime code when gaps precede kernels. Investigate data movement when memcpy occupies the critical path. Investigate stream/event design when independent work is serialized.

## Common failure patterns
- Capturing startup instead of steady state
- Collecting excessively long traces
- Assuming every synchronization is removable
- Ignoring CPU scheduling and framework overhead
- Optimizing visually large events that are off the critical path

## Verification
Re-run the same capture after changes, compare wall-clock metrics, verify targeted idle gaps or serialization were reduced, and ensure no regression in correctness or memory use.

## Expected output
A system-level bottleneck report with timeline evidence, quantified idle/serialized time, ranked hypotheses, and recommended next profiling step.

## Stop conditions
Stop if trace overhead materially changes behavior, required symbols/ranges are unavailable, or measurements cannot be reproduced consistently.