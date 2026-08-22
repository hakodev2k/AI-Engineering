# Research — Subagent Orchestration Loop Budget Guard

## Topic
Subagent orchestration loops that repeatedly poll, wait, or route status intents to the wrong tool, causing token/latency amplification without progress.

## Category
Performance

## Problem
Multi-agent coordinators can misroute subagent-status intents, retain stale child status, or poll too frequently. Each poll can trigger another model turn and reprocess a large accumulated context even though no new work is produced.

## Why it matters now
Several August 2026 Codex issues independently report the same operational failure family: wrong wait-tool selection after `spawn_agent`, stale `running` state for completed children, repeated waiting when all agents are stopped, and large cached-context re-metering every 10–30 seconds.

## Affected users
Coding-agent users, agent-platform teams, multi-agent orchestration authors, long-running task operators, and teams with token/latency budgets.

## Observed evidence
1. Issue #38132 (2026-08-12): agent-status intents were routed to placeholder shell output instead of collaboration tools, creating a tool-selection loop. https://github.com/openai/codex/issues/38132
2. Issue #37113 (2026-08-05): after `collaboration.spawn_agent`, GPT-5.6 sometimes routed the next wait to unrelated `functions.wait` rather than `collaboration.wait_agent`. https://github.com/openai/codex/issues/37113
3. Issue #37299 (2026-08-06): repeated wait/status orchestration every 10–30 seconds re-metered ~140k-token cached context, with reported extreme weekly-usage consumption while effectively idle. https://github.com/openai/codex/issues/37299
4. Issue #37301 (2026-08-06): sessions repeatedly waited for agents although all subagents were stopped. https://github.com/openai/codex/issues/37301
5. Issue #37916 (2026-08-11): a stale cached `watched_status` could override completed child state during thread enrichment. https://github.com/openai/codex/issues/37916
6. Issue #38142 (2026-08-12): interrupted children could miss a terminal `SubagentStop` hook, leaving lifecycle observers to retain them as running. https://github.com/openai/codex/issues/38142

## Interpretation
These reports do not prove one universal root cause. Together they show that coordinator progress can depend on unreliable status routing and lifecycle state, and that naive polling can multiply token cost and latency when the underlying state is stale or the wrong tool is selected.

## Existing approaches
- Fixed-interval polling/wait calls.
- Rely on model selection of wait/status tools.
- UI/runtime status caches.
- Retry when a wait call fails.
- Keep full parent context active while coordinating children.

## Remaining limitations
Fixed polling ignores expected child duration and progress events. Model-selected tool routing can choose semantically adjacent but incorrect wait tools. Cached state may disagree with terminal events. Retry loops often lack a progress budget. Full parent-context replay makes each no-op poll disproportionately expensive.

## Root-cause analysis
- Status intent is not deterministically bound to the correct orchestration API.
- Lifecycle truth can be split across events, caches, UI state, and runtime state.
- No-op polls are not distinguished from progress-producing actions.
- Poll interval and retry count are not budgeted by context cost.
- Missing terminal events can make stale `running` states persistent.
- Coordinators may lack a reconciliation path that asks the authoritative runtime once before continuing to poll.

## Improvement opportunity
Introduce a deterministic orchestration watchdog that records child lifecycle evidence, validates intended tool family, reconciles stale status before polling again, applies exponential/bounded wait intervals, tracks no-progress cycles and estimated token cost, and stops/escalates after a strict budget.

## Goal
Reduce idle orchestration turns, prevent wrong-tool wait loops, and bound token/latency overhead while preserving correct child-result collection.

## Metrics
- No-progress orchestration turns per task.
- Wait/status model turns per child completion.
- Estimated tokens spent on orchestration-only turns.
- Mean/p95 time from child terminal event to parent recognition.
- Wrong wait-tool selections detected.
- Stale-running reconciliations.
- Completion/result-loss regression rate.

## Trigger
After subagent spawn, repeated wait/status calls, stale child status, missing terminal lifecycle event, or orchestration token/latency anomaly.

## Inputs
Lifecycle events, child status snapshots, intended orchestration operation, selected tool, poll timestamps, context token estimate, budget policy.

## Outputs
Continue/wait/reconcile/stop decision, next wait interval, budget counters, findings, and audit evidence.

## Proposed solution
A reusable progress-aware watchdog and bounded wait workflow. The watchdog is deterministic; it does not replace the runtime's authoritative child state and does not infer completion solely from model prose.
