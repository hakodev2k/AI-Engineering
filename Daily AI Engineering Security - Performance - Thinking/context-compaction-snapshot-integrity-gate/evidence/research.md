# Research — Context Compaction Snapshot Integrity Gate

**Topic:** Wrong token snapshot drives premature/destructive compaction  
**Category:** Token  
**Research date:** 2026-08-28 (UTC+7)

## Problem
Long tool-use turns produce multiple API calls. If an agent runtime persists the sum of all calls as though it were the latest prompt/context size, compaction sees phantom pressure and can repeatedly summarize or discard active history.

## Why it matters now
This defect class remains current in 2026.7.x agent runtimes. August reports include live reproductions, source-level pointers, repeated compaction churn, misleading context meters, skipped memory flushes, and destructive loss of detailed session state.

## Affected users
Long-running agent users, tool-heavy workflows, platform engineers implementing context accounting, and teams relying on automatic compaction/memory.

## Current public evidence
### Observed evidence
1. OpenClaw #118772 (2026-08-03, P0/data-loss): premature compaction at 4–8% of a 1M-token context. A session with 285,908 stored tokens was evaluated above 1.1M and compacted to 125,487 active tokens. The report identifies cumulative run usage being persisted as `totalTokensFresh=true`.  
   https://github.com/openclaw/openclaw/issues/118772
2. OpenClaw #117511 (2026-08-01): gateway/webchat persisted 1,515,840 tokens while the last real call represented ~81,174 tokens (~22% of a 370k window), producing six compactions in one day.  
   https://github.com/openclaw/openclaw/issues/117511
3. OpenClaw #115143 (2026-07-28): compaction metadata failed to reset and `totalTokens` accumulated to 1,883,759 against a 131,072 context limit, after which auto-compaction repeatedly failed.  
   https://github.com/openclaw/openclaw/issues/115143
4. OpenClaw #15006 documents the same broader accounting class: cache read/write usage treated as context-window consumption, with 13 of 14 observed compaction events reported as false alarms.  
   https://github.com/openclaw/openclaw/issues/15006

### Interpretation
The failure is context-accounting integrity, not simply a bad threshold. Latest-call context, cumulative run usage, cache accounting, output usage, and transcript estimates have different semantics and cannot be interchanged. A freshness boolean cannot make the wrong measurement authoritative.

## Existing approaches
Persist last-call usage; mark snapshots fresh/stale; re-estimate transcript tokens when snapshots are unavailable; reset counters after compaction; bound overflow-compaction retries.

## Remaining limitations
Different runners can bypass the last-call invariant; fallbacks may silently accept cumulative usage; provider cache semantics vary; later writes can overwrite correct post-compaction metadata; and destructive summarization magnifies a small accounting defect into data loss.

## Root-cause analysis
1. Token values lack explicit semantic type/provenance.
2. Multiple runtime paths write session metadata independently.
3. Freshness is tracked separately from correctness.
4. Compaction gates trust one counter without an independent plausibility check.
5. Post-compaction state invariants are not always enforced by later writers.

## Improvement opportunity
A typed snapshot contract can make compaction authorization depend on measurement semantics rather than a generic token counter.

### Proposed solution
Require an explicit trusted `latest_context_tokens` snapshot, compare it with persisted metadata and an optional transcript estimate, and gate automatic compaction on trusted context-window utilization. Cumulative run usage remains valid for billing/analytics but MUST NOT authorize destructive compaction. On conflicting measurements, suppress auto-compaction, recompute once, then preserve history and escalate rather than retrying indefinitely.

## Relevant sources
- https://github.com/openclaw/openclaw/issues/118772
- https://github.com/openclaw/openclaw/issues/117511
- https://github.com/openclaw/openclaw/issues/115143
- https://github.com/openclaw/openclaw/issues/15006
