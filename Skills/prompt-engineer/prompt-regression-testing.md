# Prompt Regression Testing

## Purpose
Prevent prompt, model, tool, schema, and context changes from reintroducing known failures or degrading important behavior.

## When to use
Use in CI/release gates and after every confirmed production prompt failure.

## Inputs
Versioned prompts, models/configuration, historical failures, representative eval data, graders, and thresholds.

## Context to inspect
Inspect prior incidents, change history, flaky eval cases, judge versions, and current release process.

## Core knowledge
Generative outputs vary, so regression tests should assert semantic invariants rather than exact text unless exact text is required. Critical cases deserve stronger thresholds than cosmetic behavior.

## Procedure
1. Convert each confirmed failure into the smallest durable regression case.
2. Tag cases by capability, risk, language, and source.
3. Define deterministic assertions where possible.
4. Use calibrated rubric/judge assertions for semantic properties.
5. Separate must-pass critical tests from statistical quality suites.
6. Run candidate and baseline under controlled settings.
7. Investigate flaky cases instead of weakening thresholds blindly.
8. Gate release on critical failures and material aggregate regressions.
9. Keep test data independent from prompt examples.
10. Retire obsolete tests only with documented rationale.

## Decision points
Use exact output assertions for schemas/enums; semantic grading for open text. Repeat stochastic cases enough to estimate instability when it matters.

## Common failure patterns
Snapshot-testing prose; deleting inconvenient failures; eval leakage into examples; unversioned judges; passing averages while critical cases fail.

## Verification
The suite catches a deliberately reintroduced known bug, runs reproducibly enough for release decisions, and reports failures by meaningful slice.

## Expected output
Versioned regression suite, grading rules, release thresholds, and failure diagnostics.

## Stop conditions
Stop release when critical regressions fail, judge drift is unresolved, or test infrastructure cannot reproduce the effective runtime.