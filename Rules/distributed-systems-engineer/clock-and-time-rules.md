# Clock and Time Rules

## Purpose
Prevent correctness bugs caused by clock skew and ambiguous time semantics.

## Scope
Timeouts, leases, timestamps, ordering, TTLs, and cross-node coordination.

## MUST
- Time-based correctness assumptions MUST account for clock skew and synchronization failure.
- Monotonic clocks MUST be used for elapsed-time measurement where available.
- Business timestamps MUST define timezone and precision semantics.

## MUST NOT
- MUST NOT use wall-clock timestamps as a unique ordering authority across nodes.
- MUST NOT assume NTP eliminates skew.

## SHOULD
- Clock-offset monitoring SHOULD exist where leases or temporal ordering are safety-critical.

## Exceptions
Clock-based coordination requires bounded-skew evidence and a failure plan.

## Verification
Review time APIs, skew simulations, lease tests, timestamp formats, and clock-monitoring evidence.