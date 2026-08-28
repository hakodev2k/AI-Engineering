# Research — Context Compaction Snapshot Integrity Gate

**Topic:** Wrong token snapshot drives premature/destructive compaction  
**Category:** Token  
**Research date:** 2026-08-28 (UTC+7)

## Problem
Long tool-use turns produce multiple API calls. If an agent runtime persists the sum of all calls as if it were the latest prompt/context size, compaction logic sees phantom pressure and may repeatedly summarize/discard active history.

## Why it matters now
This defect class remains current in 2026.7.x agent runtimes. August reports include live reproductions, source-level pointers, repeated compaction churn, misleading context meters, skipped memory flushes, and destructive loss of detailed conversation state.

## Affected users
Long-running agent users, developers using tool-heavy loops, platform engineers implementing context accounting, and teams relying on automatic compaction/memory.

## Current public evidence

### Observed evidence
1. OpenClaw #118772, opened 2026-08-03 and labeled P0/data-loss, reports premature compaction at 4–8% of a 1M-token context. One session had 285,908 stored tokens but an observed/decision value above 1.1M; compaction reduced the active representation to 125,487 tokens. The report identifies cumulative run usage being persisted as `totalTokensFresh=true` rather than the current prompt snapshot.  
   https://github.com/openclaw/openclaw/issues/118772
2. OpenClaw #117511, opened 2026-08-01, independently reports a gateway/webchat session persisting 1,515,840 tokens while the last assistant call represented ~81,174 tokens (~22% of a 370k window), causing six compactions in one day. The issue explicitly contrasts accumulated multi-call usage with last-call context.  
   https://github.com/openclaw/openclaw/issues/117511
3. OpenClaw #115143, opened 2026-07-28, reports compaction metadata not resetting and `totalTokens` accumulating to 1,883,759 against a 131,072 context limit, after which auto-compaction repeatedly fails.  
   https://github.com/openclaw/openclaw/issues/115143
4. Earlier OpenClaw #15006 documents the related accounting error of treating cache read/write usage as context-window consumption, with 13 of 14 observed auto-compaction events described as false alarms.  
   https://github.com/openclaw/openclaw/issues/15006

### Interpretation
The persistent issue is an integrity problem in context accounting, not simply an imperfect threshold. A token number requires provenance and semantics: latest-call context, cumulative run usage, cached-token accounting, output usage, or transcript estimate are not interchangeable. A boolean “fresh” marker is insufficient if the upstream measurement type is wrong.

## Existing approaches
- Persist the latest call's usage instead of run accumulators.
- Mark token snapshots fresh/stale.
- Re-estimate transcript tokens when snapshots are unavailable.
- Reset counters after compaction.
- Bound overflow-compaction retries.

## Remaining limitations
- Different runners/writers can bypass the intended last-call invariant.
- Fallbacks may silently accept cumulative usage when latest-call usage is absent.
- Provider cache semantics differ and can be double-counted.
- Correct post-compaction values can be overwritten by later stale writes.
- Compaction is destructive enough that a bad counter can become data loss.

## Root-cause analysis
1. Token usage values lack explicit semantic type/provenance.
2. Multiple execution paths persist session metadata independently.
3. Freshness is tracked separately from measurement correctness.
4. Compaction gates trust one counter without independent plausibility checks.
5. Post-compaction writes do not always enforce monotonic state invariants.

## Improvement opportunity
Define a typed snapshot contract and deterministic pre-compaction guard. Automatic compaction requires an explicit `latest_context_tokens` measurement with trusted provenance, consistency with an optional transcript estimate, and a threshold based on context-window utilization. Cumulative run usage may be recorded for billing/analytics but MUST NOT authorize destructive compaction. If measurements conflict, suppress auto-compaction and recompute once rather than retrying indefinitely.

## Relevant sources
- OpenClaw #118772: https://github.com/openclaw/openclaw/issues/118772
- OpenClaw #117511: https://github.com/openclaw/openclaw/issues/117511
- OpenClaw #115143: https://github.com/openclaw/openclaw/issues/115143
- OpenClaw #15006: https://github.com/openclaw/openclaw/issues/15006
