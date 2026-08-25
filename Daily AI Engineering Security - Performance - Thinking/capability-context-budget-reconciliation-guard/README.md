# Capability Context Budget Reconciliation Guard

## Topic
Whole-context verification for tool, skill, plugin, app, connector, and MCP catalog token optimizations.

## Category
Token

## Problem
A host can report that a capability bucket shrank while total effective context stays unchanged because the same tokens move into another serialization/accounting bucket. Hiding or disabling capabilities therefore does not prove context-window, cost, or latency improvement.

## Evidence
`evidence/research.md` documents fresh 2026 signals from Codex, Claude Code, and MCP: eager inactive capability catalogs, exact token displacement between Skills and System tools, MCP schema overhead, new deterministic-order/cache guidance, and large-context re-metering during orchestration.

## Existing approach
Hide/disable unused capabilities, deduplicate schemas, use lazy/tool search, shorten descriptions, and rely on prompt caching or per-category context meters.

## Existing limitations
Per-category metrics can hide displacement; disabled capabilities may survive another injection path; cached prefixes still occupy context; catalog churn can invalidate cache reuse; optimization can accidentally remove correctness-critical context.

## Proposed improvement
Measure the whole context before and after each change, reconcile total and category deltas deterministically, require an expected removal to yield a minimum effective reduction, flag compensating category growth, and separately require unchanged task-quality tests to pass.

## Architecture
```text
baseline snapshot ----\
                      +--> scripts/context_budget_reconcile.py --> pass/regression
candidate snapshot ---/                 ^
                                        |
                               config/budget.example.json
                                        |
                                        +--> independent quality gate
```

## Package tree
```text
README.md
evidence/research.md
config/budget.example.json
skills/context-accounting.md
rules/context-budget-policy.md
subagents/context-budget-verifier.md
workflows/measure-reconcile-optimize.md
hooks/context-regression-gate.md
scripts/context_budget_reconcile.py
tests/test_context_budget_reconcile.py
```

## Installation
Requires Python 3.9+ and no third-party dependencies. Copy the directory into the host/control-plane repository.

## Configuration
Start from `config/budget.example.json`:
- `expected_removed_tokens`: estimated eager-context material the change intends to remove.
- `min_effective_reduction_ratio`: fraction of that estimate that must appear as a real total-token reduction.
- `max_total_tokens`: hard candidate context budget.
- `max_unrelated_category_growth`: maximum tolerated positive delta for any category.
- `required_quality_floor`: enforced by the external unchanged task-quality suite.

Snapshots use this minimal shape:
```json
{
  "total_tokens": 50000,
  "categories": {
    "skills": 10000,
    "system_tools": 20000,
    "other": 20000
  }
}
```

## Usage
```sh
python scripts/context_budget_reconcile.py \
  --baseline .context/baseline.json \
  --candidate .context/candidate.json \
  --policy config/budget.example.json \
  --output .context/reconciliation.json
```
Exit codes: `0` pass, `2` budget/reduction/displacement regression, `3` invalid input.

## Workflow
Follow `workflows/measure-reconcile-optimize.md`: Observe → Measure baseline → Diagnose → Form one hypothesis → Implement → Measure again → Reconcile → Quality verify → Complete. Maximum three optimization hypotheses.

## Metrics
Total tokens, effective reduction, category deltas, cold-start input tokens/latency, prompt-cache metrics, tokens/task, cost/task, context utilization, task pass rate, and regression rate.

## Verification
Run:
```sh
python -m unittest discover -s tests -v
```
Unit tests cover a real reduction, exact-style category displacement, and total-budget breach. Production verification additionally requires real host snapshots at the same lifecycle point plus an unchanged representative quality suite.

## Safety
Never remove active security constraints, tool contracts, task requirements, provenance, or correctness-critical context merely to hit a token budget. Cache savings and context-window savings must be reported separately.

## Failure handling
Detection: script exit `2`/`3` or external quality result below floor. Evidence: preserve snapshots, policy, reconciliation and quality output. Retry: maximum three distinct diagnosed hypotheses. Fallback: restore last verified configuration. Escalation: host/runtime owner when serialization prevents real removal. Stop: repeated failure or any security/correctness regression.

## Definition of Done
- **Implemented:** optimization and all package controls exist.
- **Measured:** comparable baseline/candidate total and category token snapshots captured.
- **Verified:** deterministic reconciliation passes and independent task quality remains at/above floor.
- Before/after metrics are recorded, no unexplained displacement exceeds policy, and no blocking correctness/security issue remains.

## Customization
Add stable host-specific categories to snapshots and tune thresholds from measured workloads. Keep the whole-context total authoritative; never make a category-specific meter the sole success criterion.
