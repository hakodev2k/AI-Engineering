# Reasoning-Only Truncation Retry Budget Guard

**Category:** Performance  
**Run date:** 2026-08-26 (UTC+7)

## Problem
When a reasoning model exhausts its output budget before producing visible content or tool calls, generic retry loops can repeat a deterministic failure many times, consuming GPU/API time without producing a usable result.

## Evidence
See `evidence/research.md`.

## Existing approach
Agent frameworks commonly cap retries or agent steps and use generic empty-response retries. Some branches raise output limits for truncated tool calls.

## Existing limitations
Retry count alone does not distinguish transient empty responses from deterministic reasoning-only truncation. Repeating the same request with the same output cap can reproduce the same failure.

## Proposed improvement
Classify failed responses by observable finish reason, visible content, tool calls, token usage and attempt number. Stop deterministic no-progress retries early, surface an explicit `stop_and_adjust_budget` action, and bound transient empty retries separately.

## Architecture
- `evidence/research.md` — current evidence
- `config/policy.json` — retry policy
- `scripts/retry_budget_guard.py` — deterministic classifier
- `tests/test_retry_budget_guard.py` — regression tests
- `skills/response-failure-classification.md` — diagnostic skill
- `rules/retry-budget.md` — enforceable performance rules
- `subagents/performance-investigator.md` — measurement/review role
- `workflows/measure-diagnose-optimize.md` — bounded workflow
- `hooks/post-model-response.md` — runtime integration hook
- `examples/events.jsonl` — safe synthetic fixtures

## Installation
Python 3.10+; standard library only.

## Usage
`python scripts/retry_budget_guard.py --event event.json --policy config/policy.json`

## Metrics
Wasted retries/turn; model calls/failed turn; GPU/API seconds/failed turn; visible-output recovery rate; p95 turn latency; output-token utilization.

## Verification
Run `python -m unittest tests/test_retry_budget_guard.py`.

## Safety
The guard never exposes hidden reasoning content. It uses only observable counters and finish metadata. It does not reduce security checks or required context.

## Failure handling
Malformed telemetry blocks autonomous retry classification. Deterministic reasoning-only truncation stops immediately. Transient empty responses get at most the configured retry count. Escalate if changing output budget could exceed platform cost limits.

## Definition of Done
**Implemented:** classifier, policy and hook integrated.  
**Measured:** before/after retry and latency metrics captured.  
**Verified:** tests pass; deterministic truncation consumes fewer model calls while preserving normal retry recovery; no hidden reasoning is logged.

## Customization
Tune thresholds per provider/model but keep hard retry limits and explicit no-progress detection.
