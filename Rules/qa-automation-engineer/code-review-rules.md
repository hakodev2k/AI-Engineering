# Automation Code Review Rules

## Purpose
Ensure automation changes are reviewed for correctness, reliability, risk, and maintainability.

## Scope
Applies to test code, fixtures, CI configuration, test data tooling, and shared automation libraries.

## MUST
- Reviews MUST verify the test can fail for the intended defect, not only that it passes currently.
- Shared fixture/helper changes MUST assess blast radius and parallel behavior.
- Changes weakening assertions, skipping tests, increasing retries, or extending timeouts MUST include evidence and rationale.
- Security-sensitive test assets and credentials handling MUST be reviewed for least privilege and leakage risk.

## MUST NOT
- MUST NOT approve a test merely because CI is green.
- MUST NOT hide disabled coverage in unrelated refactoring.
- MUST NOT merge unexplained flaky behavior into required suites.

## SHOULD
- Prefer focused changes that separate product expectation updates from automation refactoring.
- Review failure messages and artifacts as part of test usability.

## Exceptions
Emergency changes require post-merge review when normal review is bypassed and policy permits it.

## Verification
Inspect diff, negative mutation or failure demonstration where practical, CI history, skipped tests, retry/timeout changes, and reviewer evidence.