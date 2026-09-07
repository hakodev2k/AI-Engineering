# Security Regression Testing Rules

## Purpose
Convert validated vulnerabilities into durable regression protection without encoding unsafe assumptions or brittle exploit details.

## Scope
Applies to automated and manual regression tests derived from vulnerability research across applications, libraries, protocols, infrastructure, firmware, and services.

## MUST
- A regression test MUST assert the security invariant violated by the original defect, not merely a superficial symptom when a stronger assertion is practical.
- Tests MUST be deterministic enough for routine CI or release validation, or their environmental requirements MUST be explicitly documented.
- Test fixtures MUST use synthetic or sanitized data unless real sensitive data is specifically required and approved.
- Regression coverage MUST include the original trigger and meaningful boundary variants where the root cause indicates broader exposure.
- Security tests that manipulate privileges, identities, files, network state, or configuration MUST clean up after execution.
- Tests MUST identify required feature flags, platform conditions, versions, and trust boundaries that affect applicability.
- High-risk exploit behavior MUST be reduced to benign assertions where equivalent validation is possible.
- Test failures MUST preserve sufficient diagnostics to distinguish a security regression from environmental instability.

## MUST NOT
- MUST NOT embed reusable production secrets, real customer identifiers, or live credentials in regression fixtures.
- MUST NOT add flaky tests and then normalize retries as the primary correctness mechanism.
- MUST NOT encode weaponized payload behavior when a minimal safe trigger can validate the same invariant.
- MUST NOT silently skip security tests on relevant builds without a visible reason.
- MUST NOT assume one regression test covers structurally related variants without evidence.

## SHOULD
- Place tests at the lowest layer that faithfully reproduces the violated boundary while retaining integration coverage where required.
- Track security regression tests as part of normal release gates for affected components.
- Preserve links from tests to the underlying defect or security requirement when project conventions allow.

## Exceptions
A security finding may remain manual-only when automation would create disproportionate danger, cost, or nondeterminism; the manual procedure, owner, cadence, and evidence requirements must then be documented.

## Verification
Inspect test code, fixtures, CI results, skip conditions, cleanup behavior, and failure diagnostics. Confirm the test fails on a known vulnerable state and passes on the validated remediation where such comparison is safely available.