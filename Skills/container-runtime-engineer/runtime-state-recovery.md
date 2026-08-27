# Runtime State and Recovery

## Purpose
Design runtime state so containers can be reconciled safely after daemon, shim, or host-component failures.

## When to use
Use for restart recovery, stale state, orphan cleanup, reconciliation loops, or runtime metadata redesign.

## Inputs
Persistent metadata, runtime directories, process/mount/cgroup state, event logs, restart scenarios.

## Context to inspect
Identify authoritative sources for container identity, process identity, bundles, sockets, mounts, cgroups, and exit state. Separate durable state from reconstructible cache.

## Core knowledge
Distributed-style reconciliation applies even on one host: persisted intent can diverge from kernel reality. Recovery should observe actual state and converge idempotently rather than replaying assumptions.

## Procedure
1. Classify each state item as authoritative, derived, or ephemeral.
2. Define invariants for each lifecycle state.
3. On startup, enumerate persisted and kernel/runtime resources.
4. Match resources using stable identifiers.
5. Reconcile missing, stale, and partially created objects.
6. Make cleanup idempotent.
7. Preserve evidence needed for exit reporting.
8. Quarantine ambiguous resources rather than deleting blindly.
9. Inject crashes at every persistence boundary.
10. Test repeated recovery runs.

## Decision points
Persist minimal intent/identity; reconstruct observable kernel state. Favor conservative quarantine when ownership is ambiguous.

## Common failure patterns
Blind state replay, deleting resources owned by another runtime instance, stale PID records, partial writes, and cleanup that fails on already-absent resources.

## Verification
Crash-injection tests must converge to a valid state with no unrelated resource loss and no repeated side effects.

## Expected output
A recovery algorithm, invariants, and tests proving convergence.

## Stop conditions
Stop if resource ownership cannot be proven or recovery would require destructive guesses.