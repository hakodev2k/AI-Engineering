# Agent Retry Storm Budget Guard

**Category:** Performance

## Problem
AI-agent stacks often contain retries at several layers: orchestration, model SDK, authentication, retrieval, MCP/tool clients, and subagents. During a dependency outage these local retry policies can multiply traffic, increase task latency and cost, and delay service recovery.

## Evidence
`evidence/research.md` documents current evidence, including GitHub's August 17, 2026 outage where a latent VS Code retry bug amplified Copilot Token Service traffic by approximately 10x and delayed recovery, plus current AWS and Google retry guidance.

## Existing approach
SDK retries, exponential backoff and jitter, maximum retry counts, request timeouts, circuit breakers, `Retry-After`, and idempotency keys.

## Existing limitations
Per-layer budgets compose poorly; retry ownership is often ambiguous; long-running agents can reset local budgets; retry amplification is rarely measured at the task level; transport-level transience does not make a side-effecting tool call safe to repeat.

## Proposed improvement
Propagate one task-scoped retry budget across all model/tool/auth/retrieval calls. Enforce per-operation limits, error classification, idempotency, bounded full-jitter backoff, `Retry-After`, elapsed-time budget, and circuit opening before every retry.

## Architecture
```text
failed agent operation
  -> hooks/pre-retry.md
  -> scripts/retry_guard.py
  -> config/retry-policy.json
  -> retry(delay) | fail_fast | circuit_open
  -> tests/test_retry_guard.py
  -> before/after performance verification
```

## Actual package tree
```text
agent-retry-storm-budget-guard/
├── README.md
├── config/retry-policy.json
├── evidence/research.md
├── hooks/pre-retry.md
├── rules/retry-budget.md
├── scripts/retry_guard.py
├── skills/retry-amplification-analysis.md
├── subagents/performance-verifier.md
├── tests/test_retry_guard.py
└── workflows/measure-diagnose-optimize.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Tune `config/retry-policy.json` using measured dependency behavior. Keep the task-wide budget smaller than the sum of unconstrained nested-layer defaults would otherwise produce.

## Usage
Create an event such as:

```json
{"status":503,"operation_attempt":1,"task_retry_count":3,"elapsed_ms":4500,"idempotent":true,"consecutive_endpoint_failures":2}
```

Run:

`python scripts/retry_guard.py --event event.json --policy config/retry-policy.json`

## Workflow
Use `workflows/measure-diagnose-optimize.md`: Measure -> Diagnose -> Hypothesize -> Optimize -> Measure again -> independent verification. Optimization loops are bounded to two revisions.

## Metrics
Retry amplification factor, retries/task, recovered-transient-request rate, p95 task latency, circuit-open events, abandoned retries, and duplicate-side-effect count.

## Verification
Run `python -m unittest tests/test_retry_guard.py`. Compare baseline and candidate traces using the same failure fixtures. Never claim a performance improvement without before/after measurements.

## Safety
Non-idempotent operations fail fast unless an external idempotency mechanism makes repetition safe. Security or correctness checks are never bypassed for lower latency.

## Failure handling
**Detection:** retry-budget exhaustion, circuit opening, guard error, or regression.  
**Evidence:** structured retry decisions and before/after traces.  
**Retry policy:** maximum 2 optimization revisions.  
**Fallback:** last verified policy and fail-fast behavior.  
**Escalation:** dependency/platform owner for persistent failures or unknown idempotency.  
**Stop condition:** duplicate side effect, absent baseline, exhausted task budget, unresolved retry ownership, or exhausted optimization retries.

## Definition of Done
**Implemented:** all retrying layers propagate task and operation counters through the pre-retry guard.  
**Measured:** baseline and candidate call counts and latency exist.  
**Verified:** retry amplification is lower or bounded at target, transient recovery remains acceptable, tests pass, and no duplicate side effects occur.

## Customization
Adjust status classes, budgets, cool-down, and elapsed limits per dependency. Prefer a single retry owner per logical operation and document any SDK retry behavior that cannot be disabled.
