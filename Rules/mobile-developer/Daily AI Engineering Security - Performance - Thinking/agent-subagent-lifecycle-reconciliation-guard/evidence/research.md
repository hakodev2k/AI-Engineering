# Research — Agent Subagent Lifecycle Reconciliation Guard

## Problem
Long-running AI coding-agent sessions increasingly use visible child/subagents. Public Codex reports in August 2026 show completed or terminal children being rehydrated or displayed as `running`/`working`, stale watched status overriding terminal evidence, and coordinators repeatedly checking/waiting on children that are already done. When orchestration trusts stale presentation state instead of authoritative terminal evidence, the parent can waste model turns, stall completion, or make incorrect planning decisions.

## Category
**Thinking** — engineering decision quality and long-running reliability through explicit state reconciliation, evidence precedence, bounded waits, and verifiable orchestration state.

## Why it matters now
Multi-agent workflows are becoming normal in coding agents, and lifecycle state is now part of the model's decision context. A wrong child status is not merely UI polish when the coordinator decides whether to wait, retry, spawn replacement work, consume results, or finish the parent task.

## Current public signals

1. **Codex issue #37916 — stale watched status overrides completed state** (opened 2026-08-11). The report identifies a deterministic precedence problem in thread enrichment: cached watched status can overwrite a child's completed state. Source: https://github.com/openai/codex/issues/37916
2. **Codex issue #38478 — completed subagents remain shown as running/processing** (opened 2026-08-14). Results are already available but the Desktop summary can keep children active for hours. Source: https://github.com/openai/codex/issues/38478
3. **Codex issue #37729 — completed children appear active until results are opened** (opened 2026-08-09). Runtime status says children are completed while UI keeps them active. Source: https://github.com/openai/codex/issues/37729
4. **Codex issue #37563 — terminal subagents rehydrate as Working after restart** (opened 2026-08-08). Persisted terminal events and closed spawn edges exist, but Desktop reconstructs historical children as active. Source: https://github.com/openai/codex/issues/37563
5. **Codex issue #37299 — stale running subagents drive repeated wait/status turns and large token usage** (opened 2026-08-06). The report describes frequent wait/status turns against stale child state, re-metering a large cached context. Source: https://github.com/openai/codex/issues/37299
6. **Codex issue #38132 — status intent routed into a tool-selection loop** (opened 2026-08-12). Coordinator attempts to query/wait for subagent state but enters repeated placeholder shell behavior instead of authoritative collaboration tools. Source: https://github.com/openai/codex/issues/38132

## Observed evidence
- Terminal child evidence can exist while a UI/cached state still says active.
- Reopening a child can force status reconciliation in some reports, implying lazy or incomplete reconciliation.
- Stale active state can survive restart/rehydration.
- Repeated status/wait turns can become expensive when each continuation reuses a large context.

## Interpretation
The failure is a state-machine integrity problem. Orchestration needs an explicit evidence hierarchy and reconciliation barrier. A coordinator should not treat a single cache/UI field as truth when stronger evidence exists: terminal event, task-complete event, authoritative registry status, closed spawn edge, delivered result, or backend `not_found` for a formerly terminal child.

## Existing approaches
### UI status indicators
Useful for humans but can be stale and should be treated as presentation state.

### Polling list/wait tools
Can recover truth when they query an authoritative registry, but naive short polling creates cost/latency loops and can itself fail if tool selection drifts.

### Opening individual child threads
Reported as a workaround that forces refresh, but it is manual, O(n), slow, and unsuitable for automation.

### Session restart
Reports show restart may rehydrate stale active state rather than repair it.

## Gap
Current workflows often lack:
- a documented state precedence contract;
- deterministic reconciliation between persisted events, registry state, and UI/cache state;
- invariants preventing terminal → running resurrection without a new execution identity;
- bounded wait policies;
- evidence-based completion checks independent of presentation state;
- metrics for stale-state age, reconciliation mismatches, and wasted status turns.

## Root-cause hypotheses
1. Cached/presentation fields have incorrect precedence over terminal evidence.
2. Rehydration reconstructs state from incomplete event subsets.
3. Child result delivery and lifecycle transition are not atomically correlated.
4. Polling cadence is shorter than task duration and lacks exponential/backoff/event-driven behavior.
5. Parent agents can reason from stale status text instead of a normalized lifecycle snapshot.

## Improvement target
Implement a reusable **lifecycle reconciliation barrier** before parent decisions that depend on child state. Normalize all available evidence into one snapshot, apply precedence rules, detect contradictions, block terminal-state resurrection, and expose bounded decisions: `continue`, `wait`, `consume-result`, `retry-status`, or `escalate`.

## Success metrics
- 0 terminal→active resurrection accepted without a new execution/attempt ID.
- 100% of orchestration decisions record authoritative evidence used.
- Reconciliation mismatch rate measured per run.
- Stale-active age measured and bounded by policy.
- Status/wait model turns reduced versus baseline where applicable.
- No parent completion while required child results remain genuinely unresolved.
- No indefinite polling; every wait loop has a fixed maximum attempts/time budget.

## Proposed package
The package provides a deterministic Python reconciler, lifecycle policy, structured skills/rules, specialized agents, workflows, hooks, fixtures/tests, integration guide, and README. It does not depend on hidden chain-of-thought; it uses observable facts, explicit precedence, decisions, and verification.

## Sources
- https://github.com/openai/codex/issues/37916
- https://github.com/openai/codex/issues/38478
- https://github.com/openai/codex/issues/37729
- https://github.com/openai/codex/issues/37563
- https://github.com/openai/codex/issues/37299
- https://github.com/openai/codex/issues/38132
