# Context TTFT Knee Budget Guard

**Category:** Token

## Problem
A context can fit inside the model window yet be operationally too slow. Capacity-based compaction misses long-thread TTFT degradation and encourages reactive manual resets.

## Evidence
`evidence/research.md` documents current Codex reports: multi-minute TTFT around 210k tokens, progressive long-thread slowdown, and a request for stable per-model-request timing.

## Existing approach
Static fractions of the context window, prompt caching, summaries, or compaction near capacity.

## Existing limitations
Capacity does not establish a latency SLA, aggregate turn time mixes tool/approval work with model wait, and one static token threshold ignores model/workload differences.

## Proposed improvement
Calibrate a model/workload-specific soft token budget from observed p95 TTFT bins. Apply a safety margin, gate requests before crossing the budget, and verify that compaction/retrieval/thread handoff preserves correctness.

## Architecture / package tree
- `README.md`
- `evidence/research.md`
- `config/budget.json`
- `scripts/ttft_knee.py`
- `tests/test_ttft_knee.py`
- `skills/calibrate-context-latency-budget.md`
- `rules/token-budget-rules.md`
- `subagents/context-performance-analyst.md`
- `workflows/calibrate-enforce-verify.md`
- `hooks/pre-request-budget-check.md`

## Installation
Python 3.9+; no third-party packages.

## Configuration
Set `max_p95_ttft_ms`, `bin_size_tokens`, `minimum_samples_per_bin`, `safety_margin_ratio`, and a conservative default in `config/budget.json`.

## Usage
Analyze: `python scripts/ttft_knee.py telemetry.jsonl --config config/budget.json --output report.json`

Each JSONL row must contain `input_tokens`, `cached_input_tokens`, `ttft_ms`, `model`, and `workload`.

Gate: `python scripts/ttft_knee.py telemetry.jsonl --config config/budget.json --gate-tokens 150000 --model MODEL --workload coding`

Exit codes: `0` pass, `1` invalid telemetry/configuration, `2` soft-budget breach.

## Workflow
Use `workflows/calibrate-enforce-verify.md`. Maximum two budget-adjustment iterations per calibration cycle.

## Metrics
TTFT p50/p95 by context bin; input/cached tokens; cache ratio; tokens/task; cost/task where available; task-quality regression.

## Verification
Run `python -m unittest discover -s tests -p 'test_*.py'`. Production verification additionally requires representative before/after tasks and independent quality review.

## Safety
Never delete security instructions, authorization constraints, acceptance criteria, or evidence needed for correctness simply to reduce tokens. A reviewed exception may exceed the soft budget.

## Failure handling
Invalid model-timing telemetry blocks calibration. Insufficient samples produce no defensible knee. Quality regression requires rollback.

## Definition of Done
- **Implemented:** analyzer, gate, rules, workflow, and tests exist.
- **Measured:** baseline and post-change TTFT/token/quality metrics exist.
- **Verified:** p95 TTFT improves with no material correctness regression and an independent verifier signs off.

## Customization
Extend telemetry extraction per provider while normalizing to the documented fields and keeping separate budgets when models/workloads differ materially.
