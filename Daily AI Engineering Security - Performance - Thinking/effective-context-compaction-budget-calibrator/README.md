# Effective Context Compaction Budget Calibrator

**Category:** Token

## Problem
Agent runtimes can compact at the wrong time because raw model context, effective usable context, provider reserves, output reserves, reasoning tokens, cached tokens, and runtime accounting are not the same quantity. In August 2026, Codex reports show both late compaction caused by comparing against the raw window and early compaction caused by double-counting all-turn reasoning. Either direction wastes tokens, increases latency, or risks context exhaustion.

## Evidence
See `evidence/research.md`. The package is based on current Codex issues #40095 and #39767 plus contemporaneous fixes in Pi's coding-agent token accounting.

## Proposed improvement
Calibrate compaction against effective usable context and compare runtime-counted occupancy with independently observed prompt occupancy. Fail calibration if accounting error exceeds policy or configured headroom is below the safety floor.

## Package tree
- `evidence/research.md`
- `skills/calibrate-effective-context-budget.md`
- `rules/compaction-budget-rules.md`
- `subagents/context-budget-verifier.md`
- `workflows/measure-calibrate-verify.md`
- `hooks/pre-compaction-budget-check.md`
- `scripts/context_budget_calibrator.py`
- `tests/test_context_budget_calibrator.py`
- `config/policy.example.json`

## Installation and usage
Python 3.9+; no third-party packages. Run `python scripts/context_budget_calibrator.py snapshot.json`. Exit 0=pass, 1=invalid input, 2=policy violation.

## Metrics
Accounting-error ratio, compaction headroom ratio, compactions/task, overflow recoveries/task, tokens/task, latency/task, and quality regression rate.

## Verification
`python tests/test_context_budget_calibrator.py` must pass. Production verification requires representative before/after traces and no critical-context-loss regression.

## Safety
Optimization MUST NOT remove required instructions, approvals, security policy, or active task state.

## Failure handling
Invalid telemetry blocks calibration. Preserve the prior safe configuration; recapture at most twice before escalation.

## Definition of Done
Implemented: required snapshots and effective-context budgeting exist. Measured: representative workloads have before/after data. Verified: tests pass, accounting error/headroom meet policy, and quality does not regress.
