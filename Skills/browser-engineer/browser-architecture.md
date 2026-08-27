# Browser Architecture

## Purpose
Guide senior-level reasoning about browser subsystems, process boundaries, and request-to-pixel execution so changes preserve correctness, security, and responsiveness.

## When to use
Use for browser feature design, subsystem changes, cross-process bugs, startup regressions, or architectural reviews. Do not use as a substitute for subsystem-specific profiling.

## Inputs
Repository, architecture docs, process model, traces, crash reports, requirements.

## Preconditions
Identify supported platforms, browser engine, compatibility constraints, and affected trust boundaries.

## Context to inspect
Process topology; browser/UI process; renderer; GPU; network and storage services; IPC contracts; event loops; sandbox boundaries; lifecycle ownership.

## Core knowledge
Modern browsers isolate work across processes for security and fault containment. Navigation, parsing, style, layout, paint, compositing, networking, storage, JavaScript, and GPU work have different ownership and scheduling constraints. IPC adds latency, serialization cost, ordering hazards, and failure modes.

## Procedure
1. Map user-visible behavior to responsible subsystems.
2. Trace control and data flow across threads and processes.
3. Mark trust boundaries and privileged operations.
4. Identify ownership and lifetime of key objects.
5. Check synchronous waits and IPC round trips.
6. Model cancellation, crash, shutdown, and restart paths.
7. Compare the change with established architecture.
8. Minimize coupling and privileged surface.
9. Add diagnostics at subsystem boundaries.
10. Test normal, failure, and recovery paths.

## Decision points
Prefer isolation for hostile or failure-prone content despite memory and IPC cost. Prefer asynchronous boundaries unless strict ordering requires otherwise. Keep policy decisions privileged and untrusted parsing constrained.

## Common failure patterns
Hidden synchronous IPC; trust inversion; lifetime races; duplicated state; critical-thread startup work; incomplete crash recovery.

## Verification
Validate architecture against runtime traces, exercise process crashes, measure latency and memory, and run security and integration tests.

## Expected output
An evidence-backed design or diagnosis identifying ownership, boundaries, risks, and validated behavior.

## Stop conditions
Escalate when security boundaries are unclear, platform behavior cannot be reproduced, or incompatible process-model assumptions are required.