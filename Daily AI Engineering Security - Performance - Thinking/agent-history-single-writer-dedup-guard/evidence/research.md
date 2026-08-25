# Research

## Topic
Single-writer conversation-history persistence and duplicate-token amplification

## Category
Token

## Problem
Agent systems can append already-persisted conversation messages multiple times because several orchestration layers believe they own history persistence or because a full accumulated transcript is mistaken for a delta. The duplicates are then reloaded into model context, multiplying input tokens, storage, latency, and sometimes corrupting tool-call ordering.

## Why it matters now
Modern agent stacks combine hosted transports, per-service-call middleware, workflow executors, checkpoints, gateways, and local history providers. Recent 2026 issues show duplication surviving through these compositions and, in some cases, growing quadratically or exponentially over turns.

## Affected users
Developers running multi-turn agents, handoff workflows, AG-UI applications, Responses API gateways, persistent sessions, and platform teams paying model/storage costs.

## Current public evidence
### Observed evidence
1. Microsoft Agent Framework issue #7211, opened 2026-07-20, reports `PerServiceCallHistoryPersistingMiddleware` persisting each call's full accumulated input again because `save_messages` blindly appends and has no message-identity check. In looped hosted/AG-UI runs, stored history grows by the conversation-so-far on every model round. https://github.com/microsoft/agent-framework/issues/7211
2. Microsoft Agent Framework issue #7591, opened 2026-08-08, reports streaming `create_harness_agent` runs duplicating the transcript after tool calls. A wrapper rebuilds a response and loses the `conversation_id` sentinel indicating local history persistence, so the function loop resends the full turn while the history provider injects the persisted copy too, producing duplicated context and provider 400 errors. https://github.com/microsoft/agent-framework/issues/7591
3. Microsoft Agent Framework issue #5147, opened 2026-04-07, documents `HandoffBuilder` plus checkpoint storage and auto-injected `InMemoryHistoryProvider` creating two independent history sources, producing quadratic message growth. https://github.com/microsoft/agent-framework/issues/5147
4. Hermes Agent issue #860, opened 2026-03-10, found three separate code paths writing the same gateway session to SQLite, producing roughly 3–4x transcript and token inflation. https://github.com/NousResearch/hermes-agent/issues/860
5. Hermes Agent issue #68257, opened 2026-07-20, reports Responses API `previous_response_id` chaining doubling stored conversation history every turn when turn-start detection fails and full response messages are appended to already-held history. https://github.com/NousResearch/hermes-agent/issues/68257

## Interpretation
Across independent frameworks, the repeated root pattern is missing write ownership and commit identity. History is treated as an appendable list while the producer may be sending either full state or a delta. Middleware metadata intended to distinguish those modes can be lost, and multiple valid persistence components can compose into an invalid whole.

## Existing approaches
- Built-in HistoryProvider/session/checkpoint abstractions.
- Conversation IDs or sentinels for service-managed history.
- Message filtering/truncation and compaction.
- Application workarounds that inject a no-op history provider or custom middleware.
- Provider validation for malformed tool-call histories.

## Remaining limitations
Compaction happens after wasted writes; no-op-provider workarounds are easy to forget; append stores often lack idempotency keys; full-history and delta payloads are not type-distinct; transport wrappers can strip ownership metadata; provider validation detects structural corruption only after token/context amplification has occurred.

## Root-cause analysis
1. More than one layer is permitted to act as authoritative history writer.
2. Persist operations lack stable per-message idempotency identity.
3. APIs do not distinguish `replace/full snapshot` from `append/delta` strongly enough.
4. Session-management metadata can be dropped across middleware/stream reconstruction.
5. Reload paths trust duplicated persisted state and feed it back to the model, forming a positive amplification loop.

## Improvement opportunity
Make persistence ownership explicit and measurable. Assign stable message IDs before any middleware, allow exactly one active append writer per conversation scope, persist only unseen deltas, retain service-managed-history metadata, and continuously measure append amplification and model-visible duplicate ratios.

## Proposed solution
This package provides a deterministic persistence-trace validator, single-writer rules, an audit skill, bounded repair workflow, pre-commit hook contract, and regression tests.

## Goal
One durable commit per logical message and no duplicate model-context contribution caused by history persistence.

## Metrics
Active append-writer count, append events/unique IDs, duplicate commit count, input tokens/task, cost/task, history bytes, duplicate model-visible messages, tool-call structure errors, and result-quality regression.

## Trigger
Adding/changing history providers, checkpoints, gateways, hosted transports, streaming wrappers, handoff workflows, per-call middleware, or session restoration logic.

## Inputs
Persistence trace containing writers and message IDs, plus before/after token/context measurements.

## Outputs
Allow/block report, duplicate IDs, writer ownership evidence, and amplification ratio.

## Relevant sources
- https://github.com/microsoft/agent-framework/issues/7211
- https://github.com/microsoft/agent-framework/issues/7591
- https://github.com/microsoft/agent-framework/issues/5147
- https://github.com/NousResearch/hermes-agent/issues/860
- https://github.com/NousResearch/hermes-agent/issues/68257
