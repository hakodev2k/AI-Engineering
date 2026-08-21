# Research — Workspace Drift Plan Revalidator

## Topic
Workspace drift invalidating persistent AI-agent plans.

## Category
Thinking

## Problem
Persistent coding-agent threads can carry an old plan, assumptions, and test conclusions across hours or days while the repository changes independently. Continuing without revalidation can cause incorrect edits, redundant work, or false completion claims.

## Why it matters now
Persistent sessions, multi-agent work, automated rebases/merges, and long-running goals make repository state increasingly non-static. Recent 2026 issue reports show this is not theoretical.

## Affected users
Developers resuming long-lived agent threads, teams using multiple coding agents, and platforms that persist agent state across repository changes.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #36717, opened 2026-08-03, explicitly requests detection when a workspace materially changes after the plan/analysis/test state was formed. The report notes changes can come from users, other agents, CI, rebases, merges, generated files, or dependency updates while a persistent thread retains the old plan.
2. Codex issue #36161, opened 2026-07-30, reports Plan Mode remaining enforced after resuming a thread even though the CLI reports Default mode. This is a separate signal that persisted-thread state and current runtime state can diverge across resume boundaries.
3. Codex issue #35935 reports a Windows regression where context compaction lost task state, repeated completed work, re-ran commands/repository analysis, and exhausted usage. This supports external checkpoints rather than trusting retained model context alone.
4. Codex issue #18517 reported a long session drifting back to a previous task and claiming new work complete when corresponding files had not been created. It is older and closed, so it is supporting evidence.

### Interpretation
The weakness is not that plans are inherently unreliable. A plan's validity depends on facts about the workspace. If those facts are not versioned or checked, a persisted plan behaves like a cache with no invalidation mechanism.

### Proposed solution
Bind plan continuation to an external, deterministic repository checkpoint. Detect drift before resuming implementation; classify whether changed state invalidates specific assumptions; reread only affected evidence; and require an explicit plan-validity decision.

## Existing approaches
- ad-hoc `git status`/`git diff` checks;
- rereading selected files after resume;
- conversation summaries/compaction;
- full repository rescans when uncertain.

## Remaining limitations
- ad-hoc checks are optional and easily skipped;
- conversation state does not prove filesystem state;
- full rescans waste time and tokens;
- HEAD-only checks miss dirty/untracked changes;
- treating every change as full invalidation creates unnecessary rework.

## Root-cause analysis
1. Plan assumptions are not linked to observable repository state.
2. Resume is treated as conversation continuation instead of state reconciliation.
3. Dirty tree, untracked files, branch changes, and committed changes have different semantics but are often collapsed into vague “repo changed” state.
4. Agents may optimize for forward progress and skip revalidation.
5. Compaction can weaken historical evidence about why a plan was chosen.

## Improvement opportunity
A deterministic fingerprint plus impact-classification workflow gives a cheap first gate. It detects mismatch without model reasoning, then uses reasoning only to decide which assumptions must be refreshed.

## Metrics
Drift detection coverage; stale continuations prevented; reread scope; rework rate after resume; plan refresh time; harmless-drift false-positive rate.

## Relevant sources
- https://github.com/openai/codex/issues/36717
- https://github.com/openai/codex/issues/36161
- https://github.com/openai/codex/issues/35935
- https://github.com/openai/codex/issues/18517

## Evidence status
**Implemented:** package supplies a reusable checker/workflow.

**Measured:** adoption-specific metrics are not claimed until collected.

**Verified:** only after unit tests and a real resume/drift scenario pass.