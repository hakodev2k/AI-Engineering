# Research Evidence

## Topic
Fork History Payload Dedup Guard

## Category
Token

## Problem
Full-history forks can inherit and persist superseded compaction snapshots plus repeated inline image payloads, multiplying local storage and the effective history payload used by child agents. In large multimodal threads this can create hundreds of megabytes or gigabytes per fork, repeated context processing, request instability, and server disconnects.

## Why it matters now
A fresh August 19, 2026 Codex report shows a thread-specific full-history fork of about 468 MB replaying 20 historical compaction records in roughly 1.6 seconds before the Responses WebSocket closes prior to completion. An earlier independent report measured approximately 110 GiB of session storage from 300 rollout files, with 97.6% of a representative 1.7 GB child rollout attributable to compacted records and repeated inline images.

## Affected users
Developers using long-running multimodal coding threads, multi-agent/subagent workflows, full-history forks, context compaction, and image-bearing tool outputs; platform teams operating persistent agent history stores.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #39499 reports a failing full-history fork with approximately 468 MB / 12k JSONL records. It replays 20 historical `compacted` records rapidly, contains a 26.3 MB latest replacement history, nine records over 20 MB, repeated inline `input_image` data URLs, and repeated image-bearing tool outputs. The Responses WebSocket handshake succeeds but closes before `response.completed`.
2. Issue #34268 independently reports approximately 110.09 GiB of local session storage across 300 rollout files after multi-agent V2 full-history forks. A representative child was ~1.7 GB; 97.6% of its bytes were in compacted records. One replacement history contained over 13 million characters of inline image data.
3. #34268 traces the duplication path to full-history fork behavior that reads parent history including `RolloutItem::Compacted` and then persists inherited rollout items into the child.
4. #39499 references related reports #24550 and #35647 concerning large inline images in compacted replacement history and full parent rollout persistence during forks.

### Interpretation
The failure is not simply “large context.” Historical compaction snapshots represent earlier versions of substantially the same model-visible history, while inline images are high-byte payloads. Copying every superseded snapshot into each full-history child creates multiplicative storage and payload growth. Retrying a failing request without changing the history shape can repeat the same oversized payload.

### Proposed solution
Introduce a fork preflight that measures inherited history by record type and byte contribution, identifies superseded compaction chains, detects duplicate inline binary/data-URL payloads, computes a safe inherited-history projection, and blocks or downgrades a full-history fork when configured byte/token budgets are exceeded. Correctness-critical recent context and the latest effective compacted history must be preserved.

## Existing approaches
- Context compaction to replace older model-visible history with a smaller replacement history.
- Full-history forking for child agents needing parent context.
- Append-only rollout persistence for audit/recovery.
- Manual selection of reduced `fork_turns` where supported.

## Remaining limitations
- Append-only historical compaction records can be treated as live inherited history rather than archival history.
- Inline images may be serialized repeatedly instead of referenced by content hash/blob identity.
- Full-history defaults can copy parent storage cost into every child.
- Retry logic may replay the same pathological payload.
- There is often no preflight budget or before/after quality verification for reduced fork context.

## Root-cause analysis
Primary root causes are semantic confusion between archival rollout records and the latest effective model-visible state; lack of content-addressed references for repeated binary payloads; full-history defaults that prioritize completeness without byte/token budgeting; and missing fork-specific observability for inherited versus child-generated context.

## Improvement opportunity
A deterministic analyzer can quantify duplicate/superseded bytes before a fork, select the latest effective compaction state plus required suffix, replace repeated large payloads with references where the runtime supports it, and verify that quality-critical context remains present.

## Relevant sources
- https://github.com/openai/codex/issues/39499
- https://github.com/openai/codex/issues/34268
- https://github.com/openai/codex/issues/24550
- https://github.com/openai/codex/issues/35647
