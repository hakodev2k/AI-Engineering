# Research — Multimodal Context Payload Replay Budget Guard

## Topic
Multimodal context payload replay amplification in long-running and multi-agent AI sessions.

## Category
Token

## Problem
Inline images and other large binary-derived payloads can be serialized repeatedly into model history, compaction records, child-agent inheritance, and subsequent turns. Prompt caching may reduce uncached model work but does not eliminate replayed context size, local storage growth, network transfer, or token accounting pressure.

## Why it matters now
Recent Codex reports in July–August 2026 show this as a concrete, high-amplitude production failure mode rather than a hypothetical optimization problem. Image-heavy task trees can amplify a single multimodal artifact across descendants and thousands of turns; compaction can also duplicate the same payload into rollout storage.

## Affected users
Developers using multimodal coding agents, teams running long autonomous tasks, agent-runtime builders, orchestration platforms that fork child contexts, and operators responsible for token cost, disk, memory, and network usage.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #33235, opened July 15, 2026, reports a 26-thread image-heavy task family with 1.48B total tokens, 70.73 GB of upstream traffic, multi-GB rollout/cache storage, and repeated inherited image context across child tasks. The report notes that roughly 95% of input tokens were cached, yet large contexts were still repeatedly processed across thousands of turns.
2. OpenAI Codex issue #33735, opened July 17, 2026, reports session storage growth to roughly 27.8 GiB; one rollout was 87.4% image data, and `replacement_history` reserialized prior inline images during repeated compactions.
3. OpenAI Codex issue #37346, reported in August 2026, independently describes dormant rollout files of about 21 GB and 7.7 GB with tens of thousands of repeated inline-image markers and hundreds of compactions.
4. OpenAI Codex issue #33493, opened July 16, 2026, reports local compaction retaining unbounded `input_image` payloads and entering repeated auto-compaction cycles.

### Interpretation
The recurring root pattern is payload identity loss: the runtime treats a large multimodal artifact as repeatable conversation bytes instead of a referenced immutable object. Forking and compaction multiply the same payload, while aggregate token/cost telemetry can hide the causal artifact. This is especially dangerous in multi-agent trees because amplification grows with both turns and descendants.

## Existing approaches
Current systems use model prompt caching, automatic compaction, context windows, local rollout persistence, and sometimes per-request token accounting. Users can manually start new threads, remove images, or avoid image-heavy workflows.

## Remaining limitations
Prompt caching does not bound bytes transferred/stored or cached-token replay. Compaction can become part of the amplification mechanism if it embeds the same binary payload again. Aggregate token metrics do not identify which content object is being replayed. Manual thread resets discard useful context and do not prevent recurrence.

## Root-cause analysis
- Binary/multimodal content is embedded rather than referenced by stable content identity.
- Parent-to-child inheritance lacks per-artifact replay budgets.
- Compaction serialization does not reliably deduplicate immutable payloads.
- Runtime accounting aggregates tokens/bytes instead of attributing amplification to payload hashes and lineage.
- No deterministic preflight blocks a child/turn from inheriting already-replayed heavyweight content.

## Improvement opportunity
Introduce a deterministic payload ledger keyed by content hash. Count bytes and replay events per artifact and lineage, enforce per-artifact/per-thread budgets, replace duplicate inherited payloads with stable references or summaries where correctness permits, and fail closed before a payload amplification threshold is crossed. Preserve required visual semantics by requiring explicit rehydration when the consumer truly needs the original bytes.

## Relevant sources
- https://github.com/openai/codex/issues/33235
- https://github.com/openai/codex/issues/33735
- https://github.com/openai/codex/issues/37346
- https://github.com/openai/codex/issues/33493

## Goal
Reduce repeated multimodal bytes/tokens per task while preserving task quality and the ability to rehydrate required artifacts.

## Metrics
Bytes per logical artifact, replay count per artifact, inherited payload bytes per child, tokens/task, cached and uncached input tokens, rollout-file growth, network bytes, compaction frequency, result-quality regression rate.

## Trigger
Any task that includes inline image/media payloads, forks child contexts, or performs automatic compaction.

## Inputs
Runtime event/rollout records containing thread IDs, parent IDs, artifact payloads or hashes, event types, and byte/token estimates.

## Outputs
Artifact ledger, amplification report, budget decision (`allow`, `reference`, `block`), and verification metrics.
