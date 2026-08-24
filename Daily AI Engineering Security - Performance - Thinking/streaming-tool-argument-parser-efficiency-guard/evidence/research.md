# Research — Streaming Tool Argument Parser Efficiency Guard

## Topic
Streaming tool-call argument parsing without quadratic reparse cost or partial-input corruption

## Category
Performance

## Problem
Some agent/provider adapters append each streamed tool-call argument delta to an ever-growing JSON buffer and repeatedly parse or repair the entire prefix on every chunk. For large tool arguments this creates O(n²)-like CPU/allocation behavior, event-loop stalls, latency spikes, and sometimes malformed/truncated tool inputs.

## Why it matters now
Large tool arguments are increasingly common in coding agents (`write_file`, `edit_file`, MCP document payloads, generated patches). Fresh 2026 reports across multiple runtimes show both performance and correctness failures in partial JSON handling.

## Affected users
Agent-framework maintainers, provider-adapter authors, coding-agent users, MCP/tool builders, gateway operators, and teams streaming large structured tool payloads.

## Current public evidence
### Observed evidence
1. Prime Agent issue #942, opened 2026-08-08, identifies O(n²)-like CPU/allocation behavior because Anthropic/OpenAI provider paths append deltas then reparse the full accumulated prefix, with repair/partial parse work on each delta. https://github.com/PrimeIntellect-ai/prime-agent/issues/942
2. DeepSeek Harness discussion #3923, 2026-08-21, independently reports an OpenAI adapter concatenating `tool_calls[].function.arguments` and running `partial-json` over the full buffer on every chunk, explicitly identifying O(n²) behavior and upstream failures in long sessions. https://github.com/deepseek-ai/deepseek-harness/discussions/3923
3. Zed issue #59970, opened 2026-06-26, reports streamed `edit_file`/`write_file` calls hanging when partial JSON is started too early and repeatedly deserialized before the full tool input is available. https://github.com/zed-industries/zed/issues/59970
4. GitHub Copilot CLI issue #4286, opened 2026-08, reports large `input_json_delta` tool arguments being buffered for minutes and all-or-nothing delivery causing paid output with zero usable tool input when truncated. https://github.com/github/copilot-cli/issues/4286
5. vLLM issue #48702, opened 2026-07-15, reports streamed tool arguments silently truncating when type coercion breaks a prefix invariant during flush. https://github.com/vllm-project/vllm/issues/48702

## Interpretation
The recurring weakness is treating partially streamed structured arguments as if they were repeatedly complete JSON documents. Efficient handling should separate raw byte/delta accumulation, optional throttled preview materialization, and one authoritative final parse/validation.

## Existing approaches
- Concatenate deltas and call a partial-JSON parser after each chunk.
- Repair incomplete JSON on every chunk to render a live preview.
- Buffer until complete and parse once.
- Stream tool input directly to tools that advertise input streaming.
- Provider-specific incremental parsing/tokenization.

## Remaining limitations
- Full-prefix reparsing makes total work grow superlinearly with argument length/chunk count.
- Parsing every chunk can block the event loop and delay unrelated streams.
- All-or-nothing buffering removes progress visibility and can waste complete billed generations on truncation.
- Executing tools from syntactically plausible partial JSON risks incomplete semantics.
- Provider-specific implementations drift in malformed/Unicode/nesting behavior.

## Root-cause analysis
1. Parser API accepts a whole string, so adapters repeatedly reconstruct semantic state from byte zero.
2. UI preview needs are coupled to execution readiness.
3. Raw delta transport, partial visualization, and final validated arguments share one mutable representation.
4. No benchmark gate measures scaling slope across payload size/chunk size.
5. Correctness tests often cover final JSON but not partial, malformed, Unicode, truncation, and large-payload streams.

## Improvement opportunity
Adopt a three-lane contract: append raw deltas in O(total bytes); throttle optional preview parsing/materialization to bounded frequency; perform one authoritative final JSON parse and schema validation before execution. Benchmark the adapter with increasing payload sizes and fail if normalized cost grows superlinearly beyond tolerance.

## Proposed solution
This package provides a deterministic benchmark/profiler, scaling regression test, enforceable parser rules, optimization skill, independent benchmark verifier, bounded measure-optimize-verify workflow, and a pre-merge performance hook.

## Goal
Lower CPU time/allocation and stream latency for large tool arguments without changing final argument semantics or executing incomplete input.

## Metrics
- parse CPU ms per tool call
- allocations/peak bytes when available
- total bytes and chunk count
- normalized parse cost `ms/KB`
- empirical scaling ratio from small to large payloads
- event-loop delay or wall-clock stream handling time
- final-argument equality with reference parser
- malformed/truncation detection rate

## Trigger
Changes to streamed tool-call parsing, large-payload latency incidents, provider-adapter onboarding, or observed event-loop stalls during tool generation.

## Inputs
Generated or captured tool-argument payloads, chunk sizes, repeat count, parser strategy.

## Outputs
Benchmark JSON, scaling verdict, final semantic-equivalence verdict, and regression evidence.

## Verification
Verified only when before/after benchmarks show lower normalized cost or improved scaling on representative sizes, final JSON matches the reference parse, malformed final input is rejected, and no partial input is executed.

## Relevant sources
- https://github.com/PrimeIntellect-ai/prime-agent/issues/942
- https://github.com/deepseek-ai/deepseek-harness/discussions/3923
- https://github.com/zed-industries/zed/issues/59970
- https://github.com/github/copilot-cli/issues/4286
- https://github.com/vllm-project/vllm/issues/48702
