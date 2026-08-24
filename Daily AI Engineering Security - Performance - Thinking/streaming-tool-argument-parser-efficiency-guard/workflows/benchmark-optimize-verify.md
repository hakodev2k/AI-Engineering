# Workflow — Benchmark, Optimize, Verify

## Trigger
Parser/provider change or evidence of slow/hanging large streamed tool calls.

## Goal
Reduce streamed argument parsing cost while preserving final semantics and safe execution boundaries.

## Inputs
Current parser, representative payload/chunk matrix, final schema, baseline traces.

## Baseline
Run `scripts/stream_arg_bench.py` and record payload bytes, chunk count, parse ms, normalized ms/KB, scaling, and semantic result.

## Context
Use `evidence/research.md`, `rules/stream-parser-performance.md`, and `skills/measure-optimize-stream-parser.md`.

## Stages
1. Observe stream path and collect representative sizes/chunks.
2. Measure baseline with at least four increasing payload sizes.
3. Diagnose prefix reparsing, repair frequency, buffering, and execution-readiness coupling.
4. Form one measurable hypothesis.
5. Implement raw append + bounded preview + authoritative final parse or an equivalent incremental strategy.
6. Measure again with the identical matrix.
7. If not improved, re-evaluate once using new evidence; maximum 2 optimization cycles.
8. Independent `subagents/benchmark-verifier.md` reproduces performance and correctness tests.

## Responsible agent
Performance implementer owns stages 1–7; Benchmark Verifier owns stage 8.

## Tools
Python 3 benchmark, profiler where available, provider fixtures, repository tests.

## Outputs
Before/after JSON, scaling verdict, semantic-equivalence evidence, malformed/truncation result, release decision.

## Checkpoints
No optimization before baseline. No release before semantic equality and independent verification.

## Metrics
Parse CPU/wall ms, ms/KB, scaling ratio, event-loop delay where available, peak memory where available, final equality, malformed-input rejection.

## Retry policy
Maximum 2 optimization cycles. A retry must alter the hypothesis or implementation based on measured evidence.

## Stop conditions
PASS on measurable improvement plus correctness. STOP/ESCALATE after two failed cycles or any unresolved execution-safety regression.

## Failure path
Revert the optimization path, preserve benchmark evidence, and do not weaken validation or execute partial input to improve numbers.

## Definition of Done
Current evidence documented; baseline captured; root cause identified; improvement implemented; benchmark rerun; measurable benefit shown; final semantics equal; malformed final JSON rejected; tests pass; independent verifier PASS; risks documented.
