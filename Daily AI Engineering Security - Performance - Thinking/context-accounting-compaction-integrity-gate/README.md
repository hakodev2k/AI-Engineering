# Context Accounting Compaction Integrity Gate

**Category:** Token  
**Run date:** 2026-08-31 (UTC+7)

## Problem
Agent runtimes can conflate cumulative billing/usage counters with the current prompt occupancy used for context-window and compaction decisions. In tool-heavy turns this can inflate `totalTokens`, trigger destructive compaction far too early, cause repeated compaction churn, or report impossible context percentages.

## Evidence
See `evidence/research.md`. August 2026 OpenClaw reports show run-accumulated usage being persisted as a fresh context snapshot, premature compaction at only 4–8% of a configured window, and related stale/incorrect token-state failures. A separate Hermes Agent report shows one oversized tool-calling turn can exceed a compaction tail budget, reinforcing that compaction control needs measured occupancy rather than generic usage totals.

## Existing approach and limitation
Providers return token usage per model call; runtimes aggregate those values for cost/telemetry and also maintain session context estimates. Bugs arise when those semantically different counters share fields or fallback paths. Threshold checks then trust a value that is cumulative, stale, cache-accounting-derived, or otherwise not a current-context snapshot.

## Proposed improvement
Enforce typed token accounting invariants before compaction:
1. distinguish `billing_usage`, `last_call_prompt`, `stored_context_estimate`, and `context_window`;
2. reject cumulative usage as a fresh occupancy snapshot;
3. validate plausible bounds and freshness;
4. record the exact metric/source used for every compaction decision;
5. require before/after shrink evidence and quality checks;
6. circuit-break repeated compactions that reclaim insufficient tokens.

## Package tree
```text
README.md
evidence/research.md
config/budget.example.json
skills/context-accounting-audit.md
rules/compaction-integrity.md
subagents/token-verifier.md
workflows/measure-diagnose-compact-verify.md
hooks/pre-compaction-integrity-check.md
scripts/context_accounting_gate.py
tests/test_context_accounting_gate.py
```

## Installation
Python 3.10+, standard library only.

## Usage
```bash
python scripts/context_accounting_gate.py snapshot.json --budget config/budget.example.json
python -m unittest tests/test_context_accounting_gate.py
```

## Metrics
Current-context utilization; cumulative usage/current-context ratio; compaction trigger precision; tokens reclaimed; compaction calls/task; summary-loss regression rate; cost/task; latency/task.

## Verification
**Implemented:** typed snapshot validator and compaction gate. **Measured:** before/after context sizes and decision-source fields captured. **Verified:** compaction triggers only from an accepted current-context source, reclaims the configured minimum when run, and quality checks show no critical context loss.

## Safety
Token reduction MUST NOT discard correctness-critical context merely to meet a budget. If occupancy cannot be measured reliably, defer destructive compaction and escalate rather than pretending cumulative usage is context size.

## Failure handling
Invalid or stale occupancy blocks automatic destructive compaction. Maximum remediation retries: 2. Repeated low-reclaim compaction activates a circuit breaker and requires investigation.

## Definition of Done
Evidence documented; baseline captured; metric semantics mapped; gate implemented; tests pass; compaction decision source logged; before/after measurement complete; quality regression within policy; independent verifier approves; no blocking token-state ambiguity remains.
