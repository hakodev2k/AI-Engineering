# Real-Time Requirements

## Purpose
Turn vague performance expectations into explicit, testable timing contracts. Senior real-time work starts by distinguishing hard, firm, and soft deadlines, defining latency budgets, and identifying what happens when deadlines are missed.

## When to use
Use before architecture, scheduling, hardware selection, or performance tuning for systems with deadline-sensitive behavior.

## Inputs
Business requirement, control-loop period, event rates, deadline expectations, failure consequences, hardware constraints, existing measurements.

## Context to inspect
Current architecture, task graph, I/O paths, clocks, interrupt sources, operating system, deployment hardware, safety constraints, and existing telemetry.

## Core knowledge
Average latency is insufficient for real-time guarantees. Requirements should capture worst-case or bounded behavior, release patterns, deadlines, jitter, throughput, overload semantics, and criticality.

## Procedure
1. Identify externally observable timing outcomes.
2. Classify each deadline as hard, firm, or soft.
3. Define release pattern: periodic, sporadic, or aperiodic.
4. Record period, deadline, execution budget, jitter tolerance, and burst behavior.
5. Define deadline-miss consequences and safe fallback behavior.
6. Allocate end-to-end latency across software, network, and hardware stages.
7. Document environmental and load assumptions.
8. Create measurable acceptance criteria.

## Decision points
Prefer tighter guarantees only when the business or safety case requires them; every tighter bound increases implementation and validation cost.

## Common failure patterns
Using averages instead of tail bounds, omitting burst traffic, ignoring overload behavior, and specifying deadlines without clock or measurement semantics.

## Verification
Confirm every timing requirement maps to a measurable signal, workload, and pass/fail threshold under stated assumptions.

## Expected output
A timing contract with deadline classes, budgets, assumptions, overload semantics, and acceptance tests.

## Stop conditions
Stop when key deadline consequences, workload assumptions, or hardware constraints are unknown and materially affect feasibility.