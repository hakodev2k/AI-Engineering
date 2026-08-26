# Agent Context Compaction Integrity Budget Guard

**Category:** Token  
**Run date:** 2026-08-27 (UTC+7)

## Problem
Automatic context compaction can reduce token load yet silently remove recent user instructions, project rules, completed subagent findings, or working-state facts. A compaction event is not successful merely because a summary was produced.

## Evidence
See `evidence/research.md`. Current 2026 issues across Claude Code, OpenAI Codex, Hermes Agent, and OpenClaw independently report instruction loss, work-memory loss, dropped/merged messages, repeated work, and dangerous state loss after compaction.

## Existing approach
Agent runtimes use automatic/manual compaction, generated summaries, project-memory files, persistent memory, and post-compaction hooks.

## Existing limitations
Most flows do not deterministically prove that correctness-critical items survived or remain retrievable, that token reduction was material, or that the summary did not become duplicate/stale baggage.

## Proposed improvement
Add a deterministic post-compaction gate validating provider-measured before/after token counts, critical-context retention (inline or verified retrieval), duplicate-summary ratio, output budget, and minimum reduction for large contexts.

## Architecture
- `evidence/research.md`
- `config/budget.json`
- `schemas/context-snapshot.schema.json`
- `scripts/compaction_guard.py`
- `tests/test_compaction_guard.py`
- `skills/context-budget-integrity-analysis.md`
- `rules/context-compaction.md`
- `subagents/context-verifier.md`
- `workflows/baseline-and-compact.md`
- `workflows/regression-verification.md`
- `hooks/post-compaction.md`

## Installation
Python 3.10+; standard library only.

## Configuration
Edit `config/budget.json` by model/task class. Keep correctness-critical retention independent from savings targets.

## Usage
`python scripts/compaction_guard.py --event context-snapshot.json --budget config/budget.json`

## Metrics
Input/output tokens, reduction ratio, retained-required rate, retrieval coverage, duplicate ratio, regression and repeated-work rate.

## Verification
Run `python -m unittest tests/test_compaction_guard.py`. Token targets and critical-context integrity must both pass.

## Safety
Required security, user-intent, approval, task-constraint, and completed-work context MUST NOT be removed merely to save tokens.

## Failure handling
Maximum 2 revised compactions. Fallback: keep larger context, reload verified sources, or begin a fresh explicit handoff. Escalate missing security/approval/user-intent constraints.

## Definition of Done
**Implemented:** instrumentation, inventory, policy, guard, hook.  
**Measured:** provider before/after token counts and retention metrics.  
**Verified:** tests pass; required reduction achieved; every critical item inline or verified-retrievable; no blocking regression.

## Customization
Adjust token thresholds only; never lower retention requirements to make metrics pass.
