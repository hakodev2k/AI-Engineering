# Research — Compaction Residual State Guard

## Topic
Preserve recoverable tool state and task residuals across context compaction and truncated tool output.

## Category
Token

## Problem
When long agent sessions compact history, truncated tool results and execution state can become invisible to the continuation even though the data may still exist in persisted rollout/session storage. The agent then re-reads, repeats work, loses task state, or falsely concludes evidence is missing.

## Why it matters now
Recent 2026 Codex issues show that compaction and output truncation still lose execution residuals or fail to expose recovery pointers, causing repeated work, context waste, and session unreliability.

## Affected users
Developers using long-running coding agents, large tool outputs, repository scans, multi-agent tasks, persistent sessions, and automatic compaction.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #37121 (Aug 5, 2026) reports a 26,790-token function output being truncated, followed by compaction; the continuation could not access needed state although complete function-call arguments remained persisted in rollout storage. https://github.com/openai/codex/issues/37121
2. Issue #35528 (Jul 26, 2026) describes incomplete residual fidelity across capture, model-visible, and durable state: capped/elided outputs lack a durable contract recording what was kept, omitted, recoverable, and what remains to do. https://github.com/openai/codex/issues/35528
3. Issue #35935 reports compaction losing task state, repeating completed work, and exhausting usage in long Windows sessions. https://github.com/openai/codex/issues/35935
4. Earlier issue #14589 documented that compaction rebuilt history while dropping tool outputs and assistant execution context, demonstrating the long-standing structural risk. https://github.com/openai/codex/issues/14589

## Interpretation
Token compression is being treated as text summarization, but agent execution requires a state-preservation contract. Large outputs do not need to remain inline, yet the compacted context must preserve durable references, omission metadata, integrity hashes, and recovery instructions for state that remains relevant.

## Existing approaches
- Summarize conversation/history during compaction.
- Truncate oversized tool output.
- Persist rollout/session logs separately.
- Start a new thread or re-read repository data after loss.

## Remaining limitations
Summaries can omit exact tool-call identity, artifact paths, output ranges, hashes, and whether omitted data is still recoverable. Persistence alone is insufficient when the post-compaction agent has no model-visible pointer to the persisted record. Re-derivation wastes tokens and can produce different conclusions.

## Root-cause analysis
1. No canonical residual schema spans tool capture, persisted storage, and compacted context.
2. Truncation metadata says output was omitted but often lacks a retrieval pointer/range/hash.
3. Compaction optimizes token count without verifying execution-state coverage.
4. Recovery is reactive after the model notices missing context.
5. No deterministic pre-compaction integrity gate verifies that required state is represented.

## Improvement opportunity
Before compaction, inventory stateful tool results and required execution facts. For every large/omitted item, emit a compact residual containing stable ID, tool, status, artifact/reference, integrity hash, retained/omitted sizes, recoverability, and next-use reason. Block compaction when required state is neither embedded nor recoverably referenced.

## Goal
Reduce context usage without making completed execution state unreachable or forcing expensive re-derivation.

## Metrics
- residual coverage of required tool state
- unresolved required-state count after compaction
- repeated tool/read calls caused by missing state
- post-compaction tokens/task
- recovery success rate
- hash/reference validation failures
- task-quality regression rate

## Trigger
Tool output truncation, auto/manual compaction, session resume/fork, or context utilization crossing a configured threshold.

## Inputs
Tool-call/result inventory, persisted record IDs/paths, required-state markers, content hashes, token/byte sizes, recovery capability.

## Outputs
Residual manifest, integrity decision, compact recovery references, and blocking failures for unrecoverable required state.

## Relevant sources
- https://github.com/openai/codex/issues/37121
- https://github.com/openai/codex/issues/35528
- https://github.com/openai/codex/issues/35935
- https://github.com/openai/codex/issues/14589
