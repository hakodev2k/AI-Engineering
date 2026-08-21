# Research Evidence

## Topic
Subagent Wait Coalescing Controller

## Category
Performance

## Problem
Multi-agent orchestrators can spend large numbers of model turns polling subagents or background work with short wait/status calls. When each no-change poll reprocesses a large cached context, mostly idle orchestration becomes expensive, slow, and self-sustaining; stale child state can keep the polling loop alive indefinitely.

## Why it matters now
Long-running agent workflows increasingly combine verifier subagents, background tests, and multi-agent fan-out. Current Codex issue reports show wait/status traffic dominating model-visible calls and consuming extreme token budgets while little or no useful work occurs.

## Affected users
Developers using multi-agent coding tools, agent-platform builders, CI agents, long-running research/coding workflows, and teams paying per-token/per-turn costs.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #37299 reports that 75% of model-visible tool calls in measured long-running sessions were `wait`, `wait_agent`, or `list_agents`; 83% of `wait_agent` calls timed out. Each small result re-metered roughly 137–141k input tokens, mostly cached. The report also found stale completed agents remaining `running`, perpetuating polling.
2. Codex issue #33999 reports repeated routing to `wait(noop)` despite no active exec cell, with repeated tool errors and stalled subagent state. The loop continued instead of recovering to productive execution.

### Interpretation
The root problem is orchestration semantics, not model intelligence: no-change waits are modeled as full reasoning turns, polling intervals are much shorter than underlying task durations, and liveness/state inconsistencies provide no deterministic stop condition.

## Existing approaches
- Short timeout polling with `wait`/`wait_agent`.
- `list_agents` roster checks.
- Manual interruption/restart when a child stalls.
- Context caching to reduce compute cost of repeated prefixes.

## Remaining limitations
- Cached tokens can still count toward usage/latency even when orchestration state did not change.
- No-change results can trigger unnecessary model turns.
- Stale `running` states can keep parents polling forever.
- Full child final messages in status payloads increase repeated context.
- Invalid wait targets may be retried instead of invalidated.

## Root-cause analysis
1. Polling cadence is decoupled from expected task duration.
2. A timeout/no-change event is treated as reasoning-worthy input.
3. Parent lacks a coalesced event/change detector for child state.
4. Stale liveness has no lease/expiry reconciliation.
5. Wait-target validity is not checked before another model turn.
6. Retry loops lack a budget tied to useful state changes.

## Improvement opportunity
Add a reusable wait controller that establishes a baseline, coalesces no-change polling outside the model loop, uses adaptive backoff and child liveness leases, emits model-visible events only on material state change or bounded checkpoint deadlines, invalidates impossible wait targets, and verifies improvement with before/after turn/token/latency metrics.

## Relevant sources
- https://github.com/openai/codex/issues/37299
- https://github.com/openai/codex/issues/33999
