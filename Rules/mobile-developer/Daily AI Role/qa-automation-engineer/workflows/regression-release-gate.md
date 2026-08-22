# Workflow: Regression and Release Gate

## Trigger
Release candidate, hotfix, dependency/configuration change, or a request for regression confidence.

## Goal
Provide an evidence-based release recommendation without running unnecessary suites blindly.

## Inputs
Change set, release scope, test inventory, environment, known defects, deadline.

## Stages
1. Coordinator ranks release risk and urgency.
2. Repository Explorer maps changed surfaces and existing coverage.
3. Coordinator applies `skills/regression-analysis.md`.
4. Focused impacted suites run first.
5. Independent suites that cover separate components may run in parallel when data/environment isolation is safe.
6. Failures are triaged into product/test/environment/data/unknown.
7. Automation gaps for high-risk behavior are implemented when time permits; otherwise risk is explicit.
8. Test Reviewer evaluates evidence sufficiency and regression gaps.
9. Verification Agent consolidates results and checks skipped/quarantined critical tests.
10. Coordinator recommends **pass**, **pass-with-known-risk**, or **block**. Human release owner decides when policy requires.

## Shared context
Change-impact map, environment, build/commit identity, known issues, acceptance criteria.

## Retry policy
No blind rerun-to-green. One diagnostic rerun is allowed when evidence suggests transient infrastructure; repeated nondeterminism follows flaky workflow.

## Failure path
Critical confirmed regression => block recommendation. Environment prevents mandatory evidence => block or human-approved risk acceptance.

## Definition of Done
Release recommendation is traceable to scope, executed evidence, exclusions, defects, and risk ownership.
