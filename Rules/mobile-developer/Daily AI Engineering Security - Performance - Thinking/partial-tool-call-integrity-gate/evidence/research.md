# Research — Partial Tool-Call Integrity Gate

## Topic
Fail-closed validation and recovery for streamed tool calls whose arguments, identity, or termination state are incomplete.

## Category
Security

## Problem
AI runtimes assemble tool calls from streamed fragments. If a provider stream ends early, parsers and recovery layers may still produce an empty or partial tool call. Executing that call can silently change semantics: a write may become a no-op, a command can lose parameters, a permission decision can be made against incomplete data, or the agent can falsely conclude work succeeded.

## Why it matters now
Multiple 2026 reports across agent frameworks show incomplete streamed tool calls remain a live interoperability and integrity problem. The risk is especially important for tools that write files, execute commands, send messages, alter infrastructure, or access sensitive data.

## Affected users
Agent-runtime developers, coding-agent users, providers implementing OpenAI-compatible streams, MCP/tool platform builders, and teams exposing side-effecting tools.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #80498 (opened 2026-08-06) reports a provider stream dying mid-tool-call, after which incomplete arguments were replaced by `{}` and the tool path continued; a `write_file` action did not occur and the agent drifted off-task: https://github.com/NousResearch/hermes-agent/issues/80498
2. OpenAI Agents Python issue #3861 (opened 2026-07-17) reports that non-buffered Chat Completions streaming could finalize incomplete tool calls with empty name/call ID while the buffered path raises `ModelBehaviorError`, demonstrating inconsistent completeness guarantees: https://github.com/openai/openai-agents-python/issues/3861
3. Kimi Code issue #660 (opened 2026-06-11) reports crashed sessions becoming impossible to resume when interrupted tool calls leave unmatched tool-call IDs in history: https://github.com/MoonshotAI/kimi-code/issues/660
4. Hermes Agent regression tests document handling for partial tool-call streams and warn that a stalled stream previously could lose an attempted `write_file` action without a user-facing signal: https://github.com/NousResearch/hermes-agent/blob/main/tests/run_agent/test_streaming.py
5. The pi AI README explicitly warns that partial streamed tool arguments can contain missing fields, truncated strings, incomplete arrays/objects, and recommends schema validation before execution in custom loops: https://github.com/FableFatale/pi-coding-agent/blob/main/pi-mono/packages/ai/README.md

## Existing approaches
- Buffer tool-call fragments until stream completion.
- JSON/schema validation before execution.
- Replace malformed arguments with empty objects to keep the loop alive.
- Return tool-validation errors to the model for repair.
- Repair conversation history after interrupted tool calls.
- Retry the model request after truncation/stream errors.

## Remaining limitations
Schema validation alone cannot prove that a syntactically valid object is the complete intended object. Replacing malformed data with `{}` changes semantics. Generic retries can repeat deterministic truncation or duplicate side effects if execution status is unknown. Conversation repair may restore protocol validity without proving whether the external action happened. Different streaming adapters provide different completeness guarantees.

## Root-cause analysis
- Partial and finalized tool-call states are often represented by the same data structure.
- Execution layers may receive best-effort parsed arguments before a terminal stream event.
- Tool identity, arguments, finish reason, and provider terminal event are not always validated together.
- Recovery lacks idempotency keys/postcondition evidence for side-effecting actions.
- Session replay can contain orphaned tool calls after interruption.

## Improvement opportunity
Create an integrity envelope that separates `partial`, `complete`, `executing`, `committed`, and `unknown` states. A tool becomes executable only after terminal stream evidence, stable identity, complete JSON/schema validation, policy authorization, and an integrity hash. Side-effecting tools require an idempotency key and postcondition evidence. Unknown execution outcomes are reconciled before retry.

## Interpretation
These reports do not prove every streaming tool implementation is unsafe. They demonstrate a recurring boundary failure where transport incompleteness can leak into execution semantics. The reusable solution is to make completeness and commit evidence deterministic runtime preconditions rather than model judgment.

## Proposed solution
A provider-neutral tool-call integrity schema, fail-closed validator, recovery workflow, enforceable rules, independent verifier, and adversarial tests.

## Goal
Zero execution of partial/incomplete calls and zero blind retry of side-effecting calls with unknown commit status.

## Metrics
- incomplete calls executed: 0
- calls missing terminal evidence executed: 0
- schema-invalid calls executed: 0
- duplicate side effects during recovery: 0
- unknown outcomes reconciled before retry: 100%
- valid complete calls falsely blocked: tracked and minimized

## Trigger
Streaming tool-call start/delta/end, stream interruption, tool execution start/end, session resume, or retry after transport failure.

## Inputs
Tool-call fragments, provider terminal state, tool schema, tool risk class, policy decision, idempotency key, execution/postcondition evidence.

## Outputs
`partial`, `ready`, `deny`, `reconcile`, or `committed` decision with reason codes and integrity hash.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/80498
- https://github.com/openai/openai-agents-python/issues/3861
- https://github.com/MoonshotAI/kimi-code/issues/660
- https://github.com/NousResearch/hermes-agent/blob/main/tests/run_agent/test_streaming.py
- https://github.com/FableFatale/pi-coding-agent/blob/main/pi-mono/packages/ai/README.md
