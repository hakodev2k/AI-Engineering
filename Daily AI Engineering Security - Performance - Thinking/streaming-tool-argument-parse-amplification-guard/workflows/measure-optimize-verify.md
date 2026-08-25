# Workflow — Measure, Optimize, Verify Streaming Parser

## Trigger
New provider streaming path, large-argument latency complaint, parser CPU spike, or CI regression.

## Goal
Eliminate avoidable parse amplification while preserving correctness.

## Inputs
Representative streamed argument fixtures, traces, budgets, parser implementation.

## Baseline
Capture at least three final argument sizes with fixed chunk distributions. Record total parse CPU, p95 parse time, final bytes, and chunk count.

## Context
Network/model time is out of scope unless it contaminates parser timing.

## Stages
1. **Observe** symptoms and collect traces.
2. **Measure baseline** with profiler.
3. **Diagnose** whether growth is parser amplification, scheduler blocking, or another subsystem.
4. **Form hypothesis** with expected metric movement.
5. **Implement improvement**.
6. **Measure again** on identical fixtures.
7. If not improved, re-evaluate; maximum 3 attempts.
8. **Verify correctness** against valid and malformed fixtures.
9. **Independent review** by `subagents/performance-verifier.md`.

## Responsible agent
Runtime implementer; independent performance verifier.

## Tools
`stream_parse_profiler.py`, `regression_gate.py`, language/runtime profiler, unit tests.

## Outputs
Before/after profiles, scaling estimate, correctness results, final verdict.

## Checkpoints
Baseline exists; fixture identity is preserved; budgets are not relaxed during the run; correctness tests remain enabled.

## Metrics
Total parse CPU, parse CPU/KB, scan amplification, p95 per-delta parse latency, scaling exponent.

## Retry policy
Maximum 3 implementation attempts. Each retry must cite failed evidence and alter the hypothesis or technique.

## Stop conditions
Verified budgets and correctness; or three failed attempts; or any safety/correctness regression.

## Failure path
Revert the optimization or disable the affected experimental streaming path; preserve baseline evidence for follow-up.

## Verification
Run unit tests and regression gate. Independent verifier must not be the sole implementer.

## Definition of Done
Implemented: targeted parser change exists. Measured: before/after traces collected. Verified: budgets pass, semantics match, malformed input remains safe, reviewer approves.
