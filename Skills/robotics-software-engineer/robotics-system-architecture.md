# Robotics System Architecture

## Purpose
Design a robotics software architecture that separates real-time control, perception, planning, state estimation, device integration, and operator-facing services without hiding critical timing or safety constraints.

## When to use
Use when creating a new robot platform, decomposing a monolith, adding major autonomy capabilities, or reviewing cross-process boundaries. Do not use it as a generic microservices exercise; robotics boundaries are driven by latency, determinism, hardware ownership, fault containment, and safety.

## Inputs
- Robot mission and operating environment
- Hardware inventory and device interfaces
- Latency and control-loop requirements
- Safety requirements
- Network topology
- Deployment targets
- Existing source tree and runtime graph

## Preconditions
Critical timing, safety, and hardware ownership requirements must be discoverable. If they are unknown, architecture decisions should remain provisional.

## Context to inspect
Inspect node/process layout, ROS 2 graph if present, control loops, shared libraries, IPC mechanisms, watchdogs, lifecycle management, launch configuration, deployment topology, and failure recovery paths.

## Core knowledge
Senior robotics architecture requires understanding of real-time versus best-effort workloads, process isolation, publish/subscribe semantics, request/reply, ownership of hardware resources, state machines, deterministic control paths, fault containment, graceful degradation, lifecycle orchestration, and observability.

## Procedure
1. Identify mission-critical behaviors and safety functions.
2. Classify workloads by hard real-time, soft real-time, interactive, or batch characteristics.
3. Map every hardware device to one authoritative owner.
4. Separate sensing, estimation, planning, control, and supervisory responsibilities.
5. Choose in-process calls, shared memory, middleware messages, or service calls based on latency and coupling.
6. Define data contracts and timestamps at subsystem boundaries.
7. Define startup, shutdown, reset, recovery, and degraded-operation states.
8. Isolate components whose failure must not crash critical control.
9. Define configuration ownership and parameter update rules.
10. Add watchdogs, health reporting, and traceability for critical paths.
11. Document resource budgets for CPU, memory, network, and accelerators.
12. Validate the architecture under nominal and fault scenarios.

## Decision points
Use separate processes when fault isolation, language/runtime separation, privilege separation, or lifecycle independence matters. Prefer in-process composition for very high-rate low-latency paths when safety and fault-domain implications are acceptable. Keep safety interlocks independent from high-level autonomy when possible.

## Common failure patterns
- Treating the robot as ordinary cloud microservices
- Multiple components commanding the same actuator
- Missing timestamp semantics
- Hidden blocking calls inside control paths
- Global configuration with unclear ownership
- Architecture that only works during nominal startup
- No degraded mode for partial sensor failure

## Verification
Verify the runtime graph, dependency direction, startup/shutdown behavior, simulated fault injection, timing budgets, hardware ownership, watchdog behavior, and recovery paths. Confirm that implemented boundaries match the documented architecture.

## Expected output
A system decomposition with component responsibilities, interfaces, lifecycle states, fault boundaries, timing expectations, and operational constraints.

## Stop conditions
Stop and escalate if safety ownership is unclear, multiple subsystems require uncontrolled actuator access, timing requirements cannot be met with the proposed communication model, or a required architectural change would invalidate certified safety assumptions.