# Performance and Overhead

## Purpose
Ensure instrumentation or enforcement does not destabilize workloads.

## Scope
CPU, memory, hook frequency, map operations, event volume, contention, tail latency, and benchmark methodology.

## MUST
- Performance claims MUST include before/after measurements on representative workloads.
- Hot-path programs MUST have an explicit overhead budget.
- Benchmarks MUST measure host and application impact, including tail latency where relevant.
- High-frequency hooks MUST bound per-event work and emitted data.
- Regressions beyond agreed budgets MUST block rollout or receive explicit approval.

## MUST NOT
- MUST NOT infer low overhead from small source size or verifier acceptance.
- MUST NOT benchmark only idle or synthetic conditions when production load differs materially.
- MUST NOT hide sampling or event loss when presenting performance results.

## SHOULD
- Use per-CPU state and aggregation where it reduces contention without violating semantics.
- Profile before optimizing.

## Exceptions
Budget exceptions require quantified impact, business/operational justification, alternatives, monitoring, and approval.

## Verification
Run reproducible benchmarks, profile CPU, inspect map/event rates, compare latency percentiles, and validate under peak-like load.