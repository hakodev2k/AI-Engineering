# Skill: Cache-Preserving Reasoning Transition Analysis

## Purpose
Measure whether a GPT-6 Astra reasoning-effort change preserves reusable prompt-prefix caching without sacrificing task quality.

## Trigger
Run before adopting dynamic reasoning routing, after framework/Codex upgrades, or whenever reasoning effort is changed during a long-running Astra conversation.

## Inputs
Turn-level JSONL telemetry containing input tokens, cached input tokens, latency, effective effort, transition mode, and quality result; configured thresholds; model/API version.

## Preconditions
Use a representative repeated-prefix workload with at least three stable baseline turns and two post-change turns. Correctness checks MUST exist before optimizing token metrics.

## Required context
Model ID, Responses API integration path, current request-level `reasoning.effort`, transition implementation, cache telemetry semantics, and quality acceptance criteria.

## Allowed tools
Provider usage telemetry, application traces, read-only request/history inspection, `scripts/cache_transition_analyzer.py`, and unit tests.

## Constraints
- MUST NOT delete correctness-critical context to improve cache metrics.
- MUST distinguish request-level effort mutation from `configuration_update`.
- MUST compare before/after turns from the same representative workload.
- MUST NOT claim cache preservation from a single aggregate token total.

## Procedure
1. Freeze the stable prompt prefix and record the request-level reasoning effort used for the baseline.
2. Capture at least three baseline turns with input tokens, cached input tokens, latency, and quality outcome.
3. Change effective effort once. For compatible standard Astra flows, represent the change as a trusted `configuration_update` while keeping request-level effort unchanged.
4. Capture at least two post-change turns using the same workload characteristics.
5. Label the transition as `configuration_update` or `request_level` from observable request/history evidence.
6. Run the analyzer with configured thresholds.
7. If the analyzer reports a regression, diagnose whether cache loss, context growth, latency, or quality caused the failure.
8. Rework the integration and retry at most twice.
9. Hand results to the independent cache verifier.

## Decision points
- Request-level mutation observed when configuration update is required: fail migration verification.
- Cache-hit ratio drop exceeds threshold: investigate prefix invalidation before optimizing elsewhere.
- Input growth occurs but cache ratio remains stable: investigate legitimate context growth separately.
- Quality fails: reject optimization regardless of token savings.

## Expected output
A before/after report with transition type, cache-hit ratios, token and latency deltas, quality status, and verification decision.

## Metrics
Tokens/task, cached-input ratio, uncached-input tokens, cost/task when available, latency, context utilization, quality pass rate, and regression rate.

## Verification
The verifier must confirm both the transition representation and measured before/after metrics. A correctly emitted `configuration_update` is Implemented, not automatically Verified.

## Failure handling
Preserve telemetry, revert to the last verified reasoning configuration if needed, and bound retries to two. Escalate framework wiring defects instead of masking them by trimming required context.

## Stop conditions
Stop after verified thresholds are met with quality preserved, after two failed migration attempts, or immediately on quality regression that cannot be explained and corrected safely.
