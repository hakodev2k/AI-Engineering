# Research Evidence

## Topic
Terminal Objective Convergence Watchdog

## Category
Thinking

## Problem
Long-running coding agents can preserve activity while losing convergence: they reopen settled decisions, expand scope, repeat low-information probes, emit progress narration not backed by tool state, or continue after blockers without materially reducing uncertainty. The visible behavior looks busy but the terminal objective remains unchanged.

## Why it matters now
Fresh 2026 reports show persistent no-progress loops consuming hours or large usage budgets. A 2026-08-19 Codex issue reports a >5-hour run on a sub-one-hour baseline with zero original bugs fixed; other recent issues describe unbounded goal continuation, repeated planning, scope expansion, and post-compaction resume loops.

## Affected users
Developers running autonomous coding agents, persistent goals, multi-agent workflows, release/deployment agents, and platform teams that need long-running tasks to stop or converge predictably.

## Current public evidence
### Observed evidence
1. openai/codex #39512 reports more than five hours elapsed, greater than 5x a comparison baseline, excessive token/context use, repeated reopening of settled decisions, misleading progress language, non-convergent validation, and zero original bugs fixed.
2. openai/codex #34248 reports goal auto-continuation entering an unbounded no-progress loop with thousands of duplicate turns after a durable external wait condition.
3. openai/codex #35892 reports a finite task expanding into additional tasks, subagent lanes, review cycles, and verification gates over roughly three days instead of converging.
4. openai/codex #34657 reports a persistent goal running more than a day while repeatedly planning instead of delivering; the report explicitly asks for deliverable-evidence-based progress detection.
5. openai/codex #34322 reports repeated auto-compaction/resume cycles with near-identical status messages and repeated file reads rather than preserved progress.

### Interpretation
Turn count, narration, tool-call count, or even passing intermediate checks are poor proxies for progress. A reliable control loop needs a persistent terminal objective, explicit completion phases, a ledger of settled decisions, named uncertainties, and evidence-gain checks that determine whether the last action changed the task state.

## Existing approaches
- Prompt instructions such as “continue until done.”
- Generic retry or goal auto-continuation loops.
- Plans/checklists maintained by the model.
- Context compaction summaries.
- Human interruption when the agent appears stuck.

## Remaining limitations
- Natural-language plans can drift or be regenerated after compaction.
- Continuation policies may interpret any output as progress.
- Repeated validations can consume resources without changing a named blocker.
- Progress messages are often not mechanically tied to repository/build/deployment state.
- Time/token budgets alone cannot distinguish productive long work from unproductive loops.

## Root-cause analysis
1. Terminal objective and granted authority are not persisted as a machine-readable invariant.
2. Settled decisions lack versioned finality, so the agent reopens them without new contradictory evidence.
3. Tool calls do not declare which uncertainty or completion criterion they are expected to resolve.
4. Progress detection measures activity rather than state transition/evidence gain.
5. Stop/replan thresholds are not based on repeated low-gain cycles.
6. Status language is not constrained by verified phase state.

## Improvement opportunity
Introduce a convergence watchdog around the agent loop. It maintains a compact objective ledger, phase state, decision-finality records, named blockers/uncertainties, and evidence hashes. Before each expensive action the agent declares the targeted uncertainty; after the action the watchdog scores whether evidence or terminal state changed. Repeated low-gain cycles trigger bounded strategy correction, then checkpoint/stop rather than indefinite continuation. Progress claims are permitted only when a deterministic phase transition has evidence.

## Relevant sources
- https://github.com/openai/codex/issues/39512
- https://github.com/openai/codex/issues/34248
- https://github.com/openai/codex/issues/35892
- https://github.com/openai/codex/issues/34657
- https://github.com/openai/codex/issues/34322
- https://github.com/openai/codex/issues/17480
