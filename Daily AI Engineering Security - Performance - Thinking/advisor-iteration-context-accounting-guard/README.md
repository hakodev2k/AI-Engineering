# Advisor Iteration Context Accounting Guard

**Category:** Token

## Problem
Multi-iteration model requests expose several valid token quantities with different meanings. For Anthropic Advisor requests, top-level executor input fields are cumulative across executor iterations; they are not the size of the final executor prompt. Using those cumulative fields as live context occupancy can make a half-full context look full, trigger premature compaction, increase latency/token usage, and disrupt long-running agents or subagents.

## Evidence
`evidence/research.md` documents current public evidence. Anthropic's Advisor documentation explicitly says to use `usage.iterations[]` for per-iteration breakdown and explains that top-level executor inputs sum across executor iterations. Open Claude Code issues #81620 and #84738 provide transcript-level July-August 2026 reproductions where Advisor turns roughly doubled apparent context and triggered early auto-compaction; issue #53065 independently reports the same shape.

## Existing approach
Runtimes commonly consume provider top-level usage, cached-input fields, context-window thresholds, and auto-compaction. Advisor adds a structured iteration array that separates executor and advisor sub-inference usage.

## Existing limitations
Cumulative processing, current occupancy, and billable cost can all be numerically correct while answering different questions. Naive consumers often collapse them into one `tokens` value. Cached-input fields and subagent-specific paths make the mismatch harder to detect.

## Proposed improvement
Normalize token telemetry at the provider boundary into explicit semantic fields. When recognized iterations are available, current occupancy comes from the final executor/message iteration. Cumulative executor processing and Advisor processing remain separate. Compaction consumes only occupancy plus the configured reserve/threshold. Unknown iteration shapes fail to an explicit compatibility state.

## Architecture
- `evidence/research.md` — current evidence, existing approaches, gaps, root causes.
- `rules/token-semantics.md` — enforceable metric-semantics rules.
- `skills/usage-normalization.md` — evidence-driven normalization procedure.
- `subagents/verification-agent.md` — independent verification contract.
- `workflows/measure-normalize-verify.md` — bounded measure/diagnose/implement/retest flow.
- `hooks/precompact-accounting-check.md` — deterministic pre-compaction guard.
- `scripts/normalize_usage.py` — dependency-free usage normalizer and decision helper.
- `tests/test_normalize_usage.py` — executable regression fixtures.

## Package tree
```text
advisor-iteration-context-accounting-guard/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── precompact-accounting-check.md
├── rules/
│   └── token-semantics.md
├── scripts/
│   └── normalize_usage.py
├── skills/
│   └── usage-normalization.md
├── subagents/
│   └── verification-agent.md
├── tests/
│   └── test_normalize_usage.py
└── workflows/
    └── measure-normalize-verify.md
```

## Installation
Python 3.9+ is sufficient; the executable uses only the standard library. Copy the package directory intact.

## Configuration
Provide the effective model context window and the compaction threshold percentage used by the host. Inputs may be either a raw `usage` JSON object or an object containing a top-level `usage` member. Sanitize transcripts before creating fixtures.

## Usage
Normalize a captured response:

```bash
python scripts/normalize_usage.py usage.json --context-window 1000000 --threshold-pct 95
```

Run regression tests:

```bash
python -m unittest tests/test_normalize_usage.py
```

The script emits `occupancy_tokens`, `occupancy_source`, `top_level_input_like_tokens`, `cumulative_executor_input_tokens`, `advisor_input_tokens`, `inflation_ratio`, `threshold_tokens`, and `should_compact`. Exit code `0` means normalized successfully; `1` means invalid or unsupported input.

## Workflow
Follow `workflows/measure-normalize-verify.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Implement normalization → Measure again → Independently verify. Retry loops are capped at two remediation cycles.

## Metrics
- False compactions per 100 turns.
- Median normalized occupancy at compaction.
- Top-level/curr﻿ent-occupancy inflation ratio.
- Compactions per task.
- Tokens/task and latency/task.
- Unknown/unsupported usage-shape count.
- Normalization regression count.

## Verification
**Implemented** means normalized semantic fields exist and compaction reads `occupancy_tokens`. **Measured** means baseline and post-change decisions/ratios are recorded on the same fixtures. **Verified** means independent tests prove Advisor input is disjoint, final executor occupancy is correct, ordinary single-iteration behavior remains compatible, and compaction occurs only when normalized occupancy reaches the configured threshold.

## Safety
This package does not request or expose hidden reasoning. It does not delete context simply to save tokens. Thresholds and output/safety reserves must not be loosened to hide an accounting defect. Sanitized telemetry is required for evidence and fixtures.

## Failure handling
Detection: unsupported iteration type, malformed/negative token field, unexplained occupancy/cost divergence, or early-compaction reproduction. Evidence: sanitized usage shape, model window, threshold, expected and observed semantic metrics. Retry: maximum two adapter fixes. Fallback: explicit documented compatibility path when iterations are absent; unknown iteration types do not auto-map. Escalation: provider-adapter owner/human reviewer. Stop: after two failed cycles or when provider semantics cannot be verified authoritatively.

## Definition of Done
- Current public evidence documented.
- Baseline premature-compaction behavior captured.
- Existing semantic mismatch identified.
- Normalizer implemented and wired to compaction.
- Advisor/sub-inference usage separately attributed.
- Before/after metrics collected.
- Regression tests pass.
- Independent verifier confirms expected occupancy and decisions.
- No correctness-critical context was removed to improve token metrics.
- No blocking semantic ambiguity remains.

## Customization
Add provider adapters by mapping their documented iteration types to explicit semantic buckets. Do not guess unknown shapes. Preserve the distinction between occupancy, cumulative processing, cost, cache-read/cache-write, and sub-inference usage.
