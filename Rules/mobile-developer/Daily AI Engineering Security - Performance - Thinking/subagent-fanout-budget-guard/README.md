# Subagent Fan-out Budget Guard

**Category:** Performance

## Problem
Parallel subagents can improve throughput, but each child may inherit or reconstruct large context, repeat compaction, retry from cold state, duplicate work, or recursively spawn more agents. The result can be higher latency, token usage, storage, and quota consumption without proportional useful work.

## Evidence
See `evidence/research.md`. Recent public reports include Codex #33196 (parallel review subagents with extreme token amplification/repeated compaction), Claude Code #56068 and #45660 (full-parent/session duplication causing large token drain), and #80253 (workflow subagents retrying from blank context and repeating completed work).

## Existing approach
Teams cap concurrency, cap steps, use isolated subagents, or manually watch usage. These controls are incomplete when the expensive part is inherited context plus retries/compaction rather than the nominal number of agents.

## Proposed improvement
Estimate fan-out cost before spawn, require non-overlapping delegation, cap concurrency and aggregate predicted tokens, account for retries, and reconcile predicted versus observed usage after completion. Reject or serialize fan-out that does not fit the budget.

## Package tree
```text
subagent-fanout-budget-guard/
├── README.md
├── evidence/research.md
├── config/budget.json
├── skills/estimate-fanout-budget.md
├── rules/subagent-budget-rules.md
├── subagents/budget-controller.md
├── workflows/delegate-with-budget.md
├── hooks/pre-spawn.md
├── scripts/fanout_budget.py
└── tests/test_fanout_budget.py
```

## Installation
Python 3.10+ only; no third-party dependencies.

## Configuration
Edit `config/budget.json` for your model/account. Thresholds are policy inputs, not universal defaults.

## Usage
```bash
python scripts/fanout_budget.py check \
  --config config/budget.json \
  --parent-context-tokens 120000 \
  --agents 4 \
  --expected-work-tokens 20000 \
  --max-retries 1
```
Exit `0` allows fan-out; `2` rejects/requests redesign; `3` means invalid input/config.

## Workflow
Estimate → classify delegation overlap → budget → spawn bounded children → observe actual usage → compare predicted/actual → adjust future policy.

## Metrics
Aggregate tokens/task, useful outputs/child, duplicate delegation rate, retry rate, compaction count, wall-clock latency, token amplification ratio, predicted/actual error, serial fallback rate.

## Verification
Run `python -m unittest tests/test_fanout_budget.py`. Validate with recorded production traces before enabling as a hard gate.

## Safety
The guard never launches agents itself. It only evaluates a proposed fan-out. Unknown usage data should fail closed for expensive fan-outs but may allow a configurable small safe default.

## Failure handling
One deterministic config/input retry. Do not repeatedly respawn a failed child from blank context without preserved checkpoint evidence.

## Definition of Done
Baseline cost observed; proposed fan-out estimated; overlap checked; aggregate/concurrency budget enforced; retries bounded; actual usage reconciled; regression threshold verified.

## Customization
Adapters can supply provider-specific cached-input accounting, child-context inheritance ratios, pricing, or per-agent workload estimates.