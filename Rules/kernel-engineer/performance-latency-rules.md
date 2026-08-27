# Performance and Latency Rules

## Purpose
Protect throughput, tail latency, CPU efficiency, memory efficiency, and scalability using evidence.

## Scope
Hot paths, scheduling impact, locking, allocation, cache behavior, I/O, interrupts, and system-wide performance.

## MUST
- Performance changes MUST define the metric and workload they intend to improve.
- Claimed improvements MUST include comparable before/after measurements.
- Hot-path changes MUST consider worst-case and tail latency, not only averages.
- Optimization MUST preserve correctness under concurrency, pressure, and failure conditions.
- Regressions affecting established budgets MUST be investigated or explicitly accepted.

## MUST NOT
- MUST NOT claim a performance improvement from intuition alone.
- MUST NOT trade correctness, isolation, or recoverability for speed without explicit approval.
- MUST NOT benchmark only synthetic conditions when production-relevant behavior differs materially.
- MUST NOT hide regressions by changing measurement methodology without disclosure.

## SHOULD
- Profile before optimizing.
- Measurements SHOULD include representative CPU counts, memory pressure, I/O patterns, and contention where relevant.
- Prefer removing unnecessary work over adding complexity to accelerate it.

## Exceptions
Exceptions require documented measurement limitations, expected impact, risks, and reviewer acceptance.

## Verification
Use reproducible benchmarks, profiling, tracing, scheduler/lock statistics, memory metrics, tail-latency distributions, and regression tests under representative load.