# Production GPU Performance Troubleshooting

## Purpose
Diagnose GPU performance incidents in production using a disciplined evidence chain from user-visible symptoms to host, runtime, transfer, kernel, communication, and hardware causes.

## When to use
Use for sudden latency or throughput regressions, unexplained GPU idle time, device-specific slowdowns, OOM-related degradation, scaling failures, or performance differences between environments.

## Inputs
- Incident timeline and affected SLOs
- Logs, metrics, traces, and GPU telemetry
- Deployment/version changes
- Representative request or batch characteristics
- Known-good baseline and environment

## Preconditions
Preserve production safety. Prefer read-only diagnostics and reproduction outside production before intrusive profiling or configuration changes.

## Context to inspect
Inspect request load, CPU saturation, input pipeline, GPU utilization, clocks, memory pressure, allocator state, transfers, synchronization, kernel mix, NCCL/network activity, driver/runtime/library changes, and neighboring workloads.

## Core knowledge
A GPU slowdown may originate outside the GPU. Senior troubleshooting separates correlation from cause, compares against a known-good baseline, and narrows the search from end-to-end behavior before using expensive low-level profilers.

## Procedure
1. Define the exact symptom, start time, affected scope, and user impact.
2. Compare traffic, workload shape, and configuration against the last known-good period.
3. Check deployment, driver, runtime, library, firmware, and hardware changes.
4. Review GPU clocks, power, temperature, memory, ECC/error state, and process contention.
5. Decompose latency into CPU, queueing, transfer, GPU compute, synchronization, and communication.
6. Reproduce on an isolated canary or staging system when possible.
7. Use system tracing to locate the critical-path change.
8. Use kernel profiling only when specific kernels are implicated.
9. Test one causal hypothesis at a time and record evidence.
10. Apply the lowest-risk mitigation that restores SLOs.
11. Verify recovery under representative sustained load.
12. Document root cause, contributing factors, rollback/forward fix, and regression guard.

## Decision points
Rollback when a recent change is strongly correlated and safe rollback is faster than diagnosis. Shift traffic or reduce concurrency when capacity risk threatens availability. Escalate to infrastructure/hardware owners when clocks, ECC, topology, or host-level faults are implicated.

## Common failure patterns
- Profiling production invasively without risk assessment
- Assuming high GPU utilization means the GPU is the bottleneck
- Changing multiple variables simultaneously
- Ignoring workload-shape changes
- Declaring recovery from a short low-load test
- Closing the incident without a regression benchmark or monitoring improvement

## Verification
Verify SLO recovery, stable operation over a representative interval, disappearance of the measured bottleneck, unchanged correctness, and a reproducible test or monitor capable of detecting recurrence.

## Expected output
An incident diagnosis containing evidence, root cause or bounded hypotheses, mitigation, verified recovery metrics, corrective actions, and regression prevention.

## Stop conditions
Stop and escalate when diagnostics require unsafe production actions, permissions are insufficient, hardware errors are present, destructive changes are proposed, or evidence cannot distinguish among high-risk causes.