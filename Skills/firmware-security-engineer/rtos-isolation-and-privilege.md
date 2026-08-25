# RTOS Isolation and Privilege

## Purpose
Use RTOS privilege, MPU/MMU, task boundaries, capabilities, and IPC design to contain firmware compromise and protect critical services.

## When to use
Use when designing task architecture, introducing untrusted protocol stacks, hardening privileged drivers, or investigating cross-task corruption.

## Inputs
RTOS architecture, task list, privilege modes, MPU/MMU features, memory map, IPC mechanisms, interrupts, shared buffers, and timing constraints.

## Preconditions
Know which functions require privileged hardware access and which process untrusted input. Confirm platform enforcement capabilities rather than assuming process-like isolation.

## Context to inspect
Task creation, privilege levels, stacks, memory regions, syscalls, queues, shared memory, interrupt handlers, DMA, driver access, scheduler hooks, and fault handlers.

## Core knowledge
Many RTOS deployments run all tasks privileged, making task boundaries organizational rather than security boundaries. Effective isolation requires hardware-enforced memory/access policy plus narrow privileged interfaces. Shared memory and DMA can bypass otherwise sound task separation.

## Procedure
1. Classify tasks by privilege and exposure.
2. Minimize code executing privileged.
3. Place externally exposed parsers/stacks in least-privileged domains where feasible.
4. Configure task code/data/stack regions with least access and execute permissions.
5. Design narrow validated syscall/IPC interfaces.
6. Avoid raw privileged pointers crossing boundaries.
7. Constrain shared buffers and define ownership transitions.
8. Protect critical interrupt and DMA paths.
9. Configure fault handlers to capture evidence without leaking secrets.
10. Test unauthorized reads/writes/executes and malformed IPC.
11. Measure context-switch/MPU reconfiguration impact against deadlines.

## Decision points
Strong compartmentalization is valuable for high-exposure components but consumes MPU regions, RAM, and CPU. Where hardware regions are scarce, prioritize keys, boot/update services, and network-facing code. Separate processors may be justified for high-assurance safety/security boundaries.

## Common failure patterns
All tasks privileged; MPU configured but disabled after boot; shared memory granting write access to critical state; syscall validation trusting caller pointers; DMA bypassing MPU; fault handler reboot loops; isolation removed for performance without measurement.

## Verification
Trigger access violations from unprivileged tasks, fuzz syscall parameters, test shared-buffer ownership, verify DMA ranges, inspect release MPU configuration, and measure worst-case timing with protections enabled.

## Expected output
Privilege map, enforced memory/IPC policy, hardened interfaces, fault tests, timing evidence, and residual shared-state risks.

## Stop conditions
Escalate when required isolation exceeds hardware capacity, changes threaten hard real-time/safety guarantees, or privileged third-party components cannot be meaningfully constrained.