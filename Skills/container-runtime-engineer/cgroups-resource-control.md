# Cgroups and Resource Control

## Purpose
Configure and diagnose container CPU, memory, IO, PID, and related resource controls using modern Linux cgroups.

## When to use
Use for runtime resource enforcement, OOM incidents, throttling, delegation, or cgroup-v2 migration.

## Inputs
OCI resources, cgroup hierarchy, systemd configuration, pressure metrics, kernel events, workload profile.

## Context to inspect
Determine cgroup version, manager/driver, delegation boundary, controller availability, parent placement, and actual cgroup files for the workload.

## Core knowledge
Cgroup v2 provides a unified hierarchy and controller semantics. Limits, weights, and protections differ; memory.high is throttling pressure while memory.max is a hard boundary. PSI and controller events often explain behavior better than application logs.

## Procedure
1. Identify the workload SLO and resource contract.
2. Resolve actual cgroup path and manager ownership.
3. Compare requested resources with effective controller values.
4. Inspect CPU quota/weight, memory current/events, IO controls, pids, and PSI.
5. Correlate throttling/OOM events with workload latency.
6. Validate parent constraints and delegation.
7. Change one control at a time with rollback.
8. Test burst, steady-state, and overload behavior.
9. Verify cleanup and empty-cgroup handling.
10. Record kernel/systemd/runtime compatibility.

## Decision points
Use hard limits for safety boundaries and weights/protections for contention management. Prefer delegated cgroups over runtime writes into manager-owned hierarchy.

## Common failure patterns
Reading requested instead of effective limits, ignoring parent constraints, confusing host OOM with cgroup OOM, unlimited PID growth, and mixing cgroup managers.

## Verification
Confirm effective files, controller events, stress tests, and no unexplained throttling. Validate restart and deletion behavior.

## Expected output
A resource-control change or RCA backed by effective cgroup evidence.

## Stop conditions
Stop before changing host-wide hierarchy ownership or when production resource changes lack safe rollback.