# Research — Multi-Agent Image Context Replay Budget

**Topic:** Multi-agent image-context replay amplification  
**Category:** Performance  
**Research date:** 2026-08-28 (UTC+7)

## Problem
Large image payloads embedded in agent transcripts can be inherited by child agents, re-persisted during compaction, and replayed on later turns, multiplying token processing, network transfer, rollout growth, memory pressure, swap activity, and latency.

## Why it matters now
Current Codex reports span macOS and Windows. July 2026 evidence measured extreme task-family amplification; August 15–16 reports independently show multi-gigabyte rollouts, resource failures, and very large image-heavy compaction requests.

## Affected users
Developers using coding agents with screenshots/image generation, controller/subagent workflows, multimodal agent-platform builders, and operators of long-running multimodal sessions.

## Current public evidence
### Observed evidence
1. OpenAI Codex #33235 (2026-07-15): one root plus 25 descendants; 1,480,645,018 total recorded tokens; 70.73 GB visible upstream traffic; ~2.9 GB rollout allocation; inherited image payloads; heavy swap growth. About 95% of input tokens were cached, so caching did not remove aggregate resource amplification.  
   https://github.com/openai/codex/issues/33235
2. OpenAI Codex #38753 (2026-08-15): a Windows image-generation workflow produced 15 rollout JSONL files totaling ~9.36 GB, several ~1.2 GB child rollouts, retained superseded generations, and correlated OOM/resource failures.  
   https://github.com/openai/codex/issues/38753
3. OpenAI Codex #38861 (2026-08-16): a long-running image task sent a remote compaction body of 43,810,885 bytes before compression; compaction failed while the UI indicated “Context compacted” and reconnecting.  
   https://github.com/openai/codex/issues/38861

### Interpretation
The recurring class is multimodal-history amplification: parent history, compaction, retries, and descendants can copy binary-derived context instead of carrying bounded references. Prompt caching reduces uncached computation but does not prevent oversized contexts, local-state growth, or repeated byte/token processing.

## Existing approaches
Prompt/prefix caching; context compaction; generated-image caches; local rollout persistence; manual archive/cleanup; user-authored instructions to reduce unnecessary context.

## Remaining limitations
Caching does not bound repeated cached context; compaction can reserialize payloads; child creation can inherit broad parent context without a byte/token budget; archive/retention behavior may not reclaim all artifacts; warnings commonly arrive after pathological growth.

## Root-cause analysis
1. Image content is often embedded inline rather than content-addressed and referenced.
2. Handoffs default to broad transcript inheritance rather than task-minimal context.
3. Compaction lacks image-aware deduplication/reference semantics.
4. Resource accounting is fragmented across tokens, rollout bytes, cache bytes, memory, and network.
5. No deterministic pre-spawn task-family budget is enforced.

## Improvement opportunity
A reusable gate can measure the task family before additional fan-out and make context narrowing deterministic rather than reactive.

### Proposed solution
Use a platform-neutral pre-spawn budget gate over normalized telemetry. Measure inherited image bytes, task-family rollout bytes, input tokens/turn, descendant count, optional network bytes, and latency. When limits are exceeded, require explicit context narrowing through references, hashes, selected images, or task-specific handoffs. Do not delete required context automatically.

## Relevant sources
- https://github.com/openai/codex/issues/33235
- https://github.com/openai/codex/issues/38753
- https://github.com/openai/codex/issues/38861
