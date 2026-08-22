# Cache-Aware Prompt Compression Gate

**Category:** Token

## Problem
Prompt compression can reduce raw input tokens while simultaneously destroying prefix-cache reuse. In prefix-sensitive providers this can increase effective cost or latency, especially when stable system instructions, tool schemas, or repository context are rewritten differently for every query.

## Evidence
See `evidence/research.md`. Current provider documentation confirms prefix caching and cached-token accounting, while recent 2026 research reports negative-ROI cases for query-aware compression that invalidates reusable prefixes.

## Existing approach
Teams commonly compress prompts for token count, rely on automatic provider caching, or manually arrange stable prefixes.

## Existing limitations
These approaches often lack a single acceptance gate combining cache-hit ratio, cache-write cost, latency, quality, and critical-context preservation.

## Proposed improvement
Profile prompt segments by stability, keep protected context intact, preserve reusable prefixes, benchmark bounded candidates, and reject any optimization that fails measurable cost/latency/quality gates.

## Architecture
- `evidence/research.md` — public evidence, gaps, root causes, metrics.
- `config/policy.json` — blocking thresholds and candidate limit.
- `skills/cache-aware-context-analysis.md` — reusable analysis procedure.
- `rules/token-cache-rules.md` — enforceable optimization constraints.
- `subagents/benchmark-verifier.md` — independent verifier.
- `workflows/measure-optimize-verify.md` — primary lifecycle.
- `workflows/failure-recovery.md` — bounded failure path.
- `hooks/pre-merge-regression-check.md` — deterministic merge gate.
- `scripts/cache_compression_gate.py` — executable metric comparison.

## Package tree
```text
cache-aware-prompt-compression-gate/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-merge-regression-check.md
├── rules/token-cache-rules.md
├── scripts/cache_compression_gate.py
├── skills/cache-aware-context-analysis.md
├── subagents/benchmark-verifier.md
└── workflows/
    ├── failure-recovery.md
    └── measure-optimize-verify.md
```

## Installation
Requires Python 3.9+ for the deterministic gate. No third-party Python packages are required.

## Configuration
Adjust thresholds in `config/policy.json` to match the organization's benchmark quality tolerance and economic target. Keep `max_critical_context_failures` at zero for required-context tests.

## Usage
1. Label prompt segments as stable, dynamic, or protected.
2. Run the baseline benchmark and aggregate metrics into JSON.
3. Apply one candidate compression/cache strategy.
4. Run the same benchmark and produce candidate JSON.
5. Execute:

```bash
python3 scripts/cache_compression_gate.py baseline.json candidate.json --policy config/policy.json --strict
```

6. If accepted, run the independent verification procedure in `subagents/benchmark-verifier.md`.

## Workflow
Observe → measure baseline → diagnose prefix/token waste → state hypothesis → implement one candidate → measure again → deterministic gate → independent verification → complete. Candidate exploration is bounded by policy.

## Metrics
Input tokens, cached tokens, cache-write tokens when available, effective cost/task, cache-hit ratio, TTFT, total latency, quality score, and critical-context failures.

## Verification
**Implemented:** segment rules, policy, deterministic gate, bounded workflows, and verifier instructions exist.

**Measured:** a deployment must supply baseline/candidate provider usage and quality results.

**Verified:** only when the gate accepts and the independent verifier reproduces the result with zero blocking failures.

## Safety
Correctness dominates token savings. Protected context cannot be automatically compressed. Missing usage data is never silently treated as zero.

## Failure handling
Detection uses the deterministic gate. Each failed candidate records evidence and a new hypothesis. Maximum attempts equal `max_candidates`; fallback is the last verified baseline. Contradictory provider accounting or ambiguous quality results escalate rather than trigger endless retries.

## Definition of Done
- Evidence documented.
- Baseline captured.
- Prompt segments classified.
- Candidate measured on identical cases.
- Cost/latency/cache thresholds pass.
- Quality regression is within policy.
- Zero critical-context failures.
- Independent verification passes.
- No missing blocking evidence remains.

## Customization
Extend aggregate JSON with provider-specific accounting, but preserve the required fields used by the gate. Add organization-specific quality evaluators without weakening protected-context rules.