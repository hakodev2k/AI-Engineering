# Prompt Cache Prefix Stability Profiler

## Category
Token / Performance

## Problem
Long-running/tool-heavy agents can lose prompt-cache reuse because structurally unstable early prompt segments change between otherwise similar tasks. The result is higher uncached input tokens, cost, and latency with little visibility into the first divergence.

## Evidence
See `evidence/research.md` for current 2026 public evidence, existing approaches, limitations, and root causes.

## Existing approach and limitation
Provider caching can report cache reads/writes, while teams manually arrange static content first. These signals usually do not explain which application-generated prefix segment changed or whether tool ordering/volatile fields caused the miss.

## Proposed improvement
Canonicalize cache-intended segments, fingerprint them independently, identify the first divergence, and combine that evidence with measured cache/token/latency/quality metrics. Optimize only when quality is preserved.

## Architecture
- `evidence/research.md` — evidence and root-cause analysis.
- `config/profile.json` — stability and regression thresholds.
- `skills/prefix-stability-analysis.md` — reusable analysis procedure.
- `rules/cache-stability-rules.md` — observable rules.
- `subagents/cache-benchmark-verifier.md` — independent verifier.
- `workflows/measure-stabilize-verify.md` — bounded optimization workflow.
- `hooks/pre-merge-cache-regression.md` — merge gate.
- `scripts/prefix_profiler.py` — deterministic segment profiler.
- `tests/verification-cases.md` — structural/performance/quality fixtures.

## Installation
Python 3.10+ only; no third-party dependencies.

## Configuration
Define cache-intended segments, volatile fields, tool ordering, cache/token thresholds, quality threshold, and comparison window in `config/profile.json`.

## Usage
Store redacted baseline and candidate request snapshots as JSON objects with `tools`, `system`, and `static_context`. Run:

`python3 scripts/prefix_profiler.py baseline.json candidate.json --config config/profile.json`

Exit `0` means no canonical prefix divergence; `3` means a divergence was found; `2` means invalid input/config. A `3` is diagnostic: an intentional change may be valid but requires measured cache/token/quality evidence.

## Workflow
Observe → Measure baseline → Diagnose first divergence → Form hypothesis → Stabilize smallest relevant segment → Measure again → bounded re-evaluation if needed → independent verification.

## Metrics
Cached-input ratio, uncached input tokens/task, cache writes/task, prefix-change rate, p50/p95 latency or TTFT, and quality regression rate.

## Verification
Run structural fixtures plus at least the configured request window. Compare the same task family/provider/model/settings where possible. Do not claim improvement from prompt length alone.

## Safety
Do not remove instructions or context required for security/correctness solely to increase cache reuse. Prefer fingerprints/redacted metadata over persistent raw prompts containing sensitive data.

## Failure handling
Detection: divergence or metric gate failure. Evidence: segment fingerprints and usage metrics. Retry: max two optimization cycles. Fallback: restore prior prompt construction. Escalation: platform/provider investigation. Stop: quality regression, missing reliable telemetry, or required-context loss.

## Definition of Done
**Implemented:** deterministic prompt construction/stability change is in place. **Measured:** before/after samples quantify cache, token, latency and quality. **Verified:** independent verifier reproduces the result and all configured gates pass.

## Customization
Extend segment extraction for provider-specific request formats, add CI aggregation across task families, or join fingerprints with OpenTelemetry traces while preserving the same quality and context-safety gates.
