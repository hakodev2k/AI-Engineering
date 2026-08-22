# CI Execution Rules

## Purpose
Make automated test execution in CI reliable, actionable, and appropriately gated.

## Scope
Applies to pipelines, test selection, parallelization, artifacts, exit status, and quality gates.

## MUST
- CI MUST fail when required test gates fail or cannot execute reliably.
- Test selection MUST be traceable to risk and MUST not silently omit required coverage.
- Parallelization MUST preserve isolation and deterministic result aggregation.
- CI MUST publish machine-readable results and diagnostic artifacts needed for failed required suites.

## MUST NOT
- MUST NOT convert test failures to successful pipeline status without explicit approved policy.
- MUST NOT discard failed-test artifacts before investigation windows expire.
- MUST NOT rely on local-only configuration for required CI behavior.

## SHOULD
- Separate fast blocking suites from slower risk-based suites while preserving ownership.
- Track queue, setup, execution, and retry time to identify pipeline waste.

## Exceptions
Temporary non-blocking treatment requires owner, reason, risk control, expiry, and approval.

## Verification
Inspect pipeline definitions, exit codes, selected tests, artifacts, parallel behavior, and gate history.