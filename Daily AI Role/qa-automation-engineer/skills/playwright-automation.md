# Skill: Playwright UI Automation

## Purpose
Implement maintainable Playwright tests that verify user-visible behavior with deterministic synchronization and useful diagnostics.

## Trigger
Use when a browser flow crosses UI boundaries and is important enough to justify automated E2E or browser-level coverage.

## Inputs
- Approved scenarios and expected outcomes
- Application URL/environment
- Stable user/test-data strategy
- Existing Playwright conventions and fixtures
- Authentication mechanism
- Supported browsers/device profiles

## Preconditions
- The scenario belongs at UI/browser level.
- Required test data can be created or provisioned safely.
- Selectors and product semantics can be inspected.

## Procedure
1. Inspect existing config, fixtures, page objects/helpers, naming, tagging, retries, reporters, and CI sharding.
2. Express the scenario in business language before coding.
3. Create deterministic preconditions through API/fixture/setup when possible instead of UI setup.
4. Use user-facing locators (`getByRole`, `getByLabel`, `getByText`, explicit test ids when needed).
5. Interact with the UI using Playwright auto-waiting; wait on observable state, never arbitrary sleep.
6. Assert meaningful outcomes: visible state, URL, network-independent UI contract, persisted effect, or downstream observable result.
7. Isolate mutable test data per test/worker and make cleanup safe/idempotent.
8. Capture trace/screenshot/video on configured failure paths, not as a substitute for assertions.
9. Run focused test repeatedly enough to detect obvious nondeterminism, then run relevant suite.
10. Inspect failure diagnostics and final diff for brittleness.

## Decisions
- Prefer role/label locators; use test ids for ambiguous dynamic widgets.
- Page objects should expose domain actions or stable widgets, not mirror every DOM element.
- Mock network only when the test objective is UI logic and integration behavior is covered elsewhere.
- Avoid UI automation for simple API/business-rule checks.

## Constraints
- No `waitForTimeout` as synchronization except deliberate time-behavior tests with documented reason.
- Do not share mutable accounts across parallel workers.
- Do not assert hidden implementation details or brittle CSS chains.
- Do not bypass product authorization solely to make a scenario pass.

## Expected outputs
Playwright tests, required fixtures/helpers, test-data setup, diagnostics configuration updates when justified, and execution evidence.

## Quality criteria
Independent, repeatable, parallel-safe, understandable failure output, selectors resilient to cosmetic changes, no order dependency.

## Verification
Focused run, repeated focused run when risk warrants, relevant project/suite run, and CI-compatible command.

## Failure handling
Classify failures into product defect, test defect, environment defect, test-data defect, or unknown. Maximum two same-action retries during diagnosis; then stop retrying and gather evidence.

## Stop conditions
Escalate if stable automation requires unauthorized production access, destructive data operations, CAPTCHA bypass, security-control weakening, or acceptance criteria reinterpretation.
