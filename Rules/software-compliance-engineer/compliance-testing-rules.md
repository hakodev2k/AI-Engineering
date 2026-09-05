# Compliance Testing Rules

## Purpose
Ensure compliance controls are verified with repeatable tests rather than assertion alone.

## Scope
Applies to automated and manual tests for access, retention, logging, approvals, data handling, dependency policy, and other compliance controls.

## MUST
- Test cases MUST map to specific control objectives and expected outcomes.
- Critical controls MUST include negative or failure-path tests where practical.
- Test data and environments MUST be representative enough to validate the control being claimed.
- Failed compliance tests MUST produce owned remediation or approved exception records.

## MUST NOT
- MUST NOT mark a control effective based only on test execution success when assertions do not validate the required behavior.
- MUST NOT ignore flaky tests that protect material compliance requirements.

## SHOULD
- Automate deterministic control tests and retain results with release or assessment evidence.

## Exceptions
Manual verification is acceptable when automation is impractical, provided method, evidence, reviewer, and limitations are documented.

## Verification
Inspect test mappings, assertions, CI results, failure handling, evidence retention, and reviewer sign-off.