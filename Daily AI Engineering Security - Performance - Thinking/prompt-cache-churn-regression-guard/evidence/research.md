# Research — Prompt Cache Churn Regression Guard

**Topic:** Unexpected prompt-cache invalidation and redundant large-prefix rewrites  
**Category:** Token  
**Research date:** 2026-08-28 (UTC+7)

## Problem
Long-lived AI coding and agent sessions can abruptly lose prompt-cache reuse and rewrite very large stable prefixes, multiplying token cost and latency without corresponding task progress.

## Why it matters now
Recent August 2026 Claude Code reports describe cache collapse during very large active sessions, including a roughly 950k-token context repeatedly dropping to a small cached prefix and another incident reporting about 10.4M redundant cache-write tokens. Large repository contexts, tool definitions, history, and subagent state make each miss expensive.

## Affected users
Developers using long coding sessions, platform teams running persistent agents, multi-agent orchestrators, and teams paying provider usage directly.

## Current public evidence
### Observed evidence
1. Claude Code issue #85326, opened 2026-08-09, reports prompt cache drops roughly every 40 seconds in a ~950k-token session, forcing large rewrites despite a previous successful cache read and a 1-hour cache setting: https://github.com/anthropics/claude-code/issues/85326
2. Claude Code issue #83542, opened 2026-08-03, reports 17 cache drops across roughly three hours and about 10.4M redundant cache-write tokens. The reporter later noted the anomaly did not recur, so this is evidence of a real failure mode rather than proof of a universal bug: https://github.com/anthropics/claude-code/issues/83542
3. Claude Code issue #47528, opened 2026-04-13, reports substantial growth in cold-cache system-prompt tokens across versions, illustrating how expensive a cache miss becomes as the stable prefix grows: https://github.com/anthropics/claude-code/issues/47528
4. Claude Code issue #51335, opened 2026-04-20, reports dramatically increased response times in extended sessions even with high cache reuse, showing that context-size latency must be measured separately from cache churn: https://github.com/anthropics/claude-code/issues/51335

### Interpretation
The engineering gap is insufficient per-turn cache observability and regression gating. A nominal cache feature or long TTL does not prove reuse actually occurred. Teams need to detect unexpected cache-read collapse, distinguish it from normal expiry, and correlate it with prefix mutation and latency.

## Existing approaches
- Provider prompt-caching controls and explicit TTL selection.
- Stable-prefix-first prompt layout.
- Session restart or compaction.
- Manual inspection of cache-read and cache-creation usage fields.
- Reducing tool definitions or context size.

## Remaining limitations
- TTL configuration cannot prevent all mid-session invalidations.
- Aggregate billing dashboards are too coarse to locate the exact request where churn begins.
- Restarting can sacrifice useful working state and repeat repository scans.
- Token reduction without quality checks can remove required context.
- Cache behavior is provider/client specific, so a reusable detector should consume neutral usage fields rather than provider internals.

## Root-cause analysis
1. Stable-prefix mutation or client-side prompt reconstruction can change cache identity.
2. Large base/system/tool prefixes amplify one miss.
3. Telemetry is commonly aggregated rather than evaluated per turn.
4. Teams lack a baseline for expected read/write ratios by session phase.
5. Optimization often starts before separating cache failure from general long-context latency.

## Improvement opportunity
Add deterministic telemetry analysis that establishes baseline cache behavior, detects sharp cache-read collapse plus oversized cache creation, correlates churn with stable-prefix fingerprints, compares before/after latency and tokens, and blocks regressions only when measurable thresholds are exceeded. Required correctness context must never be removed solely to improve cache metrics.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/85326
- https://github.com/anthropics/claude-code/issues/83542
- https://github.com/anthropics/claude-code/issues/47528
- https://github.com/anthropics/claude-code/issues/51335
