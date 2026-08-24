# Performance and Memory Rules

## Purpose
Protect startup time, frame responsiveness, memory stability, battery, and network efficiency using evidence.

## Scope
Applies to runtime performance and resource consumption on supported Android devices.

## MUST
- Define measurable performance targets for critical user journeys where latency materially affects experience.
- Support optimization claims with before/after measurements under comparable conditions.
- Investigate main-thread stalls, excessive allocation, leaks, ANRs, and repeated expensive work on critical paths.
- Test representative lower-resource devices or profiles when the supported population includes them.
- Bound caches and memory-retained collections.

## MUST NOT
- Optimize based solely on intuition when profiling can establish the bottleneck.
- Trade correctness, security, or maintainability for negligible unmeasured gains.
- Perform avoidable disk/network/blocking work on the main thread.

## SHOULD
- Track startup, frame, ANR, memory, battery, and network indicators relevant to the product.
- Optimize the dominant bottleneck first.

## Exceptions
Micro-optimizations without benchmarks are acceptable only when trivially safe and not presented as measured improvements.

## Verification
Use profilers, macro/microbenchmarks as appropriate, production telemetry, leak detection, strict-mode diagnostics, and repeatable device/test conditions.