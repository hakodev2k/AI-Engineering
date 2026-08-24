# Safety Testing and Regression Rules

## Purpose
Make known safety failures difficult to reintroduce.

## Scope
Covers unit-level safeguards, integration behavior, end-to-end agent flows, and model safety regressions.

## MUST
- Add regression coverage for validated material safety defects when a stable test can represent the failure.
- Test safeguards at the layer where they are enforced and end-to-end where composition matters.
- Keep critical tests deterministic enough to support release decisions, or define statistical acceptance criteria.
- Investigate safety-test flakiness rather than normalizing repeated retries.

## MUST NOT
- Delete failing safety tests solely to restore CI.
- Treat mocked behavior as sufficient evidence for controls dependent on real model or integration behavior.
- Accept a regression because aggregate quality improved elsewhere without explicit risk review.

## SHOULD
- Separate fast deterministic gates from slower statistical suites.
- Track failure clusters and recurring root causes across releases.

## Exceptions
Retiring a safety regression test requires evidence that the underlying risk is obsolete or covered more effectively elsewhere.

## Verification
Inspect CI results, test history, flaky-test records, coverage of prior incidents, and statistical acceptance calculations.
