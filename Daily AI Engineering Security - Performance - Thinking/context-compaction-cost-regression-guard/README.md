# Context Compaction Cost Regression Guard

**Category:** Token

## Problem
Compaction can be functionally successful while making an agent session more expensive or unstable by missing prompt caches, immediately reintroducing large dynamic context, triggering another compaction too soon, or dropping task-critical state.

## Evidence
Current evidence and source links are in `evidence/research.md`. The package is grounded in August 2026 reports from OpenAI Codex and Anthropic Claude Code plus current provider documentation on prompt caching and compaction.

## Existing approach
Provider-native compaction, automatic prompt caching, explicit cache breakpoints, manual compaction at task boundaries, and context-usage meters.

## Existing limitations
These mechanisms do not automatically prove that a particular compaction path retained cache locality, reduced post-compaction context, avoided repeated metadata, or preserved required task state.

## Proposed improvement
Use normalized telemetry plus a deterministic release gate that treats compaction as an optimization only when it improves measurable token behavior while retaining critical markers.

## Architecture
```text
context-compaction-cost-regression-guard/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── post-compaction-gate.md
├── rules/
│   └── token-budget-and-cache.md
├── scripts/
│   └── compaction_regression_guard.py
├── skills/
│   └── compaction-regression-analysis.md
├── subagents/
│   └── verification-agent.md
├── tests/
│   └── test_compaction_regression_guard.py
└── workflows/
    └── measure-diagnose-optimize.md
```

## Installation
Requires Python 3.10+ and only the standard library.

## Configuration
The guard defaults are intentionally conservative and configurable from CLI:
- maximum post/pre token ratio: `0.35`
- maximum uncached-input ratio: `0.40`
- maximum repeated payload bytes: `65536`
- minimum turns until the next compaction: `8`

Tune thresholds from observed baselines, not preference.

## Usage
1. Capture a representative baseline and candidate compaction trace.
2. Normalize candidate telemetry into JSON with these fields: `pre_tokens`, `post_tokens`, `uncached_input_tokens`, `cached_input_tokens`, `repeated_payload_bytes`, `turns_to_next_compaction`, `critical_markers_expected`, `critical_markers_retained`.
3. Run `python scripts/compaction_regression_guard.py telemetry.json`.
4. Run `python -m unittest tests/test_compaction_regression_guard.py`.
5. Follow `workflows/measure-diagnose-optimize.md` and require independent verification.

## Workflow
Observe → measure baseline → diagnose → form hypothesis → implement → measure again → deterministic gate → one bounded correction if needed → independent verification.

## Metrics
Tokens/task, cached/uncached input ratio, post/pre token ratio, repeated payload bytes, turns between compactions, critical-marker retention, and latency.

## Verification
`tests/test_compaction_regression_guard.py` exercises healthy behavior, uncached-input regression, compaction thrashing, and critical-context loss. The implementing agent is not the only verifier.

## Safety
Do not use production secrets or private prompts in benchmark fixtures. Never delete context required for correctness, authorization, or security merely to meet token targets.

## Failure handling
**Detection:** non-zero guard exit, missing telemetry, or failed test.  
**Evidence:** normalized metrics and non-sensitive fixture identifiers.  
**Retry policy:** one corrective change and rerun.  
**Maximum retries:** 1.  
**Fallback:** restore the previous compaction behavior.  
**Escalation:** provider-specific cache/accounting ambiguity or lost critical markers.  
**Stop condition:** second failed candidate or any security/correctness regression.

## Definition of Done
- Evidence documented.
- Baseline captured.
- Existing limitations identified.
- Candidate implementation measured.
- Unit tests pass.
- Before/after comparison is complete.
- Critical markers are retained.
- Guard reports pass.
- Independent verifier confirms the result.
- No blocking issue remains.

## Status semantics
**Implemented** means the guard and integration procedure exist.  
**Measured** means a real baseline/candidate trace has been collected.  
**Verified** means tests pass and an independent reviewer reproduces the passing comparison.

## Customization
Add provider adapters outside the core guard while preserving the normalized schema. Extend quality markers for your workflow rather than lowering token thresholds to hide correctness regressions.
