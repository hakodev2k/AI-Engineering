# JavaScript Execution Rules

## Purpose
Control main-thread cost, responsiveness risk, and runtime overhead caused by client-side JavaScript.

## Scope
Applies to parsing, compilation, execution, hydration, event handling, long tasks, workers, and client runtime behavior.

## MUST
- Measure JavaScript cost on representative lower-capability devices for critical journeys.
- Identify long tasks and attribute them to specific code paths before optimization.
- Keep synchronous work on interaction paths bounded to preserve responsiveness.
- Reassess execution cost when adding frameworks, polyfills, analytics, or large features.

## MUST NOT
- Move work to startup merely to simplify implementation when it delays user-visible readiness.
- Claim JavaScript optimization from transferred-byte reduction alone without runtime evidence.
- Introduce unbounded loops, synchronous serialization, or heavy computation on latency-sensitive interactions.

## SHOULD
- Defer non-critical work, split tasks, and use workers when isolation materially reduces main-thread contention.
- Prefer progressive activation over eager initialization for non-critical features.

## Exceptions
Exceptions require measured user impact, alternatives considered, mitigation, and a documented reason the runtime cost is acceptable.

## Verification
Use browser performance traces, long-task attribution, CPU profiles, interaction testing, RUM INP diagnostics, and code review.