# RTOS Task Design

## Purpose
Structure real-time tasks, priorities and communication for predictable execution.

## When to use
Use when introducing or reviewing an RTOS, diagnosing scheduling failures or adding concurrent features.

## Inputs
Task set, deadlines, periods, priorities, stack budgets, IPC and scheduler settings.

## Context to inspect
Task creation, blocking points, timers, queues, mutexes, stack telemetry and watchdog integration.

## Core knowledge
Priority is a scheduling contract, not importance. Blocking, utilization, stack sizing and priority inversion determine system behavior.

## Procedure
1. Classify tasks by timing requirement.
2. Define ownership and communication.
3. Assign priorities from timing evidence.
4. Prefer blocking waits over polling.
5. Bound queue depth and processing time.
6. Size stacks from measurement plus margin.
7. Define overload behavior.
8. Instrument task latency and stack use.
9. Stress worst-case workloads.

## Decision points
Use tasks for independently schedulable responsibilities; use event loops or callbacks when task overhead adds no value.

## Common failure patterns
Too many tasks, arbitrary priorities, busy loops, stack overflow, hidden lock cycles, starvation and unbounded work per wakeup.

## Verification
Measure response times, stack high-water marks, CPU utilization and behavior under overload.

## Expected output
A schedulable task model with documented priorities and resource budgets.

## Stop conditions
Stop when hard deadlines cannot be demonstrated with available timing information.