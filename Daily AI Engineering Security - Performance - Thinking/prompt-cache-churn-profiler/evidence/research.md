# Research

## Topic
Prompt Cache Churn Profiler

## Category
Performance

## Problem
Agent sessions can repeatedly rewrite large stable prompt prefixes because cache entries expire or are invalidated, causing severe token-cost and latency amplification that may not affect correctness enough to be noticed quickly.

## Why it matters now
Several recent public bug reports quantify the problem. Claude Code issue #85326 (opened August 9, 2026) reports a ~950k-token context cache dropping roughly every 40 seconds and being rewritten. Issue #83542 (opened August 3) reports 17 cache drops in three hours and ~10.4M redundant cache-write tokens. Issue #84253 (opened August 5) reports a client no longer requesting 1-hour TTL, so gaps over five minutes force full rewrites. VS Code issue #321551 describes similar 5-minute expiry cost spikes in active agent sessions.

## Affected users
Developers using long-running coding agents, agent-platform builders, teams with large system/tool/repository prefixes, and organizations operating usage/cost budgets.

## Current public evidence
### Observed evidence
1. anthropics/claude-code #85326: repeated cache invalidation in a ~950k-token session; full context rewrites despite a prior cache hit seconds earlier.
2. anthropics/claude-code #83542: 17 cache drops over ~3 hours and ~10.4M redundant cache writes in one session.
3. anthropics/claude-code #84253: reports v2.1.218+ no longer requesting 1-hour TTL; `ephemeral_1h_input_tokens` remained zero and >5-minute gaps triggered rewrites.
4. microsoft/vscode #321551: prompt cache expiry during active agent sessions after gaps over ~5 minutes caused large stable histories to be billed/processed as uncached input.
5. Current Anthropic prompt-caching docs state the default TTL is 5 minutes, refreshed on hits; a 1-hour TTL is available. The docs expose cache read/create token counters and explain that some tool/thinking configuration changes can invalidate cached prefixes.

### Interpretation
Cache churn is an observability and orchestration problem as much as a provider-cache problem. Teams need weighted token accounting and event attribution to distinguish expected cache creation from repeated avoidable rewrites.

### Proposed solution
Normalize call-level cache telemetry; detect large repeated writes of previously reusable prefixes; classify likely expiry versus prefix/config mutation; then benchmark narrowly targeted changes such as longer TTL, more stable prefix ordering, fewer needless orchestration turns, or explicit breakpoints.

## Existing approaches
Provider prompt caching; 5m/1h TTL; automatic caching; explicit breakpoints; stable prefixes; usage dashboards; request tracing.

## Remaining limitations
Raw hit rate ignores magnitude. Provider logs may expose counters but not orchestration cause. Longer TTL costs more on write and is not automatically optimal. Prefix changes can be necessary for correctness. Agent waits/tool loops can create gaps or mutations that churn caches.

## Root-cause analysis
- TTL shorter than real inter-turn gaps.
- Large static prefix rewritten after expiry.
- Prefix mutation from changing tools/system blocks/configuration.
- Orchestrator creates unnecessary model turns or long wait gaps.
- Cache-health telemetry not aggregated per task/session.
- Optimization performed without same-workload before/after comparison.

## Improvement opportunity
Build a deterministic profiler that turns provider counters into task-level cache-churn metrics and blocks unsupported optimization claims. Use it to choose TTL and prefix strategies from measured workload behavior.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/85326
- https://github.com/anthropics/claude-code/issues/83542
- https://github.com/anthropics/claude-code/issues/84253
- https://github.com/microsoft/vscode/issues/321551
- https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-use-with-prompt-caching
