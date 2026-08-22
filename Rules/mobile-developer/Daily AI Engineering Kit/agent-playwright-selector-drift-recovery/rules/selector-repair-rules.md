# Selector Repair Rules

## MUST
- Reproduce the failure or preserve equivalent Playwright trace evidence before editing.
- Record the original locator and exact failure reason.
- Prefer semantic locators in the order configured by `config/selector-policy.yaml`.
- Prove a replacement locator uniquely identifies the intended element in the relevant UI state.
- Keep the production behavior and assertion intent unchanged unless the requirement explicitly demands a behavior change.
- Run the targeted test and then the full containing spec after a repair.
- Preserve evidence for every failed repair attempt.
- Validate the final repair report with `scripts/validate-repair-report.py`.
- Stop after at most 2 repair attempts.
- Require explicit human approval before deleting/skipping a failing test, weakening an assertion solely to pass, writing production test data, destructive cleanup, or weakening a security check.

## MUST NOT
- Add arbitrary `waitForTimeout` sleeps to hide locator instability.
- Replace a precise assertion with a weaker assertion merely to make the test green.
- Use absolute XPath, `nth-child`, generated/hashed class chains, or `.nth()` when a stable semantic locator is available.
- Modify unrelated tests or production components during a selector-only repair.
- Treat a passing targeted test as complete without running the full containing spec.
- Retry indefinitely.
- Increase permissions or access production resources to unblock the repair.
- Present a candidate locator as verified before retest evidence exists.

## SHOULD
- Reuse page-object locators when the repository already centralizes them.
- Prefer role + accessible name for interactive controls.
- Prefer labels for form fields.
- Use test IDs only when user-facing semantics are insufficient and the repository already accepts test IDs.
- Record why a lower-priority locator was chosen when semantic alternatives were rejected.
- Keep repairs localized to the smallest reusable abstraction that represents the changed element.
