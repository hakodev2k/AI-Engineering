# Real-Time Timing

## Purpose
Ensure deadlines and timing assumptions are engineered from evidence.

## Scope
Periodic tasks, control loops, interrupts, communication deadlines, and scheduling.

## MUST
- Hard and soft deadlines MUST be identified for critical execution paths.
- Worst-case execution time and scheduling margin MUST be measured or conservatively bounded for hard deadlines.
- Timing budgets MUST include interrupt interference, blocking, DMA, cache effects, and communication latency where relevant.
- Deadline violations on safety- or availability-critical paths MUST have defined detection and failure behavior.

## MUST NOT
- Average latency MUST NOT be used as evidence that a hard deadline is safe.
- Busy waiting MUST NOT be introduced without a bounded timing requirement and measured justification.
- Timing correctness MUST NOT depend on debug-build behavior.

## SHOULD
- Timing telemetry SHOULD be available for critical paths during validation.

## Exceptions
Exceptions require explicit deadline classification, evidence, risk acceptance, and review.

## Verification
Measure worst-case latency under representative peak load, fault conditions, and production compiler settings.