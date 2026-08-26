# Subagent Fanout Context Cost Budgeter

**Category:** Token

## Problem
Multi-agent fan-out can multiply fixed instructions, tool/skill schemas, inherited history and orchestration turns until small delegated tasks cost more tokens than serial execution.

## Evidence
See `evidence/research.md`. Current August 2026 signals include Codex #39808 on multiplied fixed child context cost, #37299 on high-frequency wait/status turns re-metering large cached context, and #39469 on parent-context duplication across many child rollout files.

## Existing approach
Smaller child models, prompt caching, concurrency caps, short child prompts, manual task grouping and periodic status polling.

## Existing limitations
Fixed bootstrap cost persists across smaller models; cached context is not necessarily free; concurrency caps do not bound total fan-out; polling can dominate turns; inherited parent context can dwarf unique child work.

## Proposed improvement
Measure the local child startup floor, estimate inherited/unique/polling/synthesis cost before spawn, compare against a serial baseline, and block/regroup fan-out that exceeds explicit thresholds. Feed actual usage back into the baseline.

## Architecture
```
subagent-fanout-context-cost-budgeter/
├── README.md
├── evidence/research.md
├── hooks/pre-spawn-budget.md
├── rules/token-budget-and-fanout.md
├── scripts/fanout_budgeter.py
├── skills/fanout-cost-analysis.md
├── subagents/token-optimizer.md
├── tests/test_fanout_budgeter.py
└── workflows/
    ├── fanout-failure-recovery.md
    └── measure-optimize-verify.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Measure or conservatively estimate `child_fixed_tokens`, `inherited_tokens_per_child`, `unique_tokens_per_child`, `serial_unique_tokens`, status-poll cost and synthesis cost. Configure `max_total_tokens` and `max_fanout_to_serial_ratio` to match workload economics. Optional input pricing can estimate cost.

## Usage
Run `python -m unittest tests/test_fanout_budgeter.py`. Evaluate a proposed fan-out with `python scripts/fanout_budgeter.py metrics.json`.

## Workflow
Measure serial/child bootstrap → diagnose fixed versus unique cost → hypothesize grouping/context/polling changes → run pre-spawn budget → execute one bounded plan → measure actual usage → verify acceptance quality → update baseline.

## Metrics
- Input/output tokens per task where available
- Cost per task
- Wall-clock latency
- Child fixed/bootstrap tokens
- Inherited context per child
- Polling turns/tokens
- Fanout-to-serial token ratio
- Context utilization
- Result quality and regression rate
- Prediction error

## Verification
No optimization claim is accepted without a before/after measurement. The same acceptance criteria must run on the optimized plan. Savings that create critical context loss or regress correctness are rejected.

## Safety
Never remove context needed for correctness merely to meet a budget. Keep retries and polling bounded. Do not expose prompt contents, credentials or private data in usage traces.

## Failure handling
Detection: actual usage exceeds budget, polling dominates, inherited context is unexpectedly large, or quality regresses. Evidence: telemetry plus acceptance results. Retry policy: maximum 2 optimization attempts and one recovery run. Fallback: last verified grouped/serial plan. Escalation: owner when latency requirements justify an explicit higher-cost tradeoff. Stop when budget cannot be met without correctness loss.

## Definition of Done
**Implemented:** pre-spawn budget gate and bounded recovery workflow are integrated.  
**Measured:** baseline and after-run tokens/cost/latency are captured.  
**Verified:** token/cost target is met or an explicit tradeoff is recorded, quality tests pass, and no critical context is lost.

## Customization
Replace token estimates with provider-specific telemetry and add output/reasoning/cache accounting when available. Keep the comparison grounded in actual local measurements rather than vendor-independent assumptions.
