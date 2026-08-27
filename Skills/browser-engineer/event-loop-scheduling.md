# Event Loop and Scheduling

## Purpose
Preserve browser responsiveness and specified ordering by placing work on appropriate tasks, queues, threads, and priorities.

## When to use
Use for hangs, jank, starvation, ordering bugs, background throttling, or new asynchronous work.

## Inputs
Trace, task metadata, thread dumps, timing requirements, lifecycle rules.

## Context to inspect
Main thread, compositor, IO threads, task queues, microtasks, priorities, timers, idle work, background policies.

## Core knowledge
Correctness depends on ordering as well as concurrency. Long tasks delay input and rendering. Priority inversions and unbounded queue growth can create latency even when CPU utilization appears acceptable.

## Procedure
1. Identify latency-sensitive work and deadlines.
2. Capture queueing and execution time.
3. Find long tasks, starvation, and cross-thread waits.
4. Separate work that can run off the critical thread.
5. Break large work into cancellable chunks where semantics allow.
6. Assign priority based on user-visible urgency.
7. Preserve required task/microtask ordering.
8. Test foreground, background, throttled, and teardown states.

## Decision points
Move work off-thread only when data ownership and synchronization remain safe. Use idle execution only for optional work. Do not raise priority to hide excessive work.

## Common failure patterns
Blocking waits; priority inflation; endless microtasks; uncancelled queued work; background tasks consuming foreground budget; timer-based ordering assumptions.

## Verification
Trace input latency, frame deadlines, queue depth, and ordering tests before and after.

## Expected output
A scheduling change with measured responsiveness and preserved semantics.

## Stop conditions
Escalate when required ordering conflicts with responsiveness goals and specification/product owners must choose the trade-off.