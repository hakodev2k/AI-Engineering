# Research — Prompt Prefix Volatility Cache Guard

**Topic:** prompt-prefix volatility causing cache churn  
**Category:** Token  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Agent prompts frequently mix highly stable instructions/tool schemas with request- or session-specific values. When volatile content appears early in a cacheable prefix, a tiny change can force expensive downstream prefix rewrites.

## Why it matters now
Multiple independent August 2026 reports show cache invalidation caused by dynamic system-prompt fields, hook context, subagent session identifiers, and notification-turn prompt changes, with material token/cost and latency impact.

## Affected users
Coding-agent users, multi-agent platform teams, prompt-runtime maintainers, and teams operating large tool schemas or long-context sessions.

## Current public evidence
### Observed evidence
1. Claude Code issue #83913, opened August 4, 2026, reports `PreToolUse`/`PostToolUse additionalContext` changing during history rebuild and invalidating a still-valid cached conversation prefix: https://github.com/anthropics/claude-code/issues/83913
2. Claude Code issue #85326, opened August 9, 2026, reports a ~950k-token long session repeatedly dropping cache reuse and rewriting most context despite a one-hour TTL: https://github.com/anthropics/claude-code/issues/85326
3. Prime Agent issue #1320, opened August 13, 2026, reports a unique subagent session path interpolated near the top of a cached system prompt, defeating reuse across subagent spawns: https://github.com/PrimeIntellect-ai/prime-agent/issues/1320
4. oh-my-pi issue #7324, opened August 1, 2026, identifies changing `date`/`cwd` at the end of system content as breaking prompt cache reuse; issue #7404 documents the still-open open-weight-provider variant: https://github.com/can1357/oh-my-pi/issues/7324 and https://github.com/can1357/oh-my-pi/issues/7404
5. The Last Harness issue #468, opened August 8, 2026, reports primary-agent system-prompt changes on subagent notification turns that both alter correctness policy and cause full Anthropic prompt-cache invalidation: https://github.com/diegopetrucci/the-last-harness/issues/468

### Interpretation
These failures share a prompt-assembly problem: stable and volatile segments are not modeled separately, so the first changed segment determines the cache blast radius. Provider caching can work correctly while application prompt construction destroys its value.

## Existing approaches
- Provider prompt caching and TTLs.
- Manual cache breakpoints.
- Stable system prompts by convention.
- Prompt compaction and context summarization.
- Tool-search/progressive disclosure to reduce schema size.

## Remaining limitations
- A valid TTL cannot help when prefix bytes change.
- Cache hit/miss metrics often do not identify the first changed segment.
- Dynamic values are convenient to place in system instructions even when they change every request/session.
- Moving context blindly can damage correctness if consumers depend on its priority or location.
- Large cached prefixes magnify a tiny volatility defect.

## Root-cause analysis
1. Prompt builders lack explicit `stable` versus `volatile` segment contracts.
2. Dynamic runtime metadata is interpolated into high-prefix positions.
3. Hooks can mutate historical context during rebuilds.
4. Cache observability is token-aggregate rather than segment-attributed.
5. Optimization is attempted without measuring quality/correctness after relocation.

## Improvement opportunity
Represent prompt construction as ordered named segments with token estimates and stability classification. Diff consecutive builds, find the first changed segment, calculate downstream blast-radius tokens, and enforce a cache-churn budget. Relocate or isolate volatile segments only after correctness tests prove equivalent behavior.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/83913
- https://github.com/anthropics/claude-code/issues/85326
- https://github.com/PrimeIntellect-ai/prime-agent/issues/1320
- https://github.com/can1357/oh-my-pi/issues/7324
- https://github.com/can1357/oh-my-pi/issues/7404
- https://github.com/diegopetrucci/the-last-harness/issues/468
