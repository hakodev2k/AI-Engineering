# Skill — Compaction Threshold Calibration

## Purpose
Derive a model/provider-aware compaction trigger from effective usable context and required response runway.

## Trigger
Session start, model/provider switch, metadata change, repeated near-limit errors, or before a long tool-heavy workflow.

## Inputs
Raw context window, effective context percentage, optional provider hard limit, response reserve, target utilization, minimum headroom, current prompt tokens.

## Preconditions
All token values refer to the same model/provider route. Estimates must be labeled and use conservative reserves.

## Required context
Model metadata and current occupancy only. Hidden chain-of-thought is not needed.

## Allowed tools
Token counters, provider metadata, JSON parsing, deterministic arithmetic, telemetry readers.

## Constraints
- MUST NOT use raw context window as the sole compaction basis.
- MUST preserve correctness-critical context.
- MUST reserve completion/runway tokens.
- MUST recompute after model/provider switches.
- SHOULD record provenance of measured token inputs.

## Procedure
1. Validate window/reserve values.
2. Compute `effective_window = floor(raw_window * effective_percentage)`.
3. If a provider hard limit exists, take the minimum.
4. Compute `required_runway = max(response_reserve, minimum_response_runway)`.
5. Compute `safety_ceiling = effective_window - required_runway`.
6. Compute target-ratio and minimum-headroom ceilings.
7. Recommended trigger is the minimum of all ceilings.
8. Compare configured threshold/current occupancy to the recommendation.
9. Emit reason codes for late, aggressive, provider-capped, or over-trigger states.
10. Re-measure quality, latency, tokens/task, and failures after host changes.

## Decision points
- Required runway >= effective window: configuration error.
- Current prompt >= recommended trigger: context reduction is due before another large continuation where safely supported.
- Configured threshold > recommendation: late-compaction risk.
- Materially lower threshold: quality regression testing required.

## Expected output
JSON with effective window, runway, safety ceiling, recommended trigger, headroom, status, and reason codes.

## Metrics
Tokens/task, utilization at compaction, failure rate, cost/task, latency/task, quality regression rate.

## Verification
`python -m unittest tests/test_context_calibrator.py`

## Failure handling
Invalid/contradictory metadata exits 1. Do not guess a larger window. Use a conservative known route limit or stop calibration.

## Stop conditions
One recalculation per metadata change. Benchmark tuning: maximum three candidate thresholds before human review.
