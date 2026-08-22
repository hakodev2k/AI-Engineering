# Research — Agent Context-Compaction Continuity Contract

## Problem
Long-running AI engineering sessions increasingly depend on automatic context compaction. Compaction is useful for staying within model limits, but it can silently drop operational state that is still required for correct continuation: active client context, recoverable tool state, recent user intent, completed/failed steps, changed files, test results, and the next concrete action.

## Category
**Thinking** — this is a reasoning/execution reliability problem caused by degraded evidence and state across a model handoff boundary.

## Why it matters now
Recent public Codex issues in August 2026 show multiple independent manifestations of the same continuity failure. The common pattern is not simply “context is smaller”; it is that the post-compaction agent proceeds as though its new view is sufficient even when critical state was omitted.

## Current public signals

### Signal 1 — recoverable tool state can disappear after truncation + compaction
OpenAI Codex issue #37121, opened 2026-08-05, reports that when a large tool result is truncated and the thread later compacts, continuation can lose access to data that still exists elsewhere in the persisted rollout. This means the system can have recoverable evidence but fail to re-bind it after compaction.

Source: https://github.com/openai/codex/issues/37121

### Signal 2 — unchanged additionalContext can disappear after automatic compaction
OpenAI Codex issue #38269, opened 2026-08-12, reports that client-supplied `additionalContext` disappears after automatic compaction because retained values are not re-rendered into replacement model history. The issue describes connected browser-profile context vanishing even though the client had not removed it.

Source: https://github.com/openai/codex/issues/38269

### Signal 3 — users request a structured checkpoint with a lossless operational tail
OpenAI Codex issue #36721, opened 2026-08-03, proposes structured cost-aware checkpoints because long conversations can lose what succeeded, failed, why decisions were made, which files changed, what tests ran, and the next action after compaction.

Source: https://github.com/openai/codex/issues/36721

### Signal 4 — repeated reports of intent loss after compaction
Codex issue #18720 describes post-auto-compaction execution drifting away from the user's intended fix, while Claude Code issue #23776 reports the latest user instructions being lost or mischaracterized during compaction.

Sources:
- https://github.com/openai/codex/issues/18720
- https://github.com/anthropics/claude-code/issues/23776

## Observed evidence
- Active context can exist in application state but be absent from the replacement model history.
- Recoverable tool evidence can exist in persisted state but become unreachable to the continuation.
- Operational progress can be lost even while the high-level objective survives.
- The agent can continue without detecting that required context is missing.

## Interpretation
Compaction should be treated as a **state-transition boundary**, not a transparent summarization operation. A lossy narrative summary is appropriate for conversation compression, but operational invariants should be maintained separately in a structured checkpoint and explicitly validated before execution resumes.

## Existing approaches

### Free-form summary
The model summarizes prior context into prose.

**Strength:** flexible and token-efficient.

**Limitation:** difficult to validate mechanically; omission of one critical constraint can be invisible.

### Re-reading repository files or session logs
Agents can reconstruct state after compaction by re-reading files, logs, task lists, or tool history.

**Strength:** can recover missing facts.

**Limitation:** expensive, slow, and incomplete when the agent does not know what was lost or where to look.

### Persistent project instruction files
Files such as project rules can be reloaded.

**Strength:** good for static policy.

**Limitation:** not enough for dynamic execution state such as active task intent, assumptions, test results, active external-resource identity, pending approvals, or next action.

### Larger context windows
Larger models delay compaction.

**Limitation:** does not remove the failure mode; long-running tasks still cross context boundaries and can pay higher latency/cost.

## Root-cause hypotheses
1. Compaction replaces model-visible history without a contract defining which dynamic state must survive.
2. Narrative summaries optimize semantic compression rather than exact operational continuity.
3. State exists across multiple planes: prompt history, client-side stores, tool transcripts, files, task systems, subagent state, and external resource handles.
4. Post-compaction continuation lacks a deterministic preflight that compares required state against the reconstructed context.
5. Systems often track the objective but not a machine-checkable “operational tail.”

## Improvement target
Create a reusable continuity contract that separates:
- **Narrative summary**: lossy prose optimized for semantic continuity.
- **Operational checkpoint**: structured state that must survive compaction exactly enough to resume safely.

The checkpoint should capture only task-critical state, not hidden chain-of-thought.

## Required checkpoint fields
- task identity and objective
- explicit user constraints
- facts with evidence references
- assumptions still unresolved
- decisions and their externally visible rationale
- changed files/artifacts
- commands/tests run and outcomes
- active tool/resource identities needed later
- pending approvals or safety gates
- completed stages
- current stage
- next concrete action
- retry counters and stop conditions
- known failures/blockers
- checkpoint generation number and timestamp

## Success metrics
- `continuity_required_field_coverage = 100%` before resume.
- `orphaned_active_resource_count = 0` for resources declared required.
- `unverified_resume_count = 0`.
- Lower post-compaction re-read/tool-call count on benchmark tasks.
- No regression in task correctness on checkpointed vs non-checkpointed replay scenarios.
- Reduced post-compaction rework: fewer repeated edits/tests/queries already completed before compaction.

## Proposed engineering solution
A deterministic checkpoint validator plus explicit compaction lifecycle:

`Prepare → Capture operational checkpoint → Compact narrative → Rehydrate required state → Validate checkpoint → Resume or stop`

A continuation is blocked when a required invariant is missing, stale, contradictory, or cannot be verified from available evidence.

## Safety
The checkpoint must not contain hidden chain-of-thought. It records concise externalized state: facts, assumptions, decisions, evidence IDs, execution status, and next actions. Secrets must be referenced by handles/names, never copied into checkpoint values.

## Sources
1. OpenAI Codex #37121 — https://github.com/openai/codex/issues/37121 — 2026-08-05.
2. OpenAI Codex #38269 — https://github.com/openai/codex/issues/38269 — 2026-08-12.
3. OpenAI Codex #36721 — https://github.com/openai/codex/issues/36721 — 2026-08-03.
4. OpenAI Codex #18720 — https://github.com/openai/codex/issues/18720.
5. Anthropic Claude Code #23776 — https://github.com/anthropics/claude-code/issues/23776.
