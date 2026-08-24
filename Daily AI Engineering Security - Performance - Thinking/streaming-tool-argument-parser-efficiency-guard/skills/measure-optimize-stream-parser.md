# Skill — Measure and Optimize Streaming Tool Argument Parsing

## Purpose
Find and remove superlinear parsing/repair work in streamed tool-call argument handling without changing final tool semantics.

## Trigger
Large tool calls cause latency/event-loop stalls, provider adapters change partial JSON handling, or a parser optimization is proposed.

## Inputs
Provider adapter code, representative payload sizes, chunk distributions, baseline traces/benchmarks, final JSON schema.

## Preconditions
Capture a baseline before modifying parsing behavior. Keep execution disabled for incomplete inputs.

## Required context
Trace raw delta ingestion → accumulator → optional preview → final parse/schema validation → tool dispatch.

## Allowed tools
Profiler/benchmark tools, repository inspection, Python 3, provider test fixtures, `scripts/stream_arg_bench.py`.

## Constraints
Do not trade correctness/security for speed. Do not execute partial inputs. Preserve final argument bytes/semantics and explicit error handling.

## Procedure
1. Measure baseline across at least four increasing payload sizes and realistic chunk sizes.
2. Count full-prefix parses/repairs per tool call and identify whether work scales with both prefix length and chunk count.
3. Separate three responsibilities: raw delta capture, preview materialization, authoritative final parsing.
4. Form a measurable hypothesis, e.g. “append raw deltas and parse once at completion reduces normalized parse cost while preserving final JSON.”
5. Implement the smallest strategy change; throttle preview parsing if live preview is required.
6. Re-run identical benchmarks and semantic fixtures.
7. Compare CPU/wall time, normalized `ms/KB`, scaling ratios, peak memory if available, and final-object equality.
8. Send evidence to an independent benchmark verifier.

## Decision points
If preview fidelity requires expensive parsing, reduce preview frequency rather than weakening final validation. If an incremental parser changes semantics on malformed/Unicode data, fall back to raw accumulation plus final parse.

## Expected output
Baseline, root cause, hypothesis, implementation summary, before/after benchmark JSON, correctness results, residual risks.

## Metrics
Parse ms, ms/KB, chunks, payload bytes, scaling ratio, event-loop delay if available, final semantic equality, malformed-input rejection.

## Verification
Independent verifier must reproduce representative measurements and correctness tests.

## Failure handling
Maximum 2 optimization cycles. If improvement is not measurable or correctness regresses, revert the optimization path and retain baseline evidence.

## Stop conditions
Complete when performance improves measurably with equivalent final semantics and all regression tests pass; otherwise stop after two evidence-driven attempts and escalate.
