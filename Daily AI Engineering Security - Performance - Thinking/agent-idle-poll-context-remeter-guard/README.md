# Agent Idle-Poll Context Remeter Guard

**Category:** Token

## Problem
Long-running AI-agent tasks can consume very large cached-token volumes while doing little useful work when short `wait`/status polls trigger fresh model turns against a large accumulated context. Context compaction and tool-output history can further multiply the cost when deduplication state is lost or previous tool results are repeatedly re-sent.

## Evidence
See `evidence/research.md` for August 2026 Codex and Hermes reports plus provider prompt-cache behavior.

## Existing approach
Prompt caching, context compression, tool-output truncation, polling loops, and agent lifecycle APIs are common mitigations.

## Existing limitations
Cached input is still metered; frequent no-op polls can replay a huge prefix thousands of times; stale subagent state can keep polls alive; compaction can lose deduplication state; cache TTLs can also expire during long gaps.

## Proposed improvement
Measure orchestration traces before changing behavior, classify control-only turns, enforce a token-aware polling budget with exponential backoff and stale-agent termination, keep repeated tool outputs out of model-visible context, and require before/after token and task-quality evidence.

## Package tree
- `evidence/research.md`
- `config/policy.json`
- `skills/context-remeter-analysis.md`
- `rules/token-budget.md`
- `subagents/token-verifier.md`
- `workflows/measure-optimize.md`
- `workflows/regression-verification.md`
- `hooks/pre-poll.md`
- `scripts/remeter_profiler.py`
- `tests/test_remeter_profiler.py`

## Installation
Python 3.10+; standard library only.

## Usage
`python scripts/remeter_profiler.py trace.jsonl --policy config/policy.json`

Each JSONL row should include `event`, `input_tokens`, `cached_tokens`, `latency_ms`, and optional `agent_id`, `result`, `tool_output_hash`.

## Workflow
Measure baseline → diagnose no-op/model-turn coupling → form hypothesis → tune polling/dedup policy → measure again → verify task quality and token regression.

## Metrics
Tokens/task, cached tokens/task, no-op control-turn ratio, wait-family calls/task, tokens per useful state change, repeated tool-output count, p50/p95 latency, task success/regression rate.

## Verification
Run `python -m unittest tests/test_remeter_profiler.py` and compare baseline with a post-change trace from the same workload.

## Safety
Never remove context required for correctness merely to save tokens. Stale-agent termination must not kill active irreversible work; require explicit lifecycle evidence.

## Failure handling
Detection: budget breach or quality regression. Retry: maximum 2 optimization iterations. Fallback: disable automated polling optimization and use conservative fixed intervals. Escalate if task success drops, state changes are missed, or long-running irreversible work cannot be distinguished from a stale agent.

## Definition of Done
**Implemented:** token-aware poll gate and dedup controls are integrated.  
**Measured:** baseline and post-change traces exist.  
**Verified:** lower tokens/task or control-turn count with equal-or-better task success, no critical context loss, bounded retries, and independent review.

## Customization
Tune budgets to workload/model pricing, but preserve quality gates and explicit stale-agent evidence.
