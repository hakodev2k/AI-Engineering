# Research — Agent Control Context Repetition Drift Guard

## Topic
Agent Control Context Repetition Drift Guard

## Category
Thinking

## Problem
Long-running agents can repeatedly receive or echo the same high-priority control context after tool continuations. The repeated acknowledgement itself becomes new history, amplifies the same pattern, consumes attention, and can eventually displace the active user goal or convert a temporary subtask into the apparent top-level objective.

## Why it matters now
Recent Codex and Claude Code reports show that repeated injected control/reminder blocks are not only a token-efficiency concern: they can alter task framing, cause zero-implementation meta-work, drop user intent, and trigger repetitive continuation behavior.

## Affected users
Developers running long tool-heavy coding sessions, agent-host developers, IDE/CLI vendors, multi-agent workflow builders, and teams using layered repository instructions or injected reminders.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #38333, opened 2026-08-13, reports a static current-date developer instruction being explicitly acknowledged after repeated tool continuations. The acknowledgement became self-reinforcing and was followed by task-state corruption: a temporary review subtask replaced the requested implementation objective in the final response. Source: https://github.com/openai/codex/issues/38333
2. OpenAI Codex issue #36555, opened 2026-08-02, reports layered instructions locking the agent into repeated planning/review meta-workflows with zero implementation despite an already-approved implementation plan. Source: https://github.com/openai/codex/issues/36555
3. Anthropic Claude Code issue #56829 documents multiple injected `<system-reminder>` blocks causing the model to lose or ignore the actual user message in some continuation paths, including subagent configuration failures. Source: https://github.com/anthropics/claude-code/issues/56829
4. Claude Code issue #32057 reports matching rules repeatedly re-injected on tool results, consuming substantial context in a tool-heavy session. Although primarily a context/token report, it independently demonstrates repeated control-context injection as a real host behavior. Source: https://github.com/anthropics/claude-code/issues/32057

## Existing approaches
- Put persistent requirements in system/developer/repository instructions.
- Re-inject reminders after tool calls so constraints remain visible.
- Use plans/checklists to preserve the current objective.
- Ask the model to avoid repeating reminders.
- Compact or summarize long sessions.

## Remaining limitations
A reminder can be correctly visible yet operationally harmful when it is re-emitted verbatim on every continuation. Telling the model not to repeat it still creates another acknowledgement that can join the repetition pattern. Plans can also become competing meta-work if the runtime lacks a deterministic distinction between the immutable top-level goal, active subtask, and passive control context. Compaction may preserve the repeated residue rather than remove it.

## Root-cause analysis
- Hosts may inject identical high-priority context after every tool result without a deduplication or semantic-change gate.
- Model-generated acknowledgements of control context are appended to history and can become repetition attractors.
- Long-running sessions often lack an explicit active-goal contract checked after continuation boundaries.
- Temporary reviewer/subagent roles can be promoted implicitly when continuation state is reconstructed.
- No-progress detection commonly measures tool repetition but not control-text echo or role/objective drift.

## Improvement opportunity
Introduce a continuation-time control-context ledger. Stable control items are stored once by ID/hash, re-injected only when changed or when a deterministic trigger requires them, and prohibited from generating acknowledgement-only turns. Every continuation validates three observable fields: `top_level_goal_id`, `active_subtask_id`, and `control_context_hashes`. A trace analyzer detects repeated control-context echoes and goal-role drift; when thresholds are exceeded, the workflow restores the active goal from the ledger and requires evidence-producing work before another continuation.

## Interpretation
The evidence does not imply that persistent instructions are inherently harmful. The failure emerges when unchanged control text or acknowledgements are repeatedly placed into the conversational trajectory without a change-sensitive injection policy and without explicit goal-state validation.

## Proposed solution
A reusable trace-based guard that detects unchanged control-context repetition, acknowledgement-only loops, and top-level-goal drift at continuation boundaries. It uses observable text/state metadata and never requests hidden reasoning.

## Goal
Preserve the user's active deliverable across long tool continuations while preventing repeated control context from becoming a self-reinforcing trajectory.

## Metrics
- Duplicate control-context injection count per 20 continuations.
- Acknowledgement-only continuation rate.
- Goal-ID continuity across tool/subagent boundaries.
- Number of role-drift detections.
- Productive-action ratio after continuation.
- Rework events caused by lost requirements.

## Trigger
After tool completion, subagent handoff, compaction/resume, injected reminder updates, or when repeated meta-commentary appears without deliverable progress.

## Inputs
Trace records containing continuation ID, top-level goal ID, active subtask ID, injected control hashes, assistant-visible summary text, and whether an evidence-producing action occurred.

## Outputs
`healthy`, `deduplicate`, `restore_goal`, or `stop`; repeated hashes/phrases; drift evidence; and recovery checkpoint.

## Relevant sources
- https://github.com/openai/codex/issues/38333
- https://github.com/openai/codex/issues/36555
- https://github.com/anthropics/claude-code/issues/56829
- https://github.com/anthropics/claude-code/issues/32057
