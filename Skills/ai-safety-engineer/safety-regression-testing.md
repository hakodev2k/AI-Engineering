# Safety Regression Testing

## Purpose
Prevent previously fixed AI safety failures from reappearing after model, prompt, tool, data, or infrastructure changes.

## When to use
Use in CI/release pipelines and after every confirmed safety incident or red-team finding.

## Inputs
Historical failures, mitigations, expected behavior, system configuration, release candidate.

## Context to inspect
Changed components, nondeterministic settings, dependencies, model versions, policy layers, and evaluation harness.

## Core knowledge
AI regression tests must tolerate stochasticity without masking severe failures. Preserve attack intent while adding variants to avoid overfitting to exact strings.

## Procedure
1. Convert confirmed failures into minimal reproducible cases.
2. Add semantic variants and boundary cases.
3. Define pass criteria and severity-aware tolerances.
4. Record configuration and model metadata.
5. Run against baseline and candidate.
6. Investigate regressions and unexpected improvements.
7. Check utility regressions caused by mitigations.
8. Gate release on critical cases.
9. Periodically prune invalid tests without deleting historical evidence.

## Decision points
Use zero-tolerance gates for deterministic authorization failures; use statistical thresholds for stochastic response behavior.

## Common failure patterns
Exact-string assertions; flaky gates; deleting inconvenient tests; testing only model output while tools changed.

## Verification
Confirm known vulnerable versions fail representative cases and fixed versions pass within defined statistical confidence.

## Expected output
A maintainable safety regression suite integrated with release evidence.

## Stop conditions
Stop release when critical regression cases fail or test validity cannot be established.