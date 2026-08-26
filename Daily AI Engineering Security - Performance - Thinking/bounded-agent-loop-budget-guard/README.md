# Bounded Agent Loop Budget Guard

**Category:** Thinking

## Problem
Agent loops can continue after useful progress has stopped. Tool approval, skill loading, retry, judge, or background-task loops may repeatedly re-enter the model and consume large token budgets when a completion condition fails or a model repeats the same action.

## Evidence
See `evidence/research.md`. Current 2026 evidence includes a Microsoft Agent Framework issue where an approval/skill-loading loop consumed more than 100 million tokens over three days, Microsoft guidance updated August 10, 2026 that autonomous loops must always be bounded, and OpenAI Agents SDK documentation exposing `max_turns` as a hard termination mechanism.

## Existing approach
Frameworks provide maximum iterations/turns, completion predicates, approval escapes, runtime budgets, and external cloud-budget alerts.

## Existing limitations
A fixed turn cap alone is coarse: it may be too high for a repeated no-progress pattern or too low for valid long tasks. Many loops also span nested agent/tool layers where the outer limit does not observe the inner repetition signature. Cost alerts may arrive after substantial waste.

## Proposed improvement
Add a deterministic, framework-agnostic loop guard that combines hard iteration/tool/token budgets with repeated-action detection and explicit progress evidence. The guard stops early when the same tool/action signature repeats without measurable progress.

## Architecture
- `config/budget.json` — hard and no-progress limits.
- `scripts/loop_budget_guard.py` — deterministic trace evaluator.
- `tests/test_loop_budget_guard.py` — regression tests.
- `skills/loop-failure-analysis.md` — diagnosis procedure.
- `rules/bounded-reasoning.md` — enforceable loop rules.
- `subagents/verification-agent.md` — independent verification role.
- `workflows/measure-diagnose-stop.md` — bounded investigation/implementation workflow.
- `hooks/post-agent-step.md` — deterministic post-step gate.
- `evidence/research.md` — public evidence.

## Installation
Python 3.10+; standard library only.

## Configuration
Tune budgets by workload class. Keep a hard finite ceiling for every autonomous loop.

## Usage
```bash
python scripts/loop_budget_guard.py --trace trace.jsonl --policy config/budget.json
```
Each trace line is JSON with at least `iteration`, `action`, `signature`, `input_tokens`, `output_tokens`, and `progress_delta`.

## Metrics
- iterations/task
- tool calls/task
- input/output tokens/task
- repeated no-progress signatures
- guard-stop rate
- valid-task completion rate after guard adoption
- avoided tokens versus configured hard ceiling

## Verification
Run:
```bash
python -m unittest tests/test_loop_budget_guard.py
```

## Safety
A loop stop does not mean task success. The runtime must report `stopped_budget`, `stopped_repetition`, or `completed` distinctly. Never hide a failure by raising limits without evidence.

## Failure handling
Detection: policy violation reason code. Retry policy: at most two hypothesis revisions. Fallback: stop the autonomous loop and return collected evidence. Escalation: human operator for tasks requiring more budget. Stop condition: hard budget, repeated no-progress signature, or exhausted retries.

## Definition of Done
**Implemented:** guard runs after every autonomous step.  
**Measured:** baseline task traces and post-change metrics exist.  
**Verified:** regression tests pass; loops are bounded; repeated no-progress patterns stop before hard ceiling; valid benchmark tasks remain within an accepted completion-rate tolerance.

## Customization
Create workload-specific policies rather than globally increasing limits. Add domain-specific progress signals when deterministic evidence is available.