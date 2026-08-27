# Container Process Lifecycle

## Purpose
Implement reliable init, exec, signal, exit, and process-reaping behavior inside container runtimes.

## When to use
Use for start/exec/kill/wait bugs, zombie processes, shutdown failures, or runtime lifecycle implementation.

## Inputs
Runtime state, process tree, signals, exit events, shim logs, OCI spec, reproduction steps.

## Context to inspect
Inspect parent-child relationships, PID namespace init, pidfds where available, signal forwarding, wait/reap ownership, terminal mode, and persisted process metadata.

## Core knowledge
PID 1 has special signal and orphan-reaping semantics. PIDs are reusable; pidfds reduce race risk. Exit notification must remain reliable even when clients or supervisors restart.

## Procedure
1. Draw the process tree and ownership of wait/reap.
2. Separate init process lifecycle from exec processes.
3. Validate state transitions around start and exit.
4. Trace signal target resolution and forwarding.
5. Check PID reuse race protections.
6. Validate terminal/session/process-group behavior.
7. Force parent, shim, and client crashes independently.
8. Confirm every child is reaped exactly once.
9. Preserve exit status until consumed/reconciled.
10. Test rapid start-exit and concurrent kill/wait.

## Decision points
Prefer pidfds or equivalent stable process handles where supported. Keep long-lived supervision independent from transient API clients.

## Common failure patterns
Zombie leaks, signaling reused PIDs, lost exit events, double wait, PID 1 ignoring expected signals, and races between delete and exit.

## Verification
Stress lifecycle concurrency, inspect process tables for zombies/orphans, and assert exact exit codes/signals across restart scenarios.

## Expected output
Race-resistant lifecycle behavior with deterministic tests.

## Stop conditions
Stop if process identity cannot be established safely or a proposed fix can signal unrelated host processes.