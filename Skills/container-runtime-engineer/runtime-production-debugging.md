# Runtime Production Debugging

## Purpose
Diagnose container-runtime incidents systematically using host evidence while minimizing production risk.

## When to use
Use for stuck containers, failed starts, leaked resources, unexplained exits, high runtime latency, or daemon instability.

## Inputs
Incident timeline, runtime/shim logs, process tree, mountinfo, cgroups, namespaces, kernel logs, metrics, configuration, recent changes.

## Context to inspect
Establish affected hosts/containers, lifecycle state, component versions, kernel state, and whether the failure is control-plane, runtime, kernel, storage, network, or workload-originated.

## Core knowledge
Runtime incidents often cross layers. API errors are symptoms; `/proc`, cgroup files, mount tables, audit/kernel logs, sockets, and process state provide ground truth. Preserve evidence before cleanup.

## Procedure
1. Bound impact and stop harmful automation if needed.
2. Capture timeline and recent changes.
3. Preserve logs and host-state snapshots.
4. Compare runtime metadata with kernel reality.
5. Identify the failed lifecycle phase.
6. Check process, namespace, cgroup, mount, storage, network, and security evidence as relevant.
7. Form a falsifiable hypothesis.
8. Test on a safe replica before production mutation.
9. Apply the least invasive mitigation.
10. Verify recovery and resource cleanup.
11. Add a regression test and post-incident action.

## Decision points
Prefer workload rescheduling/host isolation over invasive live debugging when availability permits. Preserve forensic evidence before deleting stale state.

## Common failure patterns
Restarting before evidence capture, deleting state blindly, assuming workload fault, attaching debuggers that change timing, and treating symptom disappearance as root cause.

## Verification
Confirm service recovery, host resource consistency, no recurrence during observation, and a reproduced root cause where feasible.

## Expected output
An evidence-backed RCA, safe mitigation, and regression protection.

## Stop conditions
Stop for destructive production actions, unclear ownership, or suspected security compromise requiring incident-response procedures.