# Performance Rules

## Purpose
Prevent growth functionality from degrading user experience or system capacity.

## Scope
Experiments, analytics SDKs, personalization, landing flows, scripts, and growth services.

## MUST
- Measure relevant latency, resource, payload, or throughput impact before claiming performance safety or improvement.
- Set performance guardrails for changes on critical acquisition, signup, checkout, and activation paths.
- Investigate regressions with runtime evidence rather than assumptions.

## MUST NOT
- Add blocking third-party scripts to critical paths without quantified impact and fallback behavior.
- Claim performance improvement without comparable before/after measurements.

## SHOULD
- Load non-critical growth functionality asynchronously or lazily when correctness permits.

## Exceptions
Short-lived diagnostics may add bounded overhead when exposure, duration, and removal are controlled.

## Verification
Use real-user metrics, traces, profiling, synthetic tests, bundle/network inspection, load tests, and before/after benchmarks.