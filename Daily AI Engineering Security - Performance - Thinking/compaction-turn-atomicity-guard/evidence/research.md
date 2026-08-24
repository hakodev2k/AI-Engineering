# Research — Compaction Turn Atomicity Guard

## Topic
Prevent context compaction from tearing down turns with unresolved tool effects.

## Category
Thinking

## Problem
Long-running agents compact context to stay within model limits. If compaction rewrites or replaces history while tool calls are in flight or their side effects are not yet durably correlated, the agent can lose evidence of what happened and continue from an impossible state. This is a reasoning/recovery integrity failure: subsequent decisions are made from incomplete execution facts.

## Why it matters now
Recent 2026 agent runtimes compact automatically during long tool-heavy sessions. Public reports show compaction firing mid-turn can discard outstanding tool state, while active implementations are explicitly moving compaction to idle/turn boundaries to avoid conversation and state corruption.

## Affected users
Agent-runtime builders, coding-agent users, workflow/automation owners, and teams using state-changing tools such as file writes, job creation, deployment, DB mutation, or external APIs.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #90985, opened 2026-08-20, reports context compaction tearing down a turn while tool calls are in-flight. A live incident involved a cronjob creation that was issued but never durably present; the report identifies lack of a distinction between issued and confirmed/committed effects. https://github.com/NousResearch/hermes-agent/issues/90985
2. Senpi's compaction change log states on 2026-08-19 that blocking/generated compaction now refuses to run while the session is not idle because mid-run compaction poisons conversation state, and describes fencing retries on `ctx.isIdle()` and cancellation/revision checks. https://github.com/code-yeongyu/senpi/blob/main/packages/coding-agent/src/core/extensions/builtin/compaction/changes.md
3. Hermes issue #80622, opened 2026-08-06, reports a reference-only compaction handoff becoming the active turn and resuming completed stale work, demonstrating that compaction artifacts can change turn semantics if not isolated from the active state machine. https://github.com/NousResearch/hermes-agent/issues/80622

### Interpretation
Compaction must be treated as a state transition with preconditions, not a background text transform. The runtime needs an explicit turn ledger: every tool invocation is `planned`, `issued`, `confirmed` or `failed`; compaction is blocked until no unresolved invocation remains and the active turn has a durable terminal/checkpoint state. After compaction, the runtime must verify that the active goal and tool-effect ledger are preserved without promoting a summary into a new user command.

## Existing approaches
- Threshold-triggered compaction independent of tool lifecycle.
- Idle-only compaction in some runtimes.
- Context summaries that mention recent tool work.
- Checkpointing/history replacement.
- Retry of failed or aborted compaction.

## Remaining limitations
- “Idle” can be ambiguous unless defined from tool/executor state and durable persistence.
- A summary is not authoritative evidence that an external side effect committed.
- History rewrite can alter role/order semantics and accidentally reactivate stale work.
- Retrying a side-effecting tool after uncertain completion can duplicate effects.
- Many agents lack an auditable unresolved-tool ledger before compaction.

## Root-cause analysis
1. Context management and execution state are modeled separately.
2. Tool calls often lack durable lifecycle states and idempotency/correlation keys.
3. Compaction triggers on token pressure rather than a safe transaction boundary.
4. Summary text is allowed to substitute for structured execution facts.
5. Recovery logic cannot distinguish “not attempted,” “issued but unknown,” and “confirmed.”

## Improvement opportunity
Add a deterministic pre-compaction gate over a structured turn-state snapshot. Block compaction when any tool is unresolved, when the turn is nonterminal, or when the snapshot lacks durable correlation evidence. After compaction, revalidate the active goal/turn identity and ledger hashes. Unknown side effects require reconciliation, not blind retry.

## Goal
Ensure every compaction occurs at a safe turn boundary and cannot erase or invent execution facts.

## Metrics
- compaction_blocked_unresolved_tool_count
- unresolved_tool_count_at_compaction (target 0)
- lost_effect_incidents
- duplicate_effect_incidents
- stale_turn_resumption incidents
- reconciliation_success_rate
- compaction_retry_count

## Trigger
Automatic or manual compaction, checkpoint pruning, or history replacement.

## Inputs
Structured turn snapshot containing turn id, terminal state, active goal id, and tool invocation states.

## Outputs
Gate decision, blocking reasons, unresolved invocation identifiers, and verification record.

## Proposed solution
This package provides a deterministic state checker, tests, an atomicity policy, a compaction-boundary analysis skill, an independent verifier, and a bounded safe-compaction workflow.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/90985
- https://github.com/code-yeongyu/senpi/blob/main/packages/coding-agent/src/core/extensions/builtin/compaction/changes.md
- https://github.com/NousResearch/hermes-agent/issues/80622
