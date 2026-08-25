# Security Testing Rules

## Purpose
Provide repeatable evidence that security controls resist expected misuse and regression.

## Scope
Applies to unit, integration, end-to-end, adversarial, fuzz, and manual security testing.

## MUST
- Critical authentication, authorization, validation, tenant-isolation, and security-boundary controls MUST have negative tests where deterministic testing is practical.
- Security regression tests MUST reproduce previously fixed material vulnerabilities when safe and stable to automate.
- Tests MUST cover failure modes, malformed inputs, boundary values, and unauthorized actors, not only valid paths.
- Security test environments and fixtures MUST avoid live secrets and uncontrolled production data.
- Test findings MUST preserve enough evidence to reproduce or bound the issue without unnecessarily exposing sensitive exploit material.

## MUST NOT
- MUST NOT claim a control is secure solely because happy-path tests pass.
- MUST NOT make destructive or intrusive tests against production without explicit authorization, scope, and safety controls.
- MUST NOT use flaky security tests as a permanent release signal without remediation or justified quarantine.

## SHOULD
- SHOULD place tests at the lowest layer that faithfully exercises the security invariant.
- SHOULD use fuzzing for parsers, protocol boundaries, and complex attacker-controlled inputs when it provides meaningful coverage.

## Exceptions
Exceptions require the untested invariant, reason automation is impractical, alternative evidence, residual risk, owner, and review date.

## Verification
Review CI results, negative-test coverage, regression links, fuzzing evidence, manual test records, and traceability from threat/requirement to test.