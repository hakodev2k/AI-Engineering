# Skill: Quarantine Decision

## Purpose
Make quarantine a controlled, temporary risk decision rather than an automatic response to nondeterministic tests.

## When to use
Only after `triage-flaky-test.md` has produced verified `flaky` evidence.

## Inputs
Flake result, investigation report, ownership, affected CI/release path, business impact, and proposed quarantine scope.

## Preconditions
At least one passing and one failing run are preserved. Root-cause work cannot be completed within the immediate delivery window or the flaky test is causing material pipeline instability.

## Procedure
1. Confirm the test is actually flaky and not consistently failing.
2. Identify what protection is lost if the test is skipped or quarantined.
3. Prefer containment that keeps the test running in a non-blocking lane over complete disablement.
4. Define exact test selector, owner, reason, evidence paths, expiry/removal condition, and tracking issue/reference.
5. Assess whether quarantine could hide a security, data-integrity, migration, payment, authorization, or other high-risk regression. If yes, do not quarantine without explicit risk-owner approval.
6. Request human approval before editing skip/ignore/quarantine configuration.
7. After approval, apply the narrowest quarantine and verify unrelated tests remain blocking.
8. Record the approved scope and removal criteria in the investigation report.

## Expected output
Decision `fix-now`, `approved-temporary-quarantine`, or `no-quarantine`, with evidence and approval reference when applicable.

## Verification
Quarantine is valid only when it targets the intended test(s), leaves unrelated failures blocking, has an owner and removal condition, and approval is recorded.

## Failure handling
If approval is denied or unavailable, leave CI behavior unchanged and escalate the flaky failure. Never silently convert it into a pass.

## Stop conditions
Stop before any quarantine edit until approval exists; stop if scope cannot be isolated; stop if quarantine would mask a high-risk control without explicit risk acceptance.
