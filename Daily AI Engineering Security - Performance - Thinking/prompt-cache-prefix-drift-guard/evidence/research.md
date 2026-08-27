# Research — Prompt Cache Prefix Drift Guard

**Topic:** Prevent silent full-prefix prompt-cache invalidation in resumed AI coding sessions  
**Category:** Token  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Prompt caching only saves cost and latency while the cached prefix remains stable. Coding agents can rebuild system prompts, tool descriptions, repository metadata, or session state on resume. A change near the start can invalidate a very large suffix of otherwise reusable context.

## Why it matters now
Recent Claude Code reports show cache invalidation from multiple independent prefix-drift triggers. The larger the session, the larger the potential recache exposure.

## Affected users
Developers using long-running coding agents, teams paying token/API costs, agent-platform builders, and operators resuming sessions across client updates.

## Current public evidence

### Observed evidence
1. Anthropic Claude Code issue #86244, opened 2026-08-13, reports a background auto-update changing system/tool blocks before an existing conversation. On resume the reporter measured roughly 22k cache-read tokens plus 794k cache-creation tokens where the prior turn read about 890k cached tokens. The report rules out TTL expiry, compaction, git-status change, and tail hooks as the trigger: https://github.com/anthropics/claude-code/issues/86244
2. The same report links independent issue #78720, where dynamic `git status` changes between resumed turns invalidate the prompt prefix, plus related cache-collapse reports triggered by effort state, tool loading, image eviction, and max-token recovery: https://github.com/anthropics/claude-code/issues/78720
3. A 2026-08-13 Claude Code community digest identifies prompt-cache invalidation as a current cost concern and independently groups auto-update, git-status, and related regressions: https://github.com/huang-yi-dae/agents-radar/issues/452

### Interpretation
The recurring engineering problem is uncontrolled mutation of early prompt blocks combined with no pre-send exposure check. Provider caching can work correctly while the client destroys reuse by changing the prefix.

### Proposed solution
A deterministic pre-resume guard compares block fingerprints from the last known cache-hitting request with the rebuilt candidate, reports the first divergence and estimated recache exposure, and blocks expensive unexplained drift before model submission.

## Existing approaches
- Provider automatic/prefix caching.
- Cache-read/cache-write telemetry after requests.
- Session resume and internal cache-diagnosis hashes.
- Starting a fresh session when a resume is known to be expensive.

## Remaining limitations
- Most telemetry arrives after cost is incurred.
- Dynamic repo/tool/system content can sit before stable history.
- A live cache TTL does not help if the prefix changes.
- Users often cannot estimate recache exposure before sending.

## Root-cause analysis
1. Prefix cache identity is order-sensitive.
2. Dynamic state is injected too early.
3. Session formats do not always pin prompt-block versions.
4. Resume lacks a mandatory preflight diff.
5. Cost controls usually monitor aggregate usage rather than single-turn cache-write spikes.

## Improvement opportunity
Make prefix stability observable and enforceable before spend. Stable block identities and session-pinned metadata turn cache regressions into explicit policy failures rather than surprise charges.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/86244
- https://github.com/anthropics/claude-code/issues/78720
- https://github.com/huang-yi-dae/agents-radar/issues/452
