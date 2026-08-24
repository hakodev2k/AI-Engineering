# Performance and Energy Rules

## Purpose
Control latency, memory, CPU, network, storage, and battery costs using evidence.

## Scope
Launch, rendering, scrolling, background work, networking, memory, thermal behavior, and energy usage.

## MUST
- Performance claims MUST be supported by before/after measurements under comparable conditions.
- User-critical paths MUST have explicit latency or responsiveness expectations where performance matters.
- Expensive work MUST be moved off the main thread unless the platform requires otherwise.
- Memory growth, retain cycles, repeated network work, and background execution MUST be investigated when observed.
- Performance fixes MUST preserve correctness and accessibility.

## MUST NOT
- MUST NOT optimize solely from intuition when profiling can provide evidence.
- MUST NOT trade unbounded memory, network, or battery usage for small latency gains without documented acceptance.
- MUST NOT block the main thread with avoidable I/O or long computation.

## SHOULD
- Profile release-like builds on representative devices.
- Use caching only with explicit invalidation, size, and freshness policy.
- Track launch and critical interaction regressions in CI or release qualification when feasible.

## Exceptions
Unmeasured emergency mitigations require documented rationale and a follow-up measurement plan.

## Verification
Use Instruments, MetricKit or equivalent telemetry, signposts, network metrics, memory graphs, device thermal/energy tests, and repeatable benchmarks.