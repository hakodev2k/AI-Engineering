# Research — Streamed Tool-Call Argument Integrity Guard

## Topic
Streamed Tool-Call Argument Integrity Guard

## Category
Security

## Problem
Agent runtimes may receive incomplete, malformed, or provider-specific streamed tool-call arguments and then normalize them into a syntactically valid but semantically different object such as `{}`. A write, deploy, secret-read, or other side-effecting tool can then be skipped, mis-executed, or falsely reported as successful.

## Why it matters now
Recent August 2026 Hermes Agent reports show this is recurring across providers and long tool payloads. The failure can be silent: the runtime records a tool call, the intended arguments are gone, and downstream reasoning continues from a false state.

## Affected users
Agent-runtime maintainers, coding-agent users, MCP/tool integrators, platform teams using streamed function calls, and operators of long-running autonomous jobs.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #80498, opened 2026-08-06, reports a provider stream ending mid-tool-call; unrecoverable arguments were replaced with an empty object and `write_file` did not create the intended file. https://github.com/NousResearch/hermes-agent/issues/80498
2. Hermes Agent issue #89207, opened 2026-08-18, reports repeated truncated large tool-call arguments being substituted with `{}`, with transcript poisoning and apparent tool success. https://github.com/NousResearch/hermes-agent/issues/89207
3. Hermes Agent issue #69442 reports provider-specific streaming truncation for large `write_file` arguments and successful non-streaming behavior for the same provider/model. https://github.com/NousResearch/hermes-agent/issues/69442
4. Hermes Agent issue #83937 demonstrates a distinct compatibility case: genuinely no-argument tools may emit empty strings and need safe normalization to `{}`. This means a guard must distinguish legitimate empty arguments from truncated non-empty arguments rather than banning `{}` outright. https://github.com/NousResearch/hermes-agent/issues/83937

## Existing approaches
- Multi-pass JSON repair and fallback normalization.
- Provider retry on transport/empty-stream failures.
- Schema validation after parsing.
- Non-streaming fallback for problematic providers.
- Logging warnings when repair fails.

## Remaining limitations
JSON repair cannot reconstruct bytes that never arrived. Replacing malformed arguments with `{}` hides semantic loss. Schema validation alone is insufficient for tools with optional fields because `{}` may pass. Generic retry can duplicate side effects if the tool may already have executed. Provider-specific non-streaming workarounds do not generalize.

## Root-cause analysis
- Stream completeness and JSON validity are treated as the same property.
- Runtimes lose provenance about whether `{}` was model-authored or sanitizer-produced.
- Execution gates often validate shape but not integrity/completeness state.
- Tool results may be persisted even when invocation arguments were repaired destructively.
- Retry policy is not bound to a side-effect/idempotency classification.

## Improvement opportunity
Introduce an execution-boundary integrity envelope that tracks raw argument bytes, completion signal, repair actions, schema validity, and semantic-loss status. Block side-effecting calls whenever argument provenance indicates destructive repair or incomplete streaming. Retry only before execution and within a bounded policy; otherwise emit an explicit model-visible failure.

## Goal
Never execute a side-effecting tool with arguments that became valid only by lossy substitution after an incomplete or malformed stream.

## Metrics
- 100% tool calls receive integrity state before execution.
- 0 lossy-repaired side-effecting invocations execute.
- 100% blocked calls surface a structured failure to the agent/runtime.
- Legitimate zero-argument calls remain executable.
- Adversarial/truncation fixtures pass with no false success.

## Trigger
Any streamed tool/function call before execution, especially when parsing or repair occurred.

## Inputs
Tool name, raw argument fragments, stream completion state, finish reason, parsed arguments, repair trace, tool schema, side-effect classification, retry count.

## Outputs
`allow`, `retry`, or `block` decision; integrity findings; canonical arguments only when safe; audit record.

## Interpretation
The evidence shows a recurring runtime integrity failure, not a universal defect in streaming APIs. The reusable engineering problem is failure to preserve argument completeness/provenance across stream repair and execution.

## Proposed solution
A deterministic pre-execution gate plus bounded recovery workflow and regression fixtures. It does not attempt to infer missing user data; it fails closed for side-effecting calls when semantic completeness cannot be established.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/80498
- https://github.com/NousResearch/hermes-agent/issues/89207
- https://github.com/NousResearch/hermes-agent/issues/69442
- https://github.com/NousResearch/hermes-agent/issues/83937
- https://github.com/NousResearch/hermes-agent/issues/81025
