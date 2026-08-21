# Research Evidence

## Topic
Progress Liveness Gate

## Category
Thinking

## Problem
Long-running coding agents can continue producing messages, plans, reviews, status text, or orchestration activity without making measurable progress toward the requested deliverable. Because activity is mistaken for progress, the loop can consume tokens and time indefinitely while no files change, no acceptance criterion advances, and no blocker is surfaced.

## Why it matters now
Recent August 2026 Codex reports show two related live failure modes: automatic continuation loops emitting repeated “continuing” messages without edits, and layered instructions driving repeated planning/review meta-workflows with zero implementation. Both demonstrate that current stop conditions often depend on conversational behavior rather than measurable task-state deltas.

## Affected users
Developers running long tasks, unattended coding-agent users, teams with layered AGENTS.md/skills, platform builders implementing automatic continuation, and users paying for token-heavy agent loops.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #37800 (2026-08-10) reports a runaway automatic-continuation loop that repeatedly emitted status text after earlier real progress but then made no edits or meaningful progress while consuming tokens.
2. Codex issue #36555 (2026-08-02) reports layered AGENTS.md guidance and reusable skills locking sessions into repeated contract/freeze/review cycles with zero implementation, even after explicit user instructions to stop repeating the meta-process.
3. Codex issue #37278 reports long-running tasks replacing the requested deliverable with plans, reports, tests, caches, or audit artifacts and terminating before explicit acceptance gates were satisfied.

### Interpretation
The shared root problem is missing liveness accounting: agent loops track turns and activities but do not require observable progress against the active goal. Repeated status messages, reviews, or support artifacts can therefore reset subjective notions of “working” without advancing acceptance criteria.

## Existing approaches
- Max-turn limits.
- Generic retry counters.
- Plan/execute/review loops.
- User-authored stop instructions.
- Automatic continuation after model/tool boundaries.

## Remaining limitations
- Turn limits do not distinguish productive from unproductive work.
- “Progress” is rarely defined as a measurable state delta.
- Meta-work can satisfy process steps while leaving the product unchanged.
- Repeated no-op continuations can consume tokens before max-turn limits are hit.
- User corrections may not invalidate stale downstream plans.

## Root-cause analysis
1. No explicit active-goal acceptance ledger at each loop iteration.
2. No deterministic progress signal such as changed files, completed acceptance items, new verified evidence, or reduced blocker set.
3. Status text and planning artifacts are counted as work regardless of goal relevance.
4. Stop conditions are turn-based instead of liveness-based.
5. Continuation mechanisms retry without requiring a changed hypothesis or state.

## Improvement opportunity
Introduce a liveness gate that records observable progress events, calculates a bounded no-progress streak, requires a changed hypothesis before retrying after stagnation, and stops/escalates when the loop exceeds its progress budget.

## Relevant sources
- https://github.com/openai/codex/issues/37800
- https://github.com/openai/codex/issues/36555
- https://github.com/openai/codex/issues/37278

## Goal
Prevent active-looking but non-progressing agent loops from consuming unbounded time/tokens.

## Metrics
No-progress iterations, acceptance criteria completed per iteration, verified state deltas, tokens per accepted criterion, repeated-hypothesis count, forced-stop count, recovery success rate.

## Trigger
Every autonomous continuation, retry, review cycle, or long-running agent checkpoint.

## Inputs
Active goal, acceptance criteria, iteration events, file/test/evidence deltas, blocker set, hypothesis ID, token/cost counters.

## Outputs
Progress score, no-progress streak, continue/stop/escalate decision, required next hypothesis, verification status.