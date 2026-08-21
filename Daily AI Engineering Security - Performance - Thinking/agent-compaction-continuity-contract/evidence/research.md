# Research: Agent Compaction Continuity Contract

## Problem
Long-running coding-agent sessions can lose the active objective, completed work, rejected approaches, evidence references, or the identity of the current user turn when automatic/manual context compaction occurs. The resulting agent may repeat work, revive known-bad approaches, act on stale instructions, or continue with unsupported assumptions.

## Category
**Thinking** (primary), with secondary Token implications.

## Why it matters now
Agentic coding sessions are increasingly long, tool-heavy, and multi-step. Compaction is necessary to fit context limits, but recent 2026 reports show that summary-based compaction can degrade task-state continuity in ways that materially change execution rather than merely reduce conversational detail.

## Current public signals

### Signal 1 — Codex loses active goal during compaction
OpenAI Codex issue #32922, opened 2026-07-14, reports that the active goal can disappear from compacted history; subsequent continuation prompts such as “continue” may no longer have the objective needed to act correctly.

Source: https://github.com/openai/codex/issues/32922

### Signal 2 — Codex can resume a stale user prompt as current instruction
Codex issue #27731, opened 2026-06-12, reports that after compaction the most recent historical user prompt may be presented as the active instruction even after substantial subsequent work. This can derail a long-running task.

Source: https://github.com/openai/codex/issues/27731

### Signal 3 — Progressive information loss across repeated compactions
Codex issue #14347, opened 2026-03-11, describes “progressive amnesia”: after multiple compactions, earlier decisions and context disappear because summaries emphasize recent work.

Source: https://github.com/openai/codex/issues/14347

### Signal 4 — Repeated work and quota waste after compaction
Codex issue #35935, opened 2026-07-29, reports context compaction losing task state, causing repeated completed work and increased usage.

Source: https://github.com/openai/codex/issues/35935

### Signal 5 — Claude Code loses critical working knowledge
Claude Code issue #29890, opened 2026-03-01, reports that compaction can forget established successful/failed approaches, causing the agent to retry approaches already known to fail.

Source: https://github.com/anthropics/claude-code/issues/29890

### Signal 6 — Compaction can become unrecoverable at the limit
Claude Code issues #23047, #26317, and #74544 report cases where compaction itself fails once sessions are too large, forcing reset/clear and loss of accumulated context.

Sources:
- https://github.com/anthropics/claude-code/issues/23047
- https://github.com/anthropics/claude-code/issues/26317
- https://github.com/anthropics/claude-code/issues/74544

## Existing approaches
1. Automatic conversation summarization/compaction.
2. Manual `/compact` before the context limit.
3. User-maintained plan or memory files.
4. Prompts asking the model to preserve important state.
5. Proposed context pins / selective retention mechanisms, e.g. Codex issue #26889.
6. Starting a fresh session and manually reconstructing state when compaction fails.

Source for context-pin proposal: https://github.com/openai/codex/issues/26889

## Observed limitations
- Summaries are probabilistic and can omit facts that become important later.
- “Recent work” bias can erase early constraints, failed hypotheses, and accepted decisions.
- A summary does not necessarily distinguish active instruction from historical user text.
- Manual plan files depend on the agent remembering to update them before compaction.
- Repeated compaction compounds earlier omissions.
- No generic mechanism proves that the compacted state still contains every required invariant before execution resumes.
- If compaction fails near the hard limit, there may be no opportunity to reconstruct state from the conversation itself.

## Root-cause hypotheses
1. **State is implicit in prose.** Goal, constraints, decisions, completion state, and evidence are distributed across many messages.
2. **Importance is model-estimated.** Summarizers optimize brevity without a machine-checkable set of required fields.
3. **No pre/post contract.** There is usually no deterministic comparison between authoritative pre-compaction state and post-compaction recovered state.
4. **No stale-turn guard.** Historical user messages may be semantically indistinguishable from the currently active instruction after reconstruction.
5. **Failed attempts are undervalued.** Summaries often retain successful outcomes but omit negative evidence that prevents repeated work.
6. **Late checkpointing.** If state capture waits until the context is nearly full, the capture step itself may fail.

## Improvement target
Create a model-agnostic **Compaction Continuity Contract** that externalizes task state before compaction and validates it after compaction. The contract is not a replacement for summarization; it is a small authoritative state capsule that summaries must preserve or rehydrate.

Required state classes:
- active goal and active user-turn identifier;
- non-negotiable constraints;
- accepted decisions and their evidence IDs;
- completed work and verifiable artifacts;
- rejected/failed approaches with reason;
- open hypotheses and next action;
- pending approvals/blockers;
- evidence/resource references;
- monotonic generation number and checksum.

## Proposed engineering solution
1. Capture a structured continuity capsule at stable checkpoints and before compaction.
2. Validate schema, required invariants, unique IDs, and checksum deterministically.
3. Keep the capsule outside conversational summary text.
4. After compaction/resume, require the agent to emit a structured recovery view derived from the capsule.
5. Run a deterministic continuity diff before any mutating tool call.
6. Block execution if goal, active-turn ID, constraints, unresolved blockers, or required evidence refs are missing or changed without explicit authorization.
7. Track repeated-work signals and continuity failures as measurable metrics.
8. Use bounded recovery: at most two rehydrate attempts, then stop and escalate.

## Success metrics
- `critical_field_loss_rate = 0` in compaction fault tests.
- `stale_turn_resume_rate = 0` in replay fixtures.
- `known_failed_approach_repetition_rate = 0` for fixture scenarios.
- `continuity_gate_false_pass_rate = 0` for mutations of critical fields.
- ≥95% non-critical field recovery in test fixtures.
- Continuity capsule size remains below the configured budget.
- No mutating action is allowed while continuity status is `invalid` or `unknown`.

## Interpretation vs observation
**Observed:** multiple 2026 Codex and Claude Code issues show goal loss, stale-turn resumption, repeated work, progressive information loss, and unrecoverable compaction failures.

**Interpretation:** these failures share a state-continuity problem: important task state is represented only as compressible conversational text.

**Proposed solution:** externalize a small, typed, machine-verifiable continuity contract and gate post-compaction execution on deterministic validation.

## Research date
2026-08-20 (Vietnam time, UTC+7).
