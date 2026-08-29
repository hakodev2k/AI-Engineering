# Successful Tool-Search Loop Budget Guard

Category: Performance

## Problem
Tool-discovery calls can succeed repeatedly while making no progress. Failure-only guardrails miss this class, allowing hundreds or thousands of successful searches to consume context, latency, and cost.

## Evidence
See `evidence/research.md`. Current public signals include Hermes Agent issue #96247 (Aug 27, 2026: 1,523 successful `tool_search` calls, 130k context, 1,125 s, no answer), VS Code issue #296123 (verified infinite deferred-MCP search loop), OpenAI Codex issue #34735 (deterministic tool failure retries without a usage guard), and Claude Code issue #68093 (229 repeated StructuredOutput calls without a per-agent retry cap).

## Existing approach
Most runtimes bound total iterations, repeated failures, identical failed calls, or wall-clock timeout. These mechanisms are useful but insufficient when each call returns a nominally successful result.

## Improvement
Introduce progress-aware budgets based on successful search-call count, repeated query/result fingerprints, new-tool discovery rate, context growth, and elapsed time. Escalate from warning to deterministic block, then require one bounded strategy change or terminate with an evidence-backed failure.

## Package tree
- `evidence/research.md`
- `skills/loop-diagnosis.md`
- `rules/progress-budget-rules.md`
- `subagents/performance-investigator.md`
- `subagents/verification-agent.md`
- `workflows/measure-diagnose-guard-verify.md`
- `hooks/preflight-progress-budget.md`
- `scripts/tool_loop_guard.py`
- `tests/test_tool_loop_guard.py`

## Installation
Python 3.10+. Standard library only.

## Usage
`python scripts/tool_loop_guard.py trace.jsonl --max-searches 24 --max-stagnant 6 --max-seconds 180`

## Metrics
Tool calls/task, search calls/task, repeated fingerprint count, new tools/search, prompt tokens, context growth, p50/p95 latency, completion rate, quality pass rate.

## Verification
Implemented = guard integrated and tests pass. Measured = representative baseline and guarded traces collected. Verified = lower loop/call/latency cost while completion quality remains within policy.

## Safety
The guard MUST NOT silently substitute unrelated tools or remove security checks. It MUST terminate rather than loop indefinitely when progress cannot be demonstrated.

## Failure handling
At most two strategy retries after a block. Persist blocking evidence and escalate when a required capability is unavailable.

## Definition of Done
Evidence documented; baseline captured; root cause identified; deterministic budgets enabled; tests pass; before/after metrics recorded; no unbounded loop remains; independent verifier signs off.
