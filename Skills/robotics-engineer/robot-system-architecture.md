# Robot System Architecture

## Purpose
Design a robot as a set of explicit hardware/software boundaries, timing domains, safety responsibilities, and operational modes so later implementation remains testable and evolvable.

## When to use
Use for a new robot, major platform revision, subsystem split, or architecture review. Do not use as a substitute for detailed electrical or mechanical design.

## Inputs
Product goals, operating environment, sensors, actuators, compute targets, latency budgets, safety requirements, interfaces, deployment model.

## Preconditions
Critical requirements and environmental constraints are known well enough to compare architectures.

## Context to inspect
Existing diagrams, buses, compute topology, power domains, real-time paths, failure modes, firmware ownership, network boundaries, update strategy.

## Core knowledge
Robotic systems combine hard/soft real-time paths, asynchronous perception, stateful control, physical hazards, bandwidth limits, and partial failures. Architecture must make timing, ownership, and degradation behavior explicit.

## Procedure
1. Define mission-critical behaviors and safety boundaries.
2. Partition sensing, estimation, planning, control, supervision, and operator interfaces.
3. Identify hard real-time paths and isolate them from best-effort workloads.
4. Define process/node boundaries and communication contracts.
5. Budget compute, memory, bandwidth, latency, and clock synchronization.
6. Define startup, shutdown, degraded, maintenance, and emergency modes.
7. Map faults to containment and recovery behavior.
8. Decide what belongs on MCU, real-time CPU, accelerator, or application compute.
9. Document versioning and update boundaries.
10. Validate with representative timing and failure scenarios.

## Decision points
Prefer tighter coupling only when latency or determinism requires it. Prefer distributed components when fault isolation, independent deployment, or hardware locality dominates.

## Common failure patterns
Implicit ownership, hidden timing assumptions, shared mutable state, unbounded queues, safety logic on non-deterministic paths, and architectures that cannot degrade gracefully.

## Verification
Review against latency budgets, failure scenarios, resource budgets, interface contracts, and deployability. A diagram is implemented only when boundaries exist; it is verified only when timing and failure behavior are measured.

## Expected output
Architecture diagram, subsystem responsibilities, interface list, timing budgets, failure/degraded-mode table, and unresolved risks.

## Stop conditions
Escalate when safety requirements conflict with architecture, compute budgets are infeasible, or critical timing/failure evidence is unavailable.