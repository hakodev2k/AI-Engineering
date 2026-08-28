# Research — Multi-Agent Image Context Replay Budget

**Topic:** Multi-agent image-context replay amplification  
**Category:** Performance  
**Research date:** 2026-08-28 (UTC+7)

## Problem
Large image payloads embedded in agent transcripts can be inherited by child agents, re-persisted during compaction, and replayed on later turns. This converts one logical image workflow into disproportionate token processing, network traffic, disk usage, memory pressure, and latency.

## Why it matters now
The issue is actively reported in current Codex builds. A July 2026 macOS report measured extreme task-family amplification, while an August 15 Windows report independently observed multi-gigabyte rollouts and resource failures in an image-generation workflow. A separate August 16 report describes a 43.8 MB pre-compression compaction request in a long-running image task and a misleading successful-compaction UI state after remote compaction failure.

## Affected users
Developers using coding agents with screenshots/image generation, teams using controller/subagent fan-out, agent-platform builders persisting multimodal histories, and operators of long-running multimodal sessions.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #33235, opened 2026-07-15, reports one root plus 25 descendants with 1,480,645,018 total recorded tokens, 70.73 GB visible upstream traffic, ~2.9 GB rollout allocation, image payload inheritance into child tasks, and heavy swap growth. The report explicitly notes ~95% of input tokens were cached, showing prompt caching did not eliminate aggregate context-processing/resource amplification.  
   https://github.com/openai/codex/issues/33235
2. OpenAI Codex issue #38753, opened 2026-08-15, reports a Windows image-generation workflow with 15 rollout JSONL files totaling ~9.36 GB, several ~1.2 GB child-agent rollouts, retained superseded images, OOM/resource errors, and parent history materialized into child rollouts.  
   https://github.com/openai/codex/issues/38753
3. OpenAI Codex issue #38861, opened 2026-08-16, reports a long-running image-generation task whose remote compaction request body reached 43,810,885 bytes before compression; compaction failed while UI state indicated “Context compacted” and reconnecting.  
   https://github.com/openai/codex/issues/38861

### Interpretation
These reports are independent signals of the same engineering class: multimodal history is too often treated as ordinary transcript text, so parent history, compaction output, retries, and descendants can copy expensive binary-derived context instead of carrying bounded references. The strongest current evidence is product-specific, but the failure mode generalizes to any agent runtime that serializes inline image data or blindly inherits full parent context.

## Existing approaches
- Prompt/prefix caching to reduce uncached model computation.
- Context compaction/summarization.
- Generated-image caches and local rollout persistence.
- Manual archiving and cleanup.
- User-authored instructions to avoid unnecessary context rereads.

## Remaining limitations
- Cached tokens still contribute to repeated context processing and may correlate with substantial network/local-state overhead.
- Compaction can preserve or reserialize payloads rather than externalizing them by reference.
- Child-agent creation often inherits broad parent context without a byte/token budget.
- Retention and archive semantics may not reclaim all generated artifacts.
- Runtime warnings often arrive only after the task has already reached pathological size.

## Root-cause analysis
1. Binary/image content is embedded inline rather than content-addressed and referenced.
2. Handoff semantics default to broad transcript inheritance rather than task-minimal context.
3. Compaction operates on serialized history but may not have image-aware deduplication.
4. Resource accounting is fragmented across model tokens, rollout bytes, cache bytes, memory, and network traffic.
5. No deterministic pre-spawn gate enforces task-family budgets.

## Improvement opportunity
Introduce a platform-neutral budget gate that consumes normalized task metrics before spawning/retrying image-heavy child agents. It should measure inherited image bytes, rollout bytes, input tokens/turn, descendant count and optional network/latency, then block or require explicit context narrowing when limits are exceeded. The improvement is deliberately non-destructive: use references, hashes, selected images, and task-specific handoffs instead of deleting required context.

## Relevant sources
- OpenAI Codex #33235: https://github.com/openai/codex/issues/33235
- OpenAI Codex #38753: https://github.com/openai/codex/issues/38753
- OpenAI Codex #38861: https://github.com/openai/codex/issues/38861
