# Clock and Timebase Rules

## Purpose
Preserve correct temporal behavior across clocks, timers, synchronization sources, and time conversions.

## Scope
Monotonic clocks, wall clocks, timer resolution, drift, wraparound, synchronization, and timestamp semantics.

## MUST
- Deadline and elapsed-time logic MUST use a monotonic time source unless a documented platform constraint prevents it.
- Clock resolution, drift, wraparound, and synchronization assumptions MUST be explicit where they affect correctness.
- Time conversions MUST preserve units and overflow safety.
- Distributed timing assumptions MUST include bounded synchronization error when used for ordering or coordination.

## MUST NOT
- MUST NOT use wall-clock adjustments as a basis for local deadline measurement.
- MUST NOT assume clocks on separate nodes are identical or perfectly synchronized.

## SHOULD
- Centralize timebase abstractions when multiple hardware or operating-system clocks exist.

## Exceptions
Alternative clock use requires documented semantics, bounded error, and verification evidence.

## Verification
Review clock APIs, unit conversions, wraparound tests, synchronization metrics, fault injection, and long-duration tests.