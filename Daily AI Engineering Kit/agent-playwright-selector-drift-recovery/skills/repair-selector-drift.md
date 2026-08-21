# Skill: Repair Playwright Selector Drift

## Purpose
Repair Playwright failures caused by UI locator drift while preserving the original user-visible behavior and assertion intent.

## When to use
Use when a test previously passed and now fails because an element cannot be found, resolves ambiguously, or a DOM refactor invalidated a brittle locator.

Do not use when the product behavior itself is incorrect, the test expectation changed legitimately, or the failure is caused by network, authentication, test-data, timing, or environment instability.

## Inputs
- failing test file and test name
- Playwright error output and trace/screenshot/DOM evidence when available
- current application DOM or accessible tree
- repository locator conventions
- `config/selector-policy.yaml`

## Preconditions
- The failure is reproducible or supported by equivalent trace evidence.
- The agent can inspect the test and current UI structure.
- No approval-required action is needed merely to investigate.

## Allowed tools
Repository search/read, Playwright test runner, trace viewer output, screenshots, browser DOM/accessibility inspection, `scripts/scan-selectors.py`, and `scripts/validate-repair-report.py`.

## Constraints
- Preserve assertion semantics.
- Prefer accessible/user-facing locators over implementation details.
- Do not change production UI solely to make a test pass unless the product requirement explicitly calls for it.
- Maximum repair/retest attempts: 2.

## Procedure
1. Reproduce the smallest failing test or inspect equivalent trace evidence.
2. Capture the exact old locator, failure message, target element role/name/text/label, and nearby DOM/accessibility context.
3. Determine whether failure is selector drift rather than product behavior, timing, data, or environment failure.
4. Run `python scripts/scan-selectors.py <test-root> --json-out selector-scan.json` and note brittle patterns relevant to the failing locator.
5. Search nearby tests/page objects for established locator conventions for the same component.
6. Build candidate locators in this order unless evidence justifies otherwise: `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`, `getByTestId`, then stable CSS.
7. Confirm the candidate uniquely targets the intended element in the current UI state.
8. Modify only the smallest relevant test/page-object locator. Do not weaken assertions or add arbitrary sleeps.
9. Run the targeted failing test. If it fails for the same locator reason, use the preserved evidence to make at most one additional repair attempt.
10. When the targeted test passes, run the complete containing spec/file.
11. Inspect the diff for unrelated edits, assertion weakening, skipped tests, broad timeouts, or new brittle selectors.
12. Produce a report matching `schemas/repair-report.schema.json` and validate it with `python scripts/validate-repair-report.py <report.json>`.

## Expected output
A minimal locator repair plus a structured report containing failure evidence, old and new locator, risk, retest results, and final status.

## Verification
Verified means both the targeted test and full containing spec pass, the report validator passes, no approval-required shortcut was used, and the diff preserves assertion intent.

## Failure handling
- Same selector failure after 2 attempts: stop as `blocked` with both candidate attempts and traces preserved.
- Different product/assertion failure after locator repair: stop selector work and hand off as a separate behavior defect.
- Tool/environment failure: retry the tool once only if transient; otherwise preserve command/error output and stop.
- Permission failure: do not elevate privileges; stop and report required access.

## Stop conditions
Stop when verified, when two repair attempts fail, when evidence shows the problem is not selector drift, or immediately before an approval-required action.
