# Research — Agent Tool-Result Correlation Integrity Guard

**Research date:** 2026-08-20 (UTC+7)  
**Category:** Thinking

## Problem

Agent runtimes rely on a strict causal contract: every tool result must belong to exactly one tool invocation, and the model must continue only after that result is correctly correlated. When tool-call IDs are duplicated, replayed, dropped, orphaned, or reused across retries, the agent can reason from the wrong observation, repeat already-completed work, or enter an unbounded loop.

## Why it matters now

Recent reports across multiple coding-agent runtimes show correlation failures are not theoretical edge cases. They appear around retry/fallback paths, streaming continuations, parallel agents, and client upgrades. These failures can silently corrupt execution state even when the underlying tool itself succeeded.

## Current public signals

### Signal 1 — Claude Code orphaned tool results regression

Anthropic Claude Code issue #84272, opened 2026-08-05, reports a regression where orphaned `tool_use` events increased roughly 16x after an upgrade, with silently dropped tool results and a shift from Bash-heavy to Edit-heavy orphaning.

Source: https://github.com/anthropics/claude-code/issues/84272

### Signal 2 — Codex repeated tool-result replay

OpenAI Codex issue #27757 reports that a provider stream containing a repeated tool-call ID can cause Codex to record and resubmit the same tool result across retry requests instead of treating the state as stale or duplicate.

Source: https://github.com/openai/codex/issues/27757

### Signal 3 — fallback retries can duplicate already-executed agents

Claude Code issue #85402, opened 2026-08-09, reports that a `model_refusal_fallback` can retract a turn while already-spawned background agents continue running. The fallback model then has no visibility into those executions and dispatches duplicates.

Source: https://github.com/anthropics/claude-code/issues/85402

### Signal 4 — repeated identical tool calls remain an active failure mode

Claude Code issue #59318 reports repeated identical Bash calls 30–50+ times during exploratory tasks, with manual interruption required. Codex issue #27759 similarly requests bounded repeated identical tool-call handling.

Sources:
- https://github.com/anthropics/claude-code/issues/59318
- https://github.com/openai/codex/issues/27759

## Existing approaches

1. **Trust provider/tool IDs.** Simple, but assumes IDs are globally unique and stable across retries and stream reconstruction.
2. **Append tool results to conversation history.** Works if event ordering and identity are correct, but does not detect replay or orphaning.
3. **Retry whole turns.** Useful for transient failures, but can re-execute side effects or spawn duplicates if earlier actions already happened.
4. **Repeated-call circuit breakers.** Limit obvious loops, but do not prove that a particular result belongs to the intended call.
5. **Idempotency on side effects.** Important but orthogonal; a read-only tool can still produce a wrong reasoning state if correlation is incorrect.

## Observed limitations

- Tool-call IDs may be reused or replayed across retry boundaries.
- A result can arrive after the parent turn has been retracted or replaced.
- Parallel agents can produce multiple concurrent tool-call namespaces.
- Stream reconstruction may drop a result while preserving the originating call.
- Prompt-only instructions cannot validate event identity deterministically.
- Loop breakers detect repetition after damage or wasted calls have already occurred.

## Root-cause hypotheses

1. **Correlation identity is provider-scoped but treated as session-global.**
2. **Retry generations are not assigned explicit generation IDs.**
3. **Execution and transcript state are updated in different transactions.**
4. **No exactly-once acceptance gate exists between tool execution and model continuation.**
5. **Late results are accepted without checking the active parent turn/generation.**

## Improvement target

Introduce a host-side correlation ledger with these invariants:

- every invocation gets a composite identity: `(session, generation, agent, tool_call_id)`;
- an invocation transitions through `issued -> executing -> resolved|failed|cancelled`;
- a result is accepted at most once;
- duplicate identical results are ignored and audited;
- conflicting duplicate results fail closed;
- results from stale generations are quarantined;
- unresolved calls block model continuation unless policy explicitly allows partial continuation;
- side-effectful replay requires an idempotency proof or human approval;
- correlation violations emit deterministic reason codes.

## Success metrics

- orphaned-result acceptance rate: 0;
- conflicting duplicate-result acceptance rate: 0;
- stale-generation result acceptance rate: 0;
- exactly-once resolution rate: 100% in deterministic tests;
- repeated-call incidents caused by correlation loss: reduced from baseline;
- manual recovery/rework from lost tool state: reduced from baseline.

## Observed evidence vs interpretation vs proposal

### Observed evidence

Recent public issues document dropped tool results, replayed tool IDs, fallback-created duplicate executions, and repeated identical tool loops.

### Interpretation

A common systems-level weakness is missing causal integrity between an invocation and its accepted result, especially across retries, streaming, and multi-agent execution.

### Proposed engineering solution

This package implements a deterministic correlation ledger and reconciliation gate. It does not depend on hidden chain-of-thought and does not assume the model can reliably repair corrupted tool state by itself.