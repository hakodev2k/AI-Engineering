# Real-Time Behavior Rules

## Purpose
Keep timing-sensitive behavior deterministic and within declared deadlines.

## Scope
Interrupts, periodic tasks, deadlines, jitter, latency, scheduling, and worst-case execution.

## MUST
- Define measurable deadlines and latency budgets for timing-critical paths.
- Bound interrupt and critical-section duration.
- Validate worst-case behavior under representative peak load.

## MUST NOT
- Put unbounded blocking, allocation, logging, or slow I/O in hard real-time paths.
- Claim real-time compliance from average latency alone.

## SHOULD
- Prefer deterministic execution and explicit priority models over timing by accident.

## Exceptions
A missed deterministic constraint requires documented system impact, evidence, and approval.

## Verification
Measure latency, jitter, deadline misses, and worst-case execution using target-hardware traces or equivalent instrumentation.