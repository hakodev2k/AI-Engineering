# Pre-Release Evaluation Gates

## Purpose
Define and enforce evidence-based quality gates that prevent AI changes from reaching production when correctness, safety, robustness, or product utility regresses beyond agreed thresholds.

## When to use
Use before any release that can alter model behavior, prompts, retrieval, tools, or routing.

## Inputs
Evaluation suites, baselines, acceptance thresholds, model/prompt versions, risk categories, test results, known limitations.

## Preconditions
Evaluation datasets are representative enough for the release scope and leakage risks are understood.

## Context to inspect
Historical production failures, segment-level performance, safety tests, tool-use scenarios, structured-output tests, latency and cost benchmarks.

## Core knowledge
Aggregate scores can hide severe regressions in rare or high-risk segments. Release gates should distinguish blocking metrics from advisory metrics and should account for statistical variance.

## Procedure
1. Map release risks to evaluation suites.
2. Establish a last-known-good baseline.
3. Define blocking thresholds and tolerance bands.
4. Run deterministic contract tests and stochastic behavioral evaluations.
5. Analyze results by important user and risk segments.
6. Investigate regressions rather than averaging them away.
7. Review safety, security, and tool-use evaluations separately.
8. Confirm latency and cost remain acceptable.
9. Record exceptions with explicit approval and expiry.
10. Attach gate results to the release manifest.

## Decision points
Block on severe localized regressions even if global averages improve. Require repeated trials when model variance is material.

## Common failure patterns
Cherry-picked examples, stale benchmarks, test contamination, thresholds changed after seeing results, and using one scalar score for all risks.

## Verification
Re-run a reproducible subset independently and confirm gate outcomes match the recorded decision.

## Expected output
A signed-off evaluation gate report with pass/fail status, regressions, exceptions, and evidence.

## Stop conditions
Stop the release when blocking thresholds fail or evaluation evidence is too weak to assess a critical risk.