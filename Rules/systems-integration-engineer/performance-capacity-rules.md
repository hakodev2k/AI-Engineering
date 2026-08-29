# Performance and Capacity Rules

## Purpose
Prevent integration bottlenecks, saturation, and unsupported performance claims.

## Scope
Applies to throughput, latency, concurrency, batch size, queue depth, rate limits, and resource use.

## MUST
- Expected and peak volumes MUST be documented for production-critical integrations.
- Performance targets MUST identify the measured boundary and percentile or throughput definition where relevant.
- Capacity-sensitive changes MUST be validated with representative measurements before broad rollout.
- Backpressure, throttling, or load-shedding behavior MUST be defined when downstream capacity can be exceeded.
- Performance improvements MUST be supported by before-and-after evidence.

## MUST NOT
- MUST NOT infer scalability from a small happy-path test.
- MUST NOT remove safety limits to achieve benchmark numbers without risk review.
- MUST NOT claim a dependency can sustain a rate beyond documented or measured capacity.

## SHOULD
- Load tests SHOULD model bursts, retries, slow dependencies, and realistic payload distributions.
- Capacity headroom SHOULD be explicit for critical paths.

## Exceptions
Document the unvalidated assumption, evidence available, risk, monitoring, rollback trigger, and approval.

## Verification
Review load-test results, production metrics, rate-limit configuration, queue behavior, profiling, and capacity calculations.