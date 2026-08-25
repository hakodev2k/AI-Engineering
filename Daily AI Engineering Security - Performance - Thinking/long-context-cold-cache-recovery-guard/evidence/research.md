# Research

## Topic
Long-context cold-cache recovery for agent sessions

## Category
Token

## Problem
Long-lived AI coding sessions can cross a normal-context boundary while remaining usable because of prompt-cache reuse. If that cache goes cold, the next large uncached request can fail; reactive compaction can also fail because compaction must submit the same oversized history.

## Why it matters now
Long-context modes are increasingly used for multi-hour coding work. A failed recovery can waste hundreds of thousands of already-paid tokens, strand state, trigger retry storms, and force developers to reconstruct work manually.

## Affected users
AI coding-agent users, agent-runtime developers, enterprise platform teams, and teams using long-context models through first-party or proxied providers.

## Current public evidence

### Observed evidence
1. Anthropic Claude Code issue #79989, opened 2026-07-22, reports five sessions above the 200k standard-context boundary becoming unrecoverable after prompt cache loss; every request, including `/compact`, returned `ECONNRESET`. https://github.com/anthropics/claude-code/issues/79989
2. Claude Code issue #87561, opened 2026-08-18, reports conversation compaction hanging for hours while processing roughly 829.9k tokens, with a message-list desynchronization error in telemetry. https://github.com/anthropics/claude-code/issues/87561
3. Claude Code issue #86500, opened 2026-08-13, reports a 1,000,000-token window resolving to source `auto` on non-first-party providers, leaving an intended context cap unenforced in that configuration. https://github.com/anthropics/claude-code/issues/86500
4. Claude Code context-window documentation explains that `/compact` summarizes conversation history while re-injecting selected startup content. https://code.claude.com/docs/en/context-window

### Interpretation
The recurring engineering gap is not simply “context is too large.” Recovery decisions are made too late and often assume cache availability or a functioning compaction path. Cache state, context boundary, provider path, reserve, and transport failures need to be treated as one observable recovery condition.

## Existing approaches
Automatic/manual compaction, prompt caching, provider retries, manual `/clear`/new sessions, and static maximum-context configuration.

## Remaining limitations
Reactive compaction can require the same large request that is already failing. Generic retries amplify cost/latency when failure is size/cache-path dependent. Static limits do not express cache health or completion reserve. Clearing can destroy task state. Proxy-provider behavior can diverge from first-party assumptions.

## Root-cause analysis
1. Recovery is triggered by occupancy alone rather than occupancy plus cache/transport health.
2. Cache reuse is treated only as an optimization even when oversized sessions operationally depend on it.
3. No explicit reserve is protected for final tool results, verification, or state export.
4. Compaction is assumed to be an always-available rescue operation.
5. Retry layers do not distinguish transient failures from repeatable oversized uncached failures.

## Improvement opportunity
Add a provider-agnostic preflight that estimates whether the next request and recovery reserve remain safe, detects cold-cache plus transport-error conditions, and evacuates durable task state before the session becomes unable to compact.

## Proposed solution
A deterministic guard classifies telemetry into `allow`, `compact`, `export-and-fork`, or `block`; a bounded workflow preserves required task state before fresh-context recovery; regression tests validate the decision boundary.

## Goal
Reduce unrecoverable long-context sessions and avoid wasteful retries without removing context required for correctness.

## Metrics
Tokens/task, failed oversized requests/task, cache hit ratio, cache age, context utilization, recovery latency, retries/task, cost/task, quality regression rate, and percentage of recoveries with verified state preservation.

## Trigger
Before high-cost turns when context exceeds the warning ratio, after cache-miss spikes, after transport errors on long contexts, or before planned compaction.

## Inputs
Context/token telemetry, provider/model limits, cache telemetry, recent transport errors, recovery reserve, and state-export status.

## Outputs
Deterministic action, reasons, measured ratios, and evidence fields for audit.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/79989
- https://github.com/anthropics/claude-code/issues/87561
- https://github.com/anthropics/claude-code/issues/86500
- https://code.claude.com/docs/en/context-window
