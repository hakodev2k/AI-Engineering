# Research — Provider Fallback Recovery Governor

## Topic
Provider Fallback Recovery Governor

## Category
Performance

## Problem
Long-running agent turns can fail over from a primary model/provider after a transient 429 or transport failure and then remain pinned to the fallback for the rest of the turn, even after the primary has recovered. Other surfaces can fail to activate fallback at all. The result is excess cost, latency, provenance drift, avoidable task failure, and inconsistent behavior across runtimes.

## Why it matters now
Recent July–August 2026 Hermes Agent issues show fallback behavior diverging across long turns, desktop state, one-shot execution, ACP adapters, and error classification. Long-running batch/agentic workloads expose these gaps more strongly than short interactive turns.

## Affected users
Agent platform teams, scheduled-job operators, coding-agent users, multi-provider deployments, cost-sensitive teams, and systems that depend on model/provider provenance.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #88595, opened 2026-08-17, reports a transient 429 causing a 23-minute single turn to remain on fallback for 42 subsequent API calls even though a 60-second primary cooldown had expired. https://github.com/NousResearch/hermes-agent/issues/88595
2. Issue #75320 reports fallback state being persisted into desktop composer state, causing future sessions to inherit a temporary fallback as if it were the primary. https://github.com/NousResearch/hermes-agent/issues/75320
3. Issue #81209 reports one-shot CLI resolution failing before the runtime fallback chain can be consulted. https://github.com/NousResearch/hermes-agent/issues/81209
4. Issue #87931 reports an ACP construction path that silently omits the configured fallback chain. https://github.com/NousResearch/hermes-agent/issues/87931
5. Issue #77305 reports failed API calls consuming subagent iteration budget and starving later fallback recovery attempts. https://github.com/NousResearch/hermes-agent/issues/77305

## Existing approaches
- Retry the active provider with exponential/backoff delays.
- Switch to a configured fallback provider after retry exhaustion.
- Apply a primary cooldown after rate limiting.
- Restore primary provider at turn/session boundaries.
- Persist selected model/provider state for resumed sessions.

## Remaining limitations
Restoration checks may run only at turn boundaries, while long agentic turns can contain dozens of calls. Runtime fallback may be wired inconsistently across adapters. Error classification can distinguish transient overload, hard quota, billing, and auth incorrectly. Fallback state may leak into durable user-selected configuration. Failed calls may consume the same iteration budget as productive work.

## Root-cause analysis
- Provider routing state is treated as session state instead of a continuously evaluated runtime state machine.
- Cooldown expiry lacks an in-loop re-evaluation checkpoint.
- Temporary runtime route and persistent user preference are not cleanly separated.
- Adapter construction paths duplicate fallback wiring.
- Error classification, retry budget, iteration budget, and fallback budget are coupled implicitly.
- Provenance telemetry often records configured model rather than actual model per call.

## Improvement opportunity
Use a provider-routing governor with explicit states (`primary`, `cooldown`, `fallback`, `probe`, `degraded`, `exhausted`), monotonic cooldowns, in-loop re-evaluation, per-call provenance, separate retry/fallback budgets, and strict separation between temporary runtime route and persistent user selection.

## Goal
Recover to the intended primary when appropriate without thrashing, while guaranteeing that every execution surface either honors the same fallback contract or fails visibly.

## Metrics
- Time pinned to fallback after primary becomes eligible again.
- Calls on fallback after cooldown expiry.
- Primary recovery success rate.
- Provider switches per 100 calls (thrash indicator).
- Cost/task and latency/task before/after.
- Fallback-chain coverage across adapters.
- Actual-vs-configured provider provenance mismatch rate.

## Trigger
Every provider failure, fallback activation, cooldown expiry, long-running turn checkpoint, adapter/session creation, or resume.

## Inputs
Primary/fallback routes, error classification, retry state, cooldown timestamps, last-success timestamps, iteration budget, provider health observations, persistent user selection, actual per-call route.

## Outputs
Routing decision, reason, next eligibility time, probe decision, actual provider/model telemetry, and bounded recovery state.

## Interpretation
The evidence does not imply fallback itself is harmful. It shows that fallback requires explicit lifecycle and provenance engineering; a one-time switch is insufficient for long-running agent workflows.

## Proposed solution
A deterministic routing-state validator and bounded recovery workflow that periodically re-evaluates primary eligibility, prevents temporary fallback from overwriting durable selection, and verifies adapter parity.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/88595
- https://github.com/NousResearch/hermes-agent/issues/75320
- https://github.com/NousResearch/hermes-agent/issues/81209
- https://github.com/NousResearch/hermes-agent/issues/87931
- https://github.com/NousResearch/hermes-agent/issues/77305
