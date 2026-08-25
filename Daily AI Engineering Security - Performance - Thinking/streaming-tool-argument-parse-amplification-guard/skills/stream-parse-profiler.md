# Skill — Stream Parse Amplification Profiling

## Purpose
Determine whether streamed tool-argument parsing performs excessive cumulative work and identify the dominant scaling failure.

## Trigger
High CPU during streaming, event-loop stalls, slow large tool calls, provider-path changes, or parser regressions.

## Inputs
JSONL trace with `buffer_bytes`, `delta_bytes`, `parse_us`, and optional `call_id`; size-sweep traces when available.

## Preconditions
Use representative providers, argument shapes, and chunk sizes. Separate model/network time from parser time.

## Required context
`rules/performance-invariants.md` and `config/budgets.json`.

## Allowed tools
Profiler script, runtime profiler, benchmark harness, unit tests.

## Constraints
Do not infer complexity from a single point. Do not optimize by removing correctness-required parsing without an equivalent validation path.

## Procedure
1. Capture a baseline trace for small, medium, and large arguments.
2. Record per-delta buffer size and parser CPU.
3. Run `scripts/stream_parse_profiler.py` on each trace.
4. Compare scan amplification and p95 per-delta cost.
5. For a size sweep, use total parse CPU to estimate scaling exponent.
6. Form one falsifiable hypothesis, e.g. full-prefix reparsing dominates.
7. Implement one targeted change: incremental parser, reduced parse frequency, partial-field extraction, or safe parse-at-completion.
8. Re-run identical fixtures.
9. Run correctness tests for final arguments and malformed/truncated streams.
10. Pass the profile through `scripts/regression_gate.py`.

## Decision points
- Exponent near 2 or rapidly rising scan amplification: prioritize algorithmic fix.
- Low total CPU but high p95 delta: investigate event-loop scheduling/yielding.
- Good parser metrics but slow tool start: investigate provider/model/transport latency instead.
- Correctness mismatch: reject optimization.

## Expected output
Before/after profile, hypothesis, implementation change, budget status, correctness status.

## Metrics
Total parse CPU, scan amplification, exponent, p95 parse latency, parse CPU/KB, tool-input-ready time.

## Verification
Same workloads improve measured parser cost; final valid arguments are byte/structure equivalent; malformed streams remain non-executable.

## Failure handling
If instrumentation is incomplete, do not claim improvement. If three bounded attempts fail, escalate with traces and profiler output.

## Stop conditions
Budgets pass and correctness is verified, or three attempts fail.
