# Research

## Topic
Compaction Reclaim Effectiveness Watchdog

## Category
Token

## Problem
Compaction is a token-control mechanism whose success event can diverge from its actual effect. Agents can compact repeatedly without reclaiming usable context, or stale post-compaction accounting can immediately trigger redundant compactions.

## Why it matters now
Recent 2026 issue reports show this as an active regression class in multiple agent systems, not a theoretical risk.

## Affected users
Long-running coding-agent users, agent platform builders, teams with large boot/context payloads, multi-tool workflows and expensive context windows.

## Current public evidence
### Observed evidence
1. OpenClaw issue #101052 reports that since 2026.6.10 embedded-runtime compaction could log successful transcript rotation yet reclaim no tokens. Token counts grew monotonically across back-to-back compactions; one agent reached 216k/160k (135%) after four successful compactions in 30 minutes. The reporter contrasted this with 2026.5.28, where comparable pressure recovered after compaction.
2. Oh My OpenAgent issue #3819 reports context statistics reverting to pre-compaction values after the next model response, immediately triggering another auto-compaction. The root cause identified in the issue was event handling that did not filter compaction-agent messages, allowing stale/pre-compaction values to repopulate monitoring state.
3. OpenClaw issue #118772 separately reports premature compaction from inflated cumulative token accounting. Although that issue concerns the trigger side, it reinforces that compaction control must distinguish actual stored/current context from cumulative runtime usage and verify state after transitions.

### Interpretation
Threshold logic alone is insufficient. Compaction needs a postcondition just like a cache eviction, GC pass, or database maintenance operation: the active context must measurably shrink by an expected amount and monitoring state must remain consistent after the following turn. Otherwise a successful control-plane event can hide data-plane failure.

### Proposed solution
Record pre/post active-context tokens, calculate reclaim ratio, validate post-compaction utilization, detect repeated compactions with inadequate intervening growth, and block automatic retrigger after an ineffective attempt until accounting is reconciled.

## Existing approaches
Auto-compaction thresholds; summarization; transcript rotation; context meters; watchdogs; manual session reset.

## Remaining limitations
Frameworks may log compaction completion without a meaningful `tokensAfter`; cumulative usage can be confused with stored prompt size; large bootstrap/injected context reduces reclaimable headroom; summary/rotation events can contaminate token monitors; manual reset can destroy useful state.

## Root-cause analysis
- Success is defined by completion of the compaction procedure rather than measurable reclaim.
- Token state has multiple meanings (stored context, current request, cumulative usage, cached/injected context).
- Event handlers can reapply stale counters.
- Control loops lack a circuit breaker for ineffective maintenance.
- Large static/bootstrap context makes nominal percentage thresholds misleading.

## Improvement opportunity
Add a deterministic, provider-agnostic effectiveness gate around compaction so frameworks can detect no-op maintenance and enter bounded recovery before spending more tokens or losing history.

## Relevant sources
- https://github.com/openclaw/openclaw/issues/101052
- https://github.com/code-yeongyu/oh-my-openagent/issues/3819
- https://github.com/openclaw/openclaw/issues/118772
