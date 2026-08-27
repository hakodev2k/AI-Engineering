# Research — Long-Running Agent Convergence Gate

**Topic:** Prevent finite coding tasks from expanding into unbounded planning/review/continuation loops  
**Category:** Thinking  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Long-running coding agents can keep creating new work, repeated reviews, or empty continuation turns after the original acceptance criteria are already narrow and finite. The failure is operationally visible as non-decreasing remaining work, repeated continuation cycles without artifact changes, or new sub-tasks not tied to a newly failed criterion.

## Why it matters now
Recent 2026 public bug reports show this is not a theoretical prompting concern. It wastes developer time and tokens and can leave unpublished work in an ambiguous state.

## Affected users
Developers running long-lived coding tasks, teams using subagents/review agents, CI-like agent workflows, and platform builders implementing autonomous continuation.

## Current public evidence

### Observed evidence
1. **OpenAI Codex issue #35892**, opened **2026-07-29**, reports a finite multi-repository task that repeatedly expanded into more tasks, subagent lanes, review cycles, and verification gates for about three days instead of converging. It calls for a visible critical path, bounded correction cycles, and a safe snapshot/stop path.  
   https://github.com/openai/codex/issues/35892
2. **OpenAI Codex issue #37800**, opened **2026-08-10**, reports an automatic-continuation loop that emitted only a continuing message without edits or meaningful progress while still consuming tokens and time.  
   https://github.com/openai/codex/issues/37800
3. **oh-my-openagent issue #5120**, opened **2026-06-10**, reports an infinite planning loop on a trivial task, showing the same class of missing convergence/stop control in another agent stack.  
   https://github.com/code-yeongyu/oh-my-openagent/issues/5120

### Interpretation
These reports differ in implementation, but share observable control failures: no durable acceptance ledger, no evidence requirement for spawning new work, no no-progress threshold, and no deterministic stop/snapshot gate. This package does not infer hidden reasoning; it governs externally visible task state.

## Existing approaches
- TODO/task lists.
- Planner/reviewer subagents.
- User-authored keep-going instructions.
- Ad hoc retry limits and manual interruption.
- Long-running monitor/resume proposals such as Codex issue #32993.

## Remaining limitations
- Task lists can grow rather than shrink.
- Review agents can generate new work without linking it to a failed acceptance criterion.
- Model-level stop instructions are not deterministic.
- Manual interruption often happens after significant token/time waste.
- Done status can be ambiguous when local changes are not yet snapshotted or published.

## Root-cause analysis
1. Acceptance criteria are not represented as a stable machine-checkable ledger.
2. New work creation is not causally bound to a failed criterion.
3. Progress is measured narratively rather than by state transitions/evidence.
4. No-progress and maximum-cycle thresholds are missing or advisory.
5. Failure recovery lacks a deterministic preserve-current-artifact, report-immutable-state, stop path.

## Improvement opportunity
Introduce a reusable convergence contract: stable criteria, per-cycle remaining count, evidence-backed progress events, bounded new-work creation, no-progress threshold, hard cycle cap, and a snapshot-and-stop decision when the task fails to converge.

## Relevant sources
- OpenAI Codex #35892: https://github.com/openai/codex/issues/35892
- OpenAI Codex #37800: https://github.com/openai/codex/issues/37800
- OpenAI Codex #32993: https://github.com/openai/codex/issues/32993
- oh-my-openagent #5120: https://github.com/code-yeongyu/oh-my-openagent/issues/5120
