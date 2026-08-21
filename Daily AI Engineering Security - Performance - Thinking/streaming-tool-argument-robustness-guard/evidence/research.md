# Research — Streaming Tool Argument Robustness Guard

## Topic
Streaming Tool Argument Robustness Guard

## Category
Performance

## Problem
Agent runtimes increasingly stream large tool/function-call arguments. Several current implementations repeatedly parse the entire growing JSON prefix, start tools before arguments are complete, or mishandle provider-specific cumulative/partial argument semantics. The result is avoidable CPU/allocation growth, event-loop stalls, long silent periods, malformed arguments, and tool-loop hangs.

## Why it matters now
Large write/edit tools and long generated payloads are common in coding agents. Recent public reports show both superlinear client-side parsing cost and correctness failures at streaming boundaries. These failures are especially expensive because they occur after the model has already generated substantial output.

## Affected users
Coding-agent users, agent framework maintainers, provider adapters, MCP/tool-runtime authors, and teams operating long-running agents with large edit/write calls.

## Current public evidence
### Observed evidence
1. Prime Agent issue #942, opened 2026-08-08, reports O(n²)-like CPU/allocation behavior because each streamed argument delta is appended and the whole prefix is reparsed, sometimes multiple times: https://github.com/PrimeIntellect-ai/prime-agent/issues/942
2. GitHub Copilot CLI issue #4286, opened 2026-07-30, documents multi-minute silence for large streamed tool arguments and an all-or-nothing failure when the tool JSON is truncated after the caller has already paid for output tokens: https://github.com/github/copilot-cli/issues/4286
3. Zed issue #59970, opened 2026-06-26, reports input-streaming tools starting on incomplete JSON and hanging after repeated deserialization failures: https://github.com/zed-industries/zed/issues/59970
4. vLLM issue #48702, opened 2026-07-10, reports streamed tool-call argument corruption/truncation around schema coercion and partial JSON handling: https://github.com/vllm-project/vllm/issues/48702
5. LangGraphJS issue #2570, opened 2026-06-24, reports adapters concatenating provider snapshots as if they were deltas, producing dirty tool arguments such as repeated JSON fragments: https://github.com/langchain-ai/langgraphjs/issues/2570

## Existing approaches
- Reparse the full JSON prefix after every delta to provide live partial arguments.
- Buffer everything and parse only when the provider signals completion.
- Use permissive partial-JSON repair libraries.
- Start selected tools early and stream arguments into them.
- Trust a provider adapter to normalize delta versus cumulative-snapshot semantics.

## Remaining limitations
Full-prefix reparsing can become superlinear. End-only parsing loses progressive visibility and can create long silent intervals. Partial parsers may accept malformed intermediate states differently across providers. Starting tools early can hang when required fields have not arrived. Blind concatenation fails when a provider emits cumulative snapshots instead of true deltas. None of these strategies alone supplies bounded memory, protocol normalization, final-authoritative reconciliation, and measurable performance regression protection.

## Root-cause analysis
- Stream event semantics are not normalized before aggregation.
- Parsing work is proportional to total prefix size on every chunk instead of to new input.
- Intermediate and final arguments are treated as equally authoritative.
- Runtimes conflate presentation-time partial parsing with execution-time validation.
- Tool execution may begin before required fields are complete.
- There is often no byte/chunk/time budget or benchmark gate for streamed arguments.

## Improvement opportunity
Use a two-layer accumulator: normalize each event as delta or cumulative snapshot, append/replace in O(new-data), expose throttled best-effort previews without authorizing execution, and treat the provider's final arguments as authoritative. Enforce byte/chunk/time budgets and collect parse CPU, allocations/proxy work, time-to-final-args, malformed-event count, and tool-start-before-final violations. Benchmark naive full-prefix parsing against the guarded path before deployment.

## Goal
Reduce argument-stream processing cost and eliminate execution on incomplete or inconsistent arguments without sacrificing final tool-call correctness.

## Metrics
- Processing time versus payload size remains approximately linear for the guarded accumulator.
- No tool executes before final arguments unless its schema explicitly supports safe incremental execution.
- Final normalized arguments exactly match the provider final payload when present.
- Malformed/truncated streams terminate with an explicit error, never an unbounded wait.
- Peak buffered bytes stay within configured limits.
- Benchmark records before/after elapsed time and parse-attempt count.

## Trigger
Any agent/provider integration that streams tool/function-call arguments, especially write/edit calls or payloads above 16 KiB.

## Inputs
Ordered stream events, tool name/id, event mode (`delta`, `snapshot`, `final`), optional final authoritative arguments, schema metadata, and policy budgets.

## Outputs
Normalized final argument JSON, stream metrics, explicit status (`complete`, `truncated`, `invalid`, `budget_exceeded`), and regression evidence.

## Interpretation
The evidence shows a recurring integration class rather than one framework-specific bug: streaming argument protocols create both performance and correctness hazards when clients repeatedly parse or execute intermediate state. It does not imply that all streaming implementations are affected.

## Proposed solution
A reusable normalization, buffering, benchmark, and verification package that keeps execution gated on finalized arguments while still allowing bounded partial previews.

## Relevant sources
- https://github.com/PrimeIntellect-ai/prime-agent/issues/942
- https://github.com/github/copilot-cli/issues/4286
- https://github.com/zed-industries/zed/issues/59970
- https://github.com/vllm-project/vllm/issues/48702
- https://github.com/langchain-ai/langgraphjs/issues/2570
