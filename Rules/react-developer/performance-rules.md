# Frontend Performance Rules

## Purpose
Ensure React performance work is evidence-based and protects user-perceived responsiveness.

## Scope
Applies to rendering, JavaScript execution, bundle delivery, network usage, images, caching, and interaction latency.

## MUST
- Performance changes MUST begin from a measured symptom or budget breach.
- Before/after measurements MUST use comparable conditions.
- Large bundle additions MUST include impact review on startup and route loading.
- Expensive render or computation paths MUST be profiled before optimization.
- Critical user flows MUST define relevant performance expectations when latency materially affects usability.

## MUST NOT
- MUST NOT claim a performance improvement without measurement.
- MUST NOT add memoization, virtualization, prefetching, or caching mechanically.
- MUST NOT improve one metric by silently degrading correctness, accessibility, or security.

## SHOULD
- Prefer route-level code splitting for large, infrequently used features.
- Prefer reducing unnecessary work before introducing complex caching.
- Prefer real-user telemetry when available for production performance conclusions.

## Exceptions
Document the measurement gap, expected benefit, risk, and follow-up measurement plan when optimization must precede complete evidence.

## Verification
Use browser performance tools, React Profiler, bundle analysis, lab benchmarks, network inspection, and production metrics where available.