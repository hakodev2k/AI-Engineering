# Research — Tool-Call Atomic Context Pruning

## Topic
Tool-Call Atomic Context Pruning

## Category
Token

## Problem
Naive context-window trimming can split an assistant tool-call request from its corresponding tool result. This saves tokens but corrupts message history, causing provider HTTP 400 errors, broken resumed sessions, unnecessary retries, or forced resets.

## Why it matters now
Multiple 2026 agent/runtime issues show that window-based memory and compression still break tool-call/result atomicity. As agents use more tools and longer histories, token management increasingly operates on structured protocol state rather than independent text messages.

## Affected users
Agent-framework maintainers, workflow builders, RAG/memory implementers, coding-agent users, long-running assistant sessions, and platform teams implementing context trimming or compaction.

## Current public evidence
### Observed evidence
1. n8n issue #34166, opened 2026-07-14, reports `contextWindowLength` trimming that starts with an orphan `tool` message and causes OpenAI 400 errors because the corresponding assistant `tool_calls` message was trimmed away: https://github.com/n8n-io/n8n/issues/34166
2. n8n issue #33431, opened 2026-07-02, reports Redis Chat Memory truncating tool-call sequences and causing OpenAI Responses API errors: https://github.com/n8n-io/n8n/issues/33431
3. Hermes Agent issue #57039 documents a broader class of malformed histories where repair logic handled stray tool messages but did not make assistant tool-call sequences self-contained: https://github.com/NousResearch/hermes-agent/issues/57039
4. LangChain's `INVALID_CHAT_HISTORY` and `INVALID_TOOL_RESULTS` documentation states that assistant tool calls and tool-result messages must form valid matched sequences and identifies orphan/missing tool messages as malformed history: https://docs.langchain.com/oss/python/langgraph/errors/INVALID_CHAT_HISTORY and https://docs.langchain.com/oss/python/langchain/errors/INVALID_TOOL_RESULTS
5. LangChain short-term memory guidance explicitly warns that after deleting/trimming messages, resulting history must remain valid and that tool-calling assistant messages generally require corresponding tool results: https://docs.langchain.com/oss/python/langchain/short-term-memory

## Existing approaches
- Keep the last N messages.
- Trim by approximate token count.
- Summarize older messages.
- Repair malformed history after an API error.
- Add stub tool results during compression.
- Provider-specific sanitization immediately before a model request.

## Remaining limitations
Message-count and token-count trimming treat messages as independent units even though a tool-call turn is a protocol transaction. Reactive repair can lose tool outputs or invent stubs after damage. Provider-specific sanitizers may run only on certain paths, leaving save/load, resume, memory backends, or custom compressors inconsistent. Summaries can also replace only one side of a tool transaction.

## Root-cause analysis
- Context managers optimize token size without first constructing protocol-level atomic units.
- Tool-call IDs and tool-result IDs are not validated before/after pruning.
- Budget algorithms may cut at an arbitrary message boundary.
- State persistence and API replay use different validators.
- Token reduction success is measured without a correctness/regression gate.

## Improvement opportunity
Represent history as pruneable atomic units. An assistant message containing tool calls plus all immediately associated tool results is one indivisible unit. Validate the original sequence, prune oldest complete units until within budget, never emit an orphan tool message or unanswered tool call, validate again, and fail closed rather than silently manufacturing missing context. Summaries should replace only complete units and include explicit provenance.

## Goal
Reduce context usage while preserving tool-protocol correctness and enough recent context for task quality.

## Metrics
- Tokens/estimated tokens before vs after pruning.
- 0 orphan tool results after pruning.
- 0 unanswered tool calls introduced by pruning.
- 0 provider schema errors caused by pruned history.
- Context utilization percentage.
- Regression rate on representative agent tasks.
- Quality/verification score remains within the accepted threshold.

## Trigger
Before model invocation when context exceeds a configured budget, during memory-window loading, or before persisting a compacted session.

## Inputs
Ordered message history, context budget, reserved output tokens, protected system/current-goal messages, optional per-message token usage, and provider validity rules.

## Outputs
Validated pruned history, before/after budget measurements, retained/dropped unit counts, integrity findings, and stop/failure reason.

## Interpretation
The observed bugs are framework-specific implementations, but they demonstrate a reusable failure class: token optimization that ignores transactional message structure can reduce tokens while making the context unusable.

## Proposed solution
A reusable atomic-unit pruning procedure, rules, pre-model hook, deterministic validator/pruner, regression tests, and independent context-integrity verification. It intentionally prioritizes correctness over achieving a token target when both cannot be satisfied.