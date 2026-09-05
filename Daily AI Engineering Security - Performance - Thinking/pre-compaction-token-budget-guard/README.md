# Pre-Compaction Token Budget Guard

**Category:** Token  
**Run date:** 2026-09-05 (UTC+7)

## Problem
Long-running coding agents can compact context far earlier than intended when token accounting mixes incompatible quantities: used tokens, remaining tokens, and provider-reported context-window limits. Premature compaction adds summary tokens and latency while discarding detailed history that may still be required for correctness.

## Evidence
See `evidence/research.md` for current signals, existing approaches, limitations, and root-cause analysis.

## Existing approach and limitation
Agent frameworks already expose context-window configuration, compaction thresholds, summarization, prompt caching, and model metadata. These are necessary but fragile when provider metadata is stale or when code computes a threshold from the wrong token variable. A percentage threshold alone does not prove that compaction happened near the intended utilization.

## Proposed improvement
Treat compaction as a measurable state transition with invariant checks. Normalize model capacity, calculate utilization from one canonical equation, reserve a configurable safety margin, record every compaction event, and regression-test boundary values before rollout.

## Architecture
- `skills/context-budget-analysis.md`
- `rules/token-budget-rules.md`
- `subagents/context-budget-reviewer.md`
- `workflows/measure-optimize-verify.md`
- `hooks/pre-compaction.md`
- `scripts/context_budget_guard.py`
- `config/budget.example.json`
- `tests/test_context_budget_guard.py`
- `evidence/research.md`

## Installation
Python 3.10+, standard library only.

## Configuration
Set `context_window`, `reserved_tokens`, and `compact_at_utilization`. Provider/model metadata must be validated against authoritative model configuration. The default example compacts at 80% of usable capacity.

## Usage
`python scripts/context_budget_guard.py config/budget.example.json 50000`

The final argument is the measured total input-context token count for the active turn. Exit 0 means continue; exit 3 means compaction is due; exit 1 means invalid configuration/input.

## Workflow
Measure current context -> establish baseline compaction point -> diagnose accounting/metadata -> hypothesize correction -> implement -> replay boundary cases -> compare tokens, latency, and quality -> independent verification.

## Metrics
Tokens/task; compactions/task; utilization at compaction; summary tokens/task; cost/task; latency/task; task success; regression rate; critical-context-loss incidents.

## Verification
**Implemented:** canonical calculator, hook, tests, rules.  
**Measured:** baseline and corrected compaction utilization are recorded on the same workload.  
**Verified:** boundary tests pass; compaction occurs within configured tolerance; token/cost/latency improves without task-quality regression or critical context loss.

## Safety
Never raise thresholds beyond the model's effective context capacity. Never evict required security, user, task, or verification constraints merely to save tokens. Unknown model capacity blocks automatic threshold changes.

## Failure handling
Invalid metadata or impossible budgets fail closed. Retry metadata resolution once. Optimization experiments get at most 2 iterations; then revert to the known-safe budget and escalate.

## Definition of Done
Evidence documented; baseline captured; canonical budget configured; tests pass; before/after metrics captured; no critical context loss; quality regression within agreed tolerance; reviewer verifies the result.

## Customization
Adapters may feed provider-specific token counts into the script, but the canonical invariant `used / (context_window - reserved)` must remain explicit and testable.