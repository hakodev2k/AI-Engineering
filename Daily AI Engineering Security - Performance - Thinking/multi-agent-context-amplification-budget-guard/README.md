# Multi-Agent Context Amplification Budget Guard

**Category:** Token

## Problem
Parallel/subagent workflows can duplicate large inherited context, replay images/tool output, compact repeatedly, and multiply token/network/storage usage far beyond the bounded task being performed.

## Evidence
See `evidence/research.md` for July–August 2026 Codex and Claude Code reports.

## Existing approach
Agents rely on context windows, compaction, prompt caching, subagent isolation, and usage dashboards.

## Existing limitations
Hard context limits act late; compaction can itself replay context; cached tokens can still consume quota or bandwidth; children may inherit context irrelevant to their task; and parent/child token amplification is rarely gated before fan-out.

## Proposed improvement
Measure inherited context before dispatch, assign a per-child context/token budget, deduplicate stable assets by digest, replace large images/tool outputs with references or task-specific summaries when correctness permits, and block fan-out when projected amplification exceeds policy.

## Architecture
- `evidence/research.md`
- `skills/context-amplification-analysis.md`
- `rules/token-budget-rules.md`
- `subagents/context-budget-reviewer.md`
- `workflows/measure-and-dispatch.md`
- `workflows/regression-verification.md`
- `hooks/pre-subagent-dispatch.md`
- `scripts/context_amplification_guard.py`
- `tests/test_context_amplification_guard.py`
- `examples/dispatch-plan.json`

## Installation
Python 3.10+. No third-party dependencies.

## Usage
`python scripts/context_amplification_guard.py --plan examples/dispatch-plan.json --max-amplification 3.0 --max-child-tokens 120000`

## Workflow
Measure the baseline, classify non-evictable context, run the pre-dispatch gate, then compare actual token/network/quality metrics using the regression workflow.

## Metrics
Projected/actual tokens per task; inherited-context tokens per child; amplification factor; duplicated-asset bytes; cache-read tokens; compaction count; network bytes; result-quality regression rate.

## Verification
Run `python -m unittest tests/test_context_amplification_guard.py`.

## Safety
Context reduction MUST NOT remove requirements, authorization constraints, security policy, or evidence necessary for correctness. High-risk tasks require conservative budgets and human approval for dropping critical context.

## Failure handling
Detection: projected amplification, child budget, required-context loss, or repeated-compaction threshold. Maximum optimization retries: 2. Fallback: reduce fan-out, use digest/reference-based context, or run sequentially. Escalate when correctness-critical context cannot fit.

## Definition of Done
**Implemented:** pre-dispatch budget gate active.  
**Measured:** before/after token, network, and quality metrics collected.  
**Verified:** tests pass and equivalent task outcomes show lower token amplification without critical context loss.

## Customization
Tune budgets per model/context window and task risk, but always measure before and after.
