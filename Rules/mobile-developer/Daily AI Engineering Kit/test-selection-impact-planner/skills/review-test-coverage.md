# Skill: Review Test Selection Coverage

## Purpose
Independently review whether the selected tests provide sufficient evidence for the observed change impact.

## Inputs
- Validated test plan.
- Change inventory.
- Test execution results.
- Policy.
- Repository evidence used by the planner.

## Preconditions
The reviewer must not be the sole author of the implementation or the test plan for high-risk changes.

## Procedure
1. Confirm plan revision and change fingerprint match the current diff.
2. Re-check high-risk triggers independently.
3. Inspect unresolved or low-confidence impact entries.
4. Verify mandatory suites were not removed by optimization.
5. Compare selected tests with affected components and risk classes.
6. Check execution results for skipped, filtered, quarantined, or not-discovered tests.
7. Require broader tests when confidence is below policy thresholds.
8. Record review status as `verified`, `broaden-required`, or `blocked`.
9. Preserve reasons and evidence; never mark a failed or unexecuted suite as covered.

## Verification
The review is complete only when all changed paths are covered by either targeted evidence or an explicit broader fallback, all mandatory suites ran, and no blocking unknown-impact remains.

## Failure handling
If execution evidence is missing or stale, return `blocked`. If only mapping confidence is weak, return `broaden-required` with the exact fallback suite.

## Stop conditions
Stop when the plan no longer matches the current diff, a critical suite failed, or required broader tests cannot be run.