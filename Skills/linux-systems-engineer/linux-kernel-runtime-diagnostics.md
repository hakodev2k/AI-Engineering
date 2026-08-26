# Linux Kernel and Runtime Diagnostics

## Purpose
Diagnose kernel, scheduler, memory, I/O, and runtime behavior without guessing.

## When to use
Use for unexplained latency, hangs, CPU saturation, memory pressure, kernel warnings, or host instability. Do not tune kernel parameters before establishing evidence.

## Inputs
Host role, workload, kernel version, symptoms, timestamps, metrics, logs, and access constraints.

## Context to inspect
Confirm distribution, kernel, virtualization/container layer, cgroups, workload topology, recent changes, uptime, and production safety constraints.

## Core knowledge
Understand user/kernel time, scheduling, context switches, interrupts, load average, pressure stall information, kernel logs, procfs/sysfs, cgroups, and the difference between symptom correlation and causation.

## Procedure
1. Define the failure window and expected baseline.
2. Capture CPU, memory, I/O, network, PSI, process, and kernel-log evidence.
3. Separate host-wide from process-local symptoms.
4. Correlate saturation, queueing, reclaim, throttling, faults, and errors by timestamp.
5. Inspect kernel messages and relevant procfs/sysfs state.
6. Form ranked hypotheses and test the least invasive first.
7. Reproduce safely when possible.
8. Apply the smallest justified correction.
9. Re-measure against the baseline.
10. Record cause, evidence, and residual risk.

## Decision points
Prefer observation over tuning. Use tracing/profiling only when coarse metrics cannot localize the issue. Reboot only when recovery value exceeds evidence-loss and availability costs.

## Common failure patterns
Blind sysctl tuning, treating load average as CPU utilization, ignoring cgroup limits, clearing logs before capture, confusing correlation with cause, and testing destructive hypotheses in production.

## Verification
Verify recovery with the original symptom, workload-level SLOs, kernel logs, PSI, saturation metrics, and regression monitoring.

## Expected output
Evidence-backed root cause or bounded hypothesis, corrective action, verification evidence, and follow-up controls.

## Stop conditions
Stop for kernel corruption, suspected hardware failure, unsafe production experiments, missing privileges, or changes requiring reboot/availability approval.