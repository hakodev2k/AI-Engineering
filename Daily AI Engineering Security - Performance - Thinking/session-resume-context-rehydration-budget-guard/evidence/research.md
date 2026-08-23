# Research — Session Resume Context Rehydration Budget Guard

## Topic
Session Resume Context Rehydration Budget Guard

## Category
Token

## Problem
Long AI coding sessions can become unexpectedly expensive to resume. A resumed or cap-interrupted session may resend large static instruction/context payloads and then spend additional tool calls rediscovering state that was already known before interruption. This increases input tokens, cache writes/reads, latency, and quota consumption without improving task quality.

## Why it matters now
Current 2026 public reports describe substantial rehydration cost after session interruption/resume, including repeated startup context, cache recreation, and state rediscovery.

## Affected users
AI coding-agent users, teams running persistent agent sessions, orchestration platforms, subscription users with usage caps, and providers operating long-context workflows.

## Current public evidence
### Observed evidence
1. Claude Code issue #84457 (2026-08-06) reports that after a usage-limit interruption the next session resends startup context and re-derives project state with tool calls; the reporter measured roughly 70 KB / 18k tokens of instruction corpus per session and repeated rediscovery work: https://github.com/anthropics/claude-code/issues/84457
2. Claude Code issue #68830 reports that opening a parked long session can immediately resend large conversation history and incur a fresh cache write after TTL expiry, with reported resume costs of several dollars for 200–500k-token sessions: https://github.com/anthropics/claude-code/issues/68830
3. Claude Code issue #24147 reports repeated full instruction-set context as cached input and quota pressure scaling with instruction size and message count: https://github.com/anthropics/claude-code/issues/24147
4. Claude Code issue #46829 documents cache TTL behavior causing repeated cache recreation and materially higher cost when cached context expires: https://github.com/anthropics/claude-code/issues/46829

### Interpretation
Some cost is inherent because the model must receive enough state to continue correctly. The engineering opportunity is not to delete context blindly, but to distinguish required continuity state from reproducible or duplicate context, estimate rehydration cost before resume, and lazily reload state with verification.

## Existing approaches
- Provider prompt caching.
- Automatic session resume and full history replay.
- Handoff/state files and memory summaries.
- Context compaction.
- Manual new-session restarts.

## Remaining limitations
- Cache expiry can turn a cheap resume into a large cache creation.
- Summaries may drift or omit active constraints.
- Static instructions can be duplicated across startup layers.
- Tool-derived state is often re-discovered because provenance/freshness is not preserved.
- Users usually see cost after the resume, not before it.

## Root-cause analysis
1. No explicit resume token budget or preflight estimate.
2. Static instructions, history, memory, and handoff state are composed independently and may overlap.
3. Reusable facts lack freshness/provenance metadata, forcing conservative rediscovery.
4. Cache state/TTL is not incorporated into resume planning.
5. Recovery prioritizes continuity but lacks a quality-preserving minimal-context contract.

## Improvement opportunity
Create a resume preflight that inventories candidate context, deduplicates byte/semantic-equivalent static content, classifies required-vs-lazy state, estimates tokens, detects likely cache expiry, and emits a bounded rehydration plan. Preserve critical constraints and verify recovered state before work continues.

## Goal and metrics
- Reduce resume input tokens by >=25% on representative long-session fixtures without quality regression.
- 100% preservation of critical constraints/active goal fixtures.
- Reduce redundant rediscovery tool calls by >=30%.
- Every resume records estimated vs actual tokens and cache behavior when telemetry is available.

## Trigger / Inputs / Outputs
- Trigger: session resume, continuation after usage/tool cap, compaction boundary, or handoff to a new agent session.
- Inputs: static instructions, recent history, handoff state, memory, tool-derived facts with freshness, model context limit, cache telemetry.
- Outputs: minimal safe resume bundle, lazy-load manifest, token estimate/budget decision, preserved-constraint checklist, and verification report.
