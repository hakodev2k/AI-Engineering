# Testing and Validation Rules

## Purpose
Detect semantic, optimization, codegen, diagnostic, and robustness regressions before release.

## Scope
Unit, conformance, integration, differential, randomized, fuzz, and end-to-end compiler tests.

## MUST
- Every correctness bug fix MUST add a regression test unless technically impossible and documented.
- Tests MUST separate compile success from runtime semantic validation when both matter.
- Target-specific behavior MUST be tested on an authoritative emulator, simulator, or hardware path where practical.
- Flaky compiler tests MUST be quarantined only with an owner and remediation plan.

## MUST NOT
- MUST NOT accept a test solely because compilation did not crash.
- MUST NOT normalize output so broadly that semantic differences disappear.
- MUST NOT use retries to conceal deterministic compiler defects.

## SHOULD
- Critical transformations SHOULD have both focused and randomized coverage.
- Tests SHOULD minimize reproductions while retaining the failing property.

## Exceptions
Missing automated coverage requires documented manual evidence and approval.

## Verification
Review CI results, coverage by compiler phase, fuzz findings, differential suites, and regression-test linkage.