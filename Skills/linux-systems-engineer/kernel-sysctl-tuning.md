# Kernel and sysctl Tuning

## Purpose
Change Linux kernel runtime parameters only when measured workload evidence demonstrates a specific need.

## When to use
Use for validated network, VM, IPC, file-descriptor, or kernel-resource constraints. Do not use as generic optimization.

## Inputs
Observed bottleneck, current sysctl values, kernel version, workload characteristics, baseline metrics, and rollback method.

## Context to inspect
Inspect distribution defaults, vendor/application guidance, cgroup constraints, hardware limits, existing sysctl fragments, boot parameters, and configuration management.

## Core knowledge
Kernel tunables interact with workload and other limits. Defaults are often safe general choices; tuning must connect a parameter to a measured queue, limit, timeout, allocation, or policy.

## Procedure
1. State the bottleneck and evidence.
2. Identify the exact kernel mechanism and relevant parameter.
3. Confirm current effective value and all configuration sources.
4. Research kernel/version semantics.
5. Define expected effect, risk, rollback, and success metric.
6. Change one coherent parameter set at a time.
7. Test under representative load.
8. Watch secondary effects and resource consumption.
9. Persist through managed configuration only after validation.
10. Document rationale and expiry/review condition.

## Decision points
Tune when a kernel default is demonstrably limiting; change application design/capacity when the kernel is not the root constraint.

## Common failure patterns
Copying internet tuning recipes, huge connection queues hiding overload, disabling safety features, changing many values simultaneously, and persisting experiments before validation.

## Verification
Original bottleneck improves, SLOs improve or remain safe, secondary resource usage is acceptable, and reboot persistence/rollback are tested.

## Expected output
Evidence-linked tuning change with before/after measurements and rollback.

## Stop conditions
Stop when parameter semantics are unclear for the running kernel, security implications are unreviewed, or safe load testing is unavailable.