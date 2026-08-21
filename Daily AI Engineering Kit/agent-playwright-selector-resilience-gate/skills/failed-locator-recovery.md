# Failed Locator Recovery Skill

## Purpose
Diagnose Playwright locator failures without turning transient or product failures into permanently weak tests.

## Inputs
Failure output, trace/screenshot/video when available, test source, recent UI changes, expected behavior.

## Process
1. Classify failure: element absent, multiple matches, hidden/disabled, navigation/state race, stale assumption, product regression, environment issue, or locator brittleness.
2. Preserve exact failing step and page evidence.
3. Confirm the prerequisite UI state before changing the locator.
4. Check whether the expected element exists and is actionable in trace/DOM evidence.
5. If state/race is the cause, wait on a meaningful observable condition rather than adding sleep.
6. If selector brittleness is the cause, apply `selector-hardening.md`.
7. If the product behavior is wrong, stop and report a product defect; do not rewrite the assertion to match the defect.
8. Run static gate and affected tests twice.
9. Allow at most two recovery revisions before escalation.

## Forbidden shortcuts
No `waitForTimeout`, arbitrary timeout inflation, broad `.first()`, `.last()`, `.nth()` without evidence, catch-and-ignore, or assertion removal.

## Verification
Failure classification is evidence-backed, no blocking selector finding remains, and repeated test execution proves the recovery.

## Failure handling
Transient browser startup/tool failure may be retried once with evidence preserved. Repeated environment failure stops the workflow. Two unsuccessful locator/state revisions stop and escalate.
