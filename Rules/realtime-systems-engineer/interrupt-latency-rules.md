# Interrupt Latency Rules

## Purpose
Keep interrupt handling bounded, analyzable, and compatible with system deadlines.

## Scope
Interrupt service routines, deferred work, nesting, masking, and interrupt-driven I/O.

## MUST
- Interrupt handlers MUST execute bounded work and defer noncritical processing outside interrupt context.
- Maximum interrupt-disabled sections MUST be measured or bounded and included in latency analysis.
- Interrupt priority assignments MUST reflect timing criticality and shared-resource effects.
- Interrupt storm behavior MUST be defined for externally driven sources.

## MUST NOT
- MUST NOT perform unbounded allocation, blocking I/O, or potentially blocking synchronization in critical interrupt handlers.
- MUST NOT mask higher-criticality interrupts longer than the documented latency budget.

## SHOULD
- Keep handlers minimal and instrumentable without materially perturbing timing.

## Exceptions
Exceptions require platform-specific evidence, bounded timing analysis, and reviewer approval.

## Verification
Inspect ISR code, interrupt configuration, tracing, maximum masking measurements, storm tests, and deadline-impact analysis.